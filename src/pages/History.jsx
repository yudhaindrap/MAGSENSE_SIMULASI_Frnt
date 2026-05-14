// src/pages/History.jsx
import { useState } from 'react';
import { 
  History as HistoryIcon, 
  Download, 
  Filter, 
  Search, 
  ChevronLeft, 
  ChevronRight,
  FileSpreadsheet,
  Calendar
} from 'lucide-react';

export default function HistoryPage() {
  // Mock Data yang lebih lengkap
  const [logs] = useState([
    { id: 1, time: '2026-04-22 10:05:22', box: 1, temp: 28.5, rh: 70.2, media: 45.0, phase: 'Adult Larva', act: 'Valve #1', status: 'normal' },
    { id: 2, time: '2026-04-22 10:05:15', box: 2, temp: 32.5, rh: 75.0, media: 62.0, phase: 'Prepupa', act: 'Kipas IN/OUT', status: 'warning' },
    { id: 3, time: '2026-04-22 10:00:00', box: 3, temp: 29.1, rh: 68.5, media: 58.0, phase: 'Baby Larva', act: '-', status: 'normal' },
    { id: 4, time: '2026-04-22 09:55:10', box: 1, temp: 28.4, rh: 70.0, media: 44.5, phase: 'Adult Larva', act: '-', status: 'normal' },
    { id: 5, time: '2026-04-22 09:50:00', box: 2, temp: 31.8, rh: 74.2, media: 61.5, phase: 'Prepupa', act: 'Kipas IN/OUT', status: 'warning' },
  ]);

  const getPhaseColor = (phase) => {
    switch(phase) {
      case 'Baby Larva': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'Adult Larva': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'Prepupa': return 'bg-purple-50 text-purple-600 border-purple-100';
      default: return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* SECTION 1: TOOLBAR (FILTER & EXPORT) */}
      <div className="flex flex-col xl:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Cari ID Box atau Kejadian..." 
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 transition-all outline-none"
            />
          </div>
          
          {/* Date Picker Dummy */}
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
            <Calendar size={18} className="text-slate-400" />
            22 Apr 2026
          </button>

          {/* Filter Dropdown Dummy */}
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
            <Filter size={18} className="text-slate-400" />
            Filter Box
          </button>
        </div>

        <div className="flex items-center gap-2 w-full xl:w-auto">
          <button className="flex-1 xl:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100">
            <Download size={18} />
            Export CSV
          </button>
          <button className="p-2 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors">
            <FileSpreadsheet size={20} />
          </button>
        </div>
      </div>

      {/* SECTION 2: DATA TABLE */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Waktu (WIB)</th>
                <th className="px-6 py-4 text-center">Box</th>
                <th className="px-6 py-4">Suhu</th>
                <th className="px-6 py-4">RH Udara</th>
                <th className="px-6 py-4">RH Media</th>
                <th className="px-6 py-4">Fase Dominan</th>
                <th className="px-6 py-4">Aktuator Aktif</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-slate-700 font-medium">{log.time.split(' ')[1]}</span>
                      <span className="text-[10px] text-slate-400 font-bold">{log.time.split(' ')[0]}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-block px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg font-black text-xs">
                      #{log.box}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-slate-700 font-semibold">{log.temp}°C</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-slate-700 font-semibold">{log.rh}%</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-slate-700 font-semibold">{log.media}%</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full border text-[11px] font-black uppercase tracking-tight ${getPhaseColor(log.phase)}`}>
                      {log.phase}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {log.act !== '-' ? (
                        <span className="text-emerald-600 font-medium flex items-center gap-1.5">
                          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                          {log.act}
                        </span>
                      ) : (
                        <span className="text-slate-300 italic">Idle</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`w-2.5 h-2.5 rounded-full inline-block ${log.status === 'warning' ? 'bg-orange-400' : 'bg-emerald-400'}`}></span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* SECTION 3: PAGINATION */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <p className="text-xs text-slate-500 font-medium">
            Menampilkan <span className="font-bold text-slate-700">1 - 5</span> dari <span className="font-bold text-slate-700">1,240</span> entri
          </p>
          <div className="flex items-center gap-2">
            <button className="p-2 border border-slate-200 rounded-lg bg-white text-slate-400 hover:text-slate-600 transition-colors disabled:opacity-50" disabled>
              <ChevronLeft size={18} />
            </button>
            <div className="flex items-center gap-1">
              <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-emerald-600 text-white text-xs font-bold shadow-md shadow-emerald-100">1</button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50">2</button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50">3</button>
            </div>
            <button className="p-2 border border-slate-200 rounded-lg bg-white text-slate-600 hover:bg-slate-50 transition-colors">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}