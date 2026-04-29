import React from 'react';
import { motion } from 'framer-motion';
import { Home, Activity, Map, Settings, Search, LogOut, Shield } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuth();

  const getDashboardPath = () => {
    if (!user) return '/login';
    const map = {
      doctor: '/doctor',
      pharmacist: '/pharmacist',
      patient: '/patient',
      supplier: '/supplier',
      admin: '/admin'
    };
    return map[user.role] || '/login';
  };

  const menuItems = [
    { icon: <Home size={20} />, label: 'Dashboard', path: getDashboardPath() },
    { icon: <Activity size={20} />, label: 'Live Stream', path: '/activity' },
    { icon: <Map size={20} />, label: 'Wilaya Map', path: '/map' },
    { icon: <Settings size={20} />, label: 'Settings', path: '/settings' },
  ];

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-royal-dark text-white p-6 flex flex-col z-50 shadow-2xl">
      <div className="flex items-center gap-3 mb-12 px-2">
        <div className="w-10 h-10 bg-tech-turquoise rounded-xl flex items-center justify-center text-royal-dark font-black shadow-lg">
          <Shield size={24} />
        </div>
        <span className="text-xl font-black tracking-tighter">MED<span className="text-tech-turquoise">LINK</span></span>
      </div>

      <div className="relative mb-10">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-royal-light opacity-30" size={16} />
        <input 
          placeholder="Command... (K)" 
          className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-xs font-bold uppercase tracking-widest outline-none focus:bg-white/10 transition-all placeholder:text-white/10"
        />
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <motion.button
              key={item.label}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all relative overflow-hidden group ${
                isActive 
                ? 'bg-tech-turquoise text-royal-dark shadow-xl shadow-tech-turquoise/20' 
                : 'text-royal-light/60 hover:bg-white/5 hover:text-white'
              }`}
            >
              {item.icon}
              <span className="relative z-10">{item.label}</span>
            </motion.button>
          );
        })}
      </nav>

      <div className="pt-6 border-t border-white/10 mt-auto">
        <div className="mb-6 px-4">
          <p className="text-[10px] font-black text-royal-light/30 uppercase tracking-[0.2em] mb-2">Authenticated as</p>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-tech-turquoise/10 flex items-center justify-center text-tech-turquoise font-black text-xs border border-tech-turquoise/20 uppercase">
              {user?.role?.slice(0, 2)}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-black truncate">{user?.email}</p>
            </div>
          </div>
        </div>
        <button 
          onClick={logout}
          className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-red-400 hover:bg-red-400/10 transition-all"
        >
          <LogOut size={20} />
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
