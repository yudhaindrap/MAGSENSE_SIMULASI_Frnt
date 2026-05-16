import { useState, useEffect, useRef } from 'react';
import { Camera, PlayCircle, Bug } from 'lucide-react';
import { io } from 'socket.io-client';

const BACKEND_IP = "192.168.1.7"; // ⚠️ GANTI DENGAN IP LAPTOPMU

export default function Growth() {
  const [selectedCamera, setSelectedCamera] = useState('Lantai 2');
  const [isStreaming, setIsStreaming] = useState(false);
  const remoteVideoRef = useRef(null);
  const peerConnection = useRef(null);
  const socket = useRef(null);

  // Mock Data YOLOv8
  const detectionData = {
    time: "10:00 WIB",
    babyLarva: 12,
    adultLarva: 45,
    prepupa: 10,
    pupa: 0,
    dominant: "ADULT LARVA"
  };

  useEffect(() => {
    if (isStreaming) {
      // 1. Konek ke Signaling Server
      socket.current = io(`http://${BACKEND_IP}:5000`);

      // 2. Buat WebRTC Instance untuk Menerima Video
      peerConnection.current = new RTCPeerConnection({
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
      });

      // 3. Jika dapat track video dari HP, pasang ke tag <video>
      peerConnection.current.ontrack = (event) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = event.streams[0];
        }
      };

      // 4. Kirim balik ICE Candidate laptop ke HP
      peerConnection.current.onicecandidate = (event) => {
        if (event.candidate) {
          socket.current.emit("webrtc-candidate", event.candidate);
        }
      };

      // 5. Terima penawaran (Offer) dari HP, lalu buat Jawaban (Answer)
      socket.current.on("webrtc-offer", async (offer) => {
        await peerConnection.current.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await peerConnection.current.createAnswer();
        await peerConnection.current.setLocalDescription(answer);
        socket.current.emit("webrtc-answer", answer);
      });

      // 6. Terima Kandidate jalur dari HP
      socket.current.on("webrtc-candidate", async (candidate) => {
        await peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
      });

    } else {
      // Jika stream dimatikan, putus koneksi
      if (socket.current) socket.current.disconnect();
      if (peerConnection.current) peerConnection.current.close();
    }

    return () => {
      if (socket.current) socket.current.disconnect();
      if (peerConnection.current) peerConnection.current.close();
    };
  }, [isStreaming]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <select 
            className="p-2 border rounded-lg bg-white outline-none"
            value={selectedCamera}
            onChange={(e) => setSelectedCamera(e.target.value)}
          >
            <option>Ruang 2</option>
            <option>Ruang 3</option>
          </select>
          <button 
            onClick={() => setIsStreaming(!isStreaming)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition ${isStreaming ? 'bg-red-100 text-red-600' : 'bg-emerald-600 text-white hover:bg-emerald-700'}`}
          >
            <PlayCircle size={18} />
            {isStreaming ? 'Hentikan Stream' : 'Buka Live Stream'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Video Player Area */}
        <div className="lg:col-span-2 bg-slate-900 rounded-2xl aspect-video flex flex-col items-center justify-center text-slate-500 border-4 border-slate-800 overflow-hidden relative">
          {isStreaming ? (
            <video 
              ref={remoteVideoRef} 
              autoPlay 
              playsInline 
              className="w-full h-full object-cover absolute inset-0"
            />
          ) : (
            <>
              <Camera size={48} className="mb-4 opacity-50" />
              <p>Live stream tidak aktif</p>
            </>
          )}
        </div>

        {/* Detection Results */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col">
          <h3 className="text-lg font-bold text-slate-700 mb-2">Hasil Deteksi Terakhir</h3>
          <p className="text-sm text-slate-400 mb-6 border-b pb-4">Diperbarui: {detectionData.time}</p>
          
          <div className="space-y-4 flex-1">
            <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg">
              <span className="flex items-center gap-2 text-slate-600"><Bug size={16}/> Baby Larva</span>
              <span className="font-bold">{detectionData.babyLarva} Objek</span>
            </div>
            <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg">
              <span className="flex items-center gap-2 text-slate-600"><Bug size={16}/> Adult Larva</span>
              <span className="font-bold text-emerald-600">{detectionData.adultLarva} Objek</span>
            </div>
            <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg">
              <span className="flex items-center gap-2 text-slate-600"><Bug size={16}/> Prepupa</span>
              <span className="font-bold">{detectionData.prepupa} Objek</span>
            </div>
            <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg">
              <span className="flex items-center gap-2 text-slate-600"><Bug size={16}/> Pupa</span>
              <span className="font-bold">{detectionData.pupa} Objek</span>
            </div>
          </div>

          <div className="mt-6 p-4 bg-emerald-50 rounded-xl border border-emerald-100 text-center">
            <p className="text-sm text-emerald-600 mb-1">Fase Dominan</p>
            <p className="text-xl font-black text-emerald-800">{detectionData.dominant}</p>
          </div>
        </div>
      </div>
    </div>
  );
}