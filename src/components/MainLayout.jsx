// src/components/MainLayout.jsx
import { Link, useLocation, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, Thermometer, Camera, 
  CalendarClock, History, Settings, LogOut,
  ChevronRight, Bell, User 
} from 'lucide-react';

// Mengimpor logo dari folder assets
import maggotLogo from '../assets/maggot.png';

const Sidebar = ({ setToken }) => {
  const location = useLocation();
  
  const menuItems = [
    { path: '/', name: 'Dashboard', icon: LayoutDashboard },
    { path: '/monitoring', name: 'Mikroklimat', icon: Thermometer },
    { path: '/growth', name: 'Fase Pertumbuhan', icon: Camera },
    { path: '/prediction', name: 'Prediksi Panen', icon: CalendarClock },
    { path: '/history', name: 'Riwayat Data', icon: History },
    { path: '/thresholds', name: 'Parameter Ambang', icon: Settings },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  return (
    <nav className="w-full md:w-64 bg-white border-r border-slate-200 p-4 flex flex-row md:flex-col md:h-screen sticky top-0 z-20 shadow-sm md:shadow-none">
      
      {/* LOGO SECTION */}
      <div className="hidden md:flex items-center gap-2 mb-6 px-2">
        {/* Container Logo 1x1 */}
        <div className="w-14 h-14 flex-shrink-0">
          <img 
            src={maggotLogo} 
            alt="Maggot Logo" 
            className="w-full h-full object-contain"
          />
        </div>
        <div className="text-2xl font-black text-emerald-700 tracking-tight leading-none">
          MAG<span className="text-slate-400 font-light">-SENSE</span>
        </div>
      </div>
      
      {/* MENU NAVIGASI */}
      <div className="flex flex-row md:flex-col gap-1.5 w-full md:flex-1 overflow-y-auto custom-scrollbar ">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link 
              key={item.path}
              to={item.path} 
              className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 whitespace-nowrap ${
                isActive 
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' 
                : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              <Icon size={20}/> 
              <span className="hidden md:inline font-medium">{item.name}</span>
            </Link>
          );
        })}
      </div>

      {/* TOMBOL LOGOUT */}
      <div className="md:mt-auto pt-4 border-t border-slate-100">
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 p-3 w-full rounded-xl text-red-500 hover:bg-red-50 transition-colors group"
        >
          <LogOut size={20} className="group-hover:-translate-x-1 transition-transform"/>
          <span className="hidden md:inline font-bold">Logout</span>
        </button>
      </div>
    </nav>
  );
};

const MainLayout = ({ setToken }) => {
  const location = useLocation();

  const menuItems = [
    { path: '/', name: 'Dashboard' },    
    { path: '/monitoring', name: 'Monitoring Mikroklimat' },
    { path: '/growth', name: 'Analisis Fase Pertumbuhan' },
    { path: '/prediction', name: 'Estimasi Prediksi Panen' },
    { path: '/history', name: 'Riwayat Log Data' },
    { path: '/thresholds', name: 'Pengaturan Ambang Otomasi' },
  ];

  const currentPage = menuItems.find(item => item.path === location.pathname);
  const pageTitle = currentPage ? currentPage.name : 'Halaman Tidak Dikenal';

  return (
    <div className="flex flex-col md:flex-row h-screen bg-slate-50 text-slate-900 font-sans overflow-hidden">
      
      <Sidebar setToken={setToken} />
      
      <div className="flex-1 flex flex-col min-w-0 h-full">
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 z-10 px-4 md:px-8 py-3">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <ChevronRight size={18} className="text-slate-300 hidden sm:block" />
              <h1 className="text-slate-800 font-bold tracking-tight text-lg md:text-xl">
                {pageTitle}
              </h1>
            </div>

            <div className="flex items-center gap-3 md:gap-6">
              <div className="flex items-center gap-2 border-l border-slate-200 pl-4">
                <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full relative">
                  <Bell size={18} />
                  <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                </button>
                <div className="flex items-center gap-2 px-2 py-1 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors group">
                  <div className="w-8 h-8 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center font-bold text-xs">
                  </div>
                  <div className="hidden lg:block">
                    <p className="text-[10px] font-bold text-slate-400 uppercase leading-none mb-1">Koordinator</p>
                    <p className="text-xs font-bold text-slate-700 leading-none">Pembudidaya</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;