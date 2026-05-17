import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

const BACKEND_IP = "192.168.18.228"; // ⚠️ GANTI DENGAN IP LAPTOPMU

export default function CameraSender() {
  const localVideoRef = useRef(null);
  const peerConnection = useRef(null);
  const socket = useRef(null);
  const streamRef = useRef(null);
  const [status, setStatus] = useState("Siap");

  // Pembersihan otomatis saat komponen ditutup/unmount
  useEffect(() => {
    return () => {
      stopStream();
    };
  }, []);

  const stopStream = () => {
    if (socket.current) {
      socket.current.disconnect();
      socket.current = null;
    }
    if (peerConnection.current) {
      peerConnection.current.close();
      peerConnection.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const startStream = async () => {
    try {
      // Bersihkan koneksi lama terlebih dahulu jika ada klik ganda
      stopStream();

      setStatus("Membuka Kamera...");
      
      // 1. Konek ke Python AI Server (Port 5002)
      socket.current = io(`http://${BACKEND_IP}:5002`);

      // 2. Ambil Kamera Belakang HP tanpa Audio
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
        audio: false
      });
      
      streamRef.current = stream;
      if (localVideoRef.current) localVideoRef.current.srcObject = stream;

      // 3. Inisialisasi WebRTC Peer Connection
      peerConnection.current = new RTCPeerConnection({
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] // STUN Server gratis Google
      });

      // 4. Masukkan track video kamera ke WebRTC
      stream.getTracks().forEach(track => {
        peerConnection.current.addTrack(track, stream);
      });

      // 5. Kirim ICE Candidate jika ditemukan jalur jaringan
      peerConnection.current.onicecandidate = (event) => {
        if (event.candidate && socket.current) {
          socket.current.emit("webrtc-candidate", event.candidate);
        }
      };

      // 6. Buat Penawaran Koneksi (Offer)
      const offer = await peerConnection.current.createOffer();
      await peerConnection.current.setLocalDescription(offer);
      socket.current.emit("webrtc-offer", offer);
      setStatus("Streaming Berjalan... Cek Dashboard di Laptop!");

      // 7. Dengarkan Jawaban (Answer) dari Laptop/Python
      socket.current.on("webrtc-answer", async (answer) => {
        try {
          // PENGAMAN: Hanya set remote description jika state lokal memang sedang menunggu penawaran (have-local-offer)
          if (peerConnection.current && peerConnection.current.signalingState === "have-local-offer") {
            await peerConnection.current.setRemoteDescription(new RTCSessionDescription(answer));
          }
        } catch (err) {
          console.error("Gagal memproses remote description (answer):", err);
        }
      });

      // 8. Dengarkan kandidat jalur dari Laptop/Python
      socket.current.on("webrtc-candidate", async (candidate) => {
        try {
          // PENGAMAN: Hanya tambahkan ICE candidate jika deskripsi remote (miliki laptop) sudah selesai dikonfigurasi
          if (peerConnection.current && peerConnection.current.remoteDescription) {
            await peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
          }
        } catch (err) {
          console.error("Gagal menambahkan ICE candidate:", err);
        }
      });

    } catch (err) {
      console.error(err);
      setStatus("Error: " + err.message);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto text-center space-y-4">
      <h2 className="text-xl font-bold">Kamera HP (WebRTC Sender)</h2>
      <p className="text-sm bg-slate-100 p-2 rounded text-slate-600">Status: {status}</p>
      <div className="bg-black rounded-xl overflow-hidden aspect-video">
        <video ref={localVideoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
      </div>
      <button 
        onClick={startStream}
        className="w-full bg-emerald-600 text-white font-bold py-3 rounded-xl shadow hover:bg-emerald-700 transition"
      >
        Mulai Kirim Stream Kamera
      </button>
    </div>
  );
}