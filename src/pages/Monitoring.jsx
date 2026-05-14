// src/pages/Monitoring.jsx
import { useState } from 'react';
import { 
  Thermometer, Droplets, Fan, AlertTriangle, 
  Activity, Zap, Box as BoxIcon 
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts';

// Data Mock untuk Grafik (Tren 24 Jam Terakhir)
const chartData = [
  { time: '00:00', temp: 26, hum: 70 },
  { time: '04:00', temp: 25, hum: 75 },
  { time: '08:00', temp: 28, hum: 68 },
  { time: '12:00', temp: 31, hum: 60 },
  { time: '16:00', temp: 29, hum: 65 },
  { time: '20:00', temp: 27, hum: 72 },
];

export default function Monitoring() {
  // 1. Data diperluas menjadi 3 box
  const [boxes] = useState([
    {
      id: 1, floor: 1, 
      temp: 28.5, tempStatus: 'normal',
      humidity: 70.2, humStatus: 'normal',
      media: 45.0, mediaStatus: 'warning',
      activeActuators: ['Solenoid Valve #1']
    },
    {
      id: 2, floor: 2, 
      temp: 32.5, tempStatus: 'warning',
      humidity: 75.0, humStatus: 'normal',
      media: 62.0, mediaStatus: 'normal',
      activeActuators: ['Kipas Exhaust']
    },
    {
      id: 3, floor: 3, 
      temp: 29.1, tempStatus: 'normal',
      humidity: 68.5, humStatus: 'normal',
      media: 58.0, mediaStatus: 'normal',
      activeActuators: []
    }
  ]);

  return (
    <div className="space-y-6">
      {/* SECTION 1: RINGKASAN STATISTIK */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
            <BoxIcon size={24} />
          </div>
          <div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Total Box</p>
            <p className="text-2xl font-black text-slate-800">{boxes.length} Unit</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
            <Activity size={24} />
          </div>
          <div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Rerata Suhu</p>
            <p className="text-2xl font-black text-slate-800">30.0 °C</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center">
            <Zap size={24} />
          </div>
          <div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Aktuator Aktif</p>
            <p className="text-2xl font-black text-slate-800">2 Perangkat</p>
          </div>
        </div>
      </div>

      {/* SECTION 2: GRAFIK TREN */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-slate-800">Tren Mikroklimat</h3>
            <p className="text-sm text-slate-500">Visualisasi suhu dan kelembapan 24 jam terakhir</p>
          </div>
        </div>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              />
              <Area type="monotone" dataKey="temp" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorTemp)" name="Suhu (°C)" />
              <Area type="monotone" dataKey="hum" stroke="#3b82f6" strokeWidth={3} fillOpacity={0} name="Kelembapan (%)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* SECTION 3: GRID BOX MONITORING (3 BOX) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {boxes.map((box) => (
          <div key={box.id} className={`bg-white p-6 rounded-2xl shadow-sm border-t-4 transition-all hover:shadow-md ${box.tempStatus === 'warning' || box.mediaStatus === 'warning' ? 'border-orange-500' : 'border-emerald-500'}`}>
            <div className="flex justify-between items-start mb-4 border-b pb-3">
              <h2 className="text-lg font-bold text-slate-700 uppercase">
                Ruang {box.floor} <span className="text-slate-300 mx-1">|</span> Box #{box.id}
              </h2>
              {box.tempStatus === 'warning' && <AlertTriangle className="text-orange-500 animate-pulse" size={20}/>}
            </div>
            
            <div className="space-y-5">
              {/* Suhu */}
              <div className="flex justify-between items-center group">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-emerald-50 transition-colors">
                    <Thermometer size={18} className="text-slate-500 group-hover:text-emerald-600"/>
                  </div>
                  <span className="text-sm font-medium text-slate-600">Suhu Udara</span>
                </div>
                <span className={`font-bold px-3 py-1 rounded-full text-sm ${box.tempStatus === 'warning' ? 'bg-orange-100 text-orange-700' : 'bg-slate-100 text-slate-700'}`}>
                  {box.temp.toFixed(1)} °C
                </span>
              </div>

              {/* Kel. Udara */}
              <div className="flex justify-between items-center group">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-blue-50 transition-colors">
                    <Droplets size={18} className="text-slate-500 group-hover:text-blue-600"/>
                  </div>
                  <span className="text-sm font-medium text-slate-600">Kelembapan Udara</span>
                </div>
                <span className="font-bold px-3 py-1 rounded-full text-sm bg-slate-100 text-slate-700">
                  {box.humidity.toFixed(1)} %
                </span>
              </div>

              {/* Kel. Media */}
              <div className="flex justify-between items-center group">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-orange-50 transition-colors">
                    <Droplets size={18} className="text-slate-500 group-hover:text-orange-600"/>
                  </div>
                  <span className="text-sm font-medium text-slate-600">Kelembapan Media</span>
                </div>
                <span className={`font-bold px-3 py-1 rounded-full text-sm flex items-center gap-1 ${box.mediaStatus === 'warning' ? 'bg-orange-100 text-orange-700' : 'bg-slate-100 text-slate-700'}`}>
                  {box.media.toFixed(1)} %
                </span>
              </div>
            </div>

            {/* Aktuator Section */}
            <div className="mt-6 pt-4 border-t border-slate-100">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Status Aktuator</p>
              {box.activeActuators.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {box.activeActuators.map((act, idx) => (
                    <span key={idx} className="bg-emerald-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 shadow-sm shadow-emerald-100">
                      <Fan size={12} className="animate-spin"/> {act}
                    </span>
                  ))}
                </div>
              ) : (
                <div className="flex items-center gap-2 text-slate-400 bg-slate-50 p-2 rounded-lg border border-dashed border-slate-200">
                   <div className="w-2 h-2 bg-slate-300 rounded-full"></div>
                   <span className="text-xs italic font-medium">Standby Mode</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}