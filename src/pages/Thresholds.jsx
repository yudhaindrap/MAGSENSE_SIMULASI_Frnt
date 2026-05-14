// src/pages/Thresholds.jsx
import { useState } from 'react';
import { 
  Save, 
  Thermometer, 
  Droplets, 
  Wind, 
  AlertCircle,
  RotateCcw
} from 'lucide-react';

export default function Thresholds() {
  const [form, setForm] = useState({
    tempMin: 25.0,
    tempMax: 32.0,
    mediaMin: 40.0,
    mediaMax: 65.0,
    humAirMin: 60.0,
    humAirMax: 85.0
  });

  const handleSave = (e) => {
    e.preventDefault();
    alert("Konfigurasi ambang batas berhasil diperbarui dan disinkronkan ke Broker MQTT!");
  };

  const handleReset = () => {
    if(window.confirm("Kembalikan ke pengaturan default pabrik?")) {
      setForm({
        tempMin: 25.0,
        tempMax: 32.0,
        mediaMin: 40.0,
        mediaMax: 65.0,
        humAirMin: 60.0,
        humAirMax: 85.0
      });
    }
  };

  return (
    <div className="space-y-6 pb-10">

      {/* HEADER INFO */}
      <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl flex items-start gap-4">
        <div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg">
          <AlertCircle size={20} />
        </div>
        <div>
          <h4 className="text-sm font-bold text-emerald-900">Panduan Konfigurasi</h4>
          <p className="text-xs text-emerald-700 leading-relaxed">
            Parameter di bawah ini akan menentukan kapan aktuator menyala otomatis.
            Pastikan nilai minimum tidak lebih besar dari maksimum.
          </p>
        </div>
      </div>

      {/* CARD UTAMA (TIDAK DIKECILKAN) */}
      <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-200">
        <form onSubmit={handleSave} className="space-y-8">

          {/* SUHU UDARA */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-emerald-700 border-b border-slate-100 pb-2">
              <Thermometer size={18} />
              <h3 className="text-base font-black uppercase tracking-tight">
                Ambang Suhu Udara
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {/* MIN */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 uppercase">
                  Suhu Minimum (°C)
                </label>

                <input
                  type="number"
                  step="0.1"
                  value={form.tempMin}
                  onChange={e => setForm({...form, tempMin: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none font-semibold text-sm"
                />

                <p className="text-[10px] text-slate-400 italic">
                  Heater aktif jika suhu turun di bawah batas ini.
                </p>
              </div>

              {/* MAX */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 uppercase">
                  Suhu Maksimum (°C)
                </label>

                <input
                  type="number"
                  step="0.1"
                  value={form.tempMax}
                  onChange={e => setForm({...form, tempMax: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none font-semibold text-sm"
                />

                <p className="text-[10px] text-slate-400 italic">
                  Kipas aktif jika suhu melebihi batas ini.
                </p>
              </div>

            </div>
          </div>


          {/* KELEMBAPAN MEDIA */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-blue-600 border-b border-slate-100 pb-2">
              <Droplets size={18} />
              <h3 className="text-base font-black uppercase tracking-tight">
                Ambang Kelembapan Media
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 uppercase">
                  Kelembapan Min (%)
                </label>

                <input
                  type="number"
                  step="0.1"
                  value={form.mediaMin}
                  onChange={e => setForm({...form, mediaMin: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-semibold text-sm"
                />

                <p className="text-[10px] text-slate-400 italic">
                  Memulai penyiraman otomatis.
                </p>
              </div>


              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 uppercase">
                  Kelembapan Maks (%)
                </label>

                <input
                  type="number"
                  step="0.1"
                  value={form.mediaMax}
                  onChange={e => setForm({...form, mediaMax: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-semibold text-sm"
                />

                <p className="text-[10px] text-slate-400 italic">
                  Menghentikan penyiraman otomatis.
                </p>
              </div>

            </div>
          </div>


          {/* KELEMBAPAN UDARA */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-indigo-600 border-b border-slate-100 pb-2">
              <Wind size={18} />
              <h3 className="text-base font-black uppercase tracking-tight">
                Ambang Kelembapan Udara
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 uppercase">
                  RH Min (%)
                </label>

                <input
                  type="number"
                  step="0.1"
                  value={form.humAirMin}
                  onChange={e => setForm({...form, humAirMin: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-semibold text-sm"
                />

                <p className="text-[10px] text-slate-400 italic">
                  Mengaktifkan humidifier.
                </p>
              </div>


              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 uppercase">
                  RH Maks (%)
                </label>

                <input
                  type="number"
                  step="0.1"
                  value={form.humAirMax}
                  onChange={e => setForm({...form, humAirMax: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-semibold text-sm"
                />

                <p className="text-[10px] text-slate-400 italic">
                  Mengaktifkan kipas exhaust.
                </p>
              </div>

            </div>
          </div>


          {/* BUTTON ACTION */}
          <div className="flex flex-col md:flex-row items-center justify-end gap-3 pt-6 border-t border-slate-100">

            <button
              type="button"
              onClick={handleReset}
              className="w-full md:w-auto px-6 py-3 text-slate-500 font-bold hover:bg-slate-50 rounded-xl transition flex items-center justify-center gap-2"
            >
              <RotateCcw size={16} />
              Reset Default
            </button>


            <button
              type="submit"
              className="w-full md:w-auto px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl flex items-center justify-center gap-2 transition shadow-lg shadow-emerald-200 active:scale-95"
            >
              <Save size={18} />
              TERAPKAN PERUBAHAN
            </button>

          </div>

        </form>
      </div>

    </div>
  );
}