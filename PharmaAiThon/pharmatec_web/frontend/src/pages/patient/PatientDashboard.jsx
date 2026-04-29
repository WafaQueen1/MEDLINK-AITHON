import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Camera, 
  Search, 
  MapPin, 
  Pill, 
  Activity, 
  User, 
  CreditCard, 
  HeartPulse, 
  Clock, 
  ChevronRight, 
  QrCode,
  Bell,
  LogOut,
  LayoutDashboard,
  History,
  Navigation
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const PatientDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);

  useEffect(() => {
    if (isScanning) {
      const interval = setInterval(() => {
        setScanProgress(prev => (prev >= 100 ? 0 : prev + 2));
      }, 50);
      return () => clearInterval(interval);
    } else {
      setScanProgress(0);
    }
  }, [isScanning]);

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex font-sans overflow-hidden">
      {/* Patient Premium Sidebar */}
      <aside className="w-80 bg-royal-dark text-white flex flex-col p-10 relative z-20 shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-royal-green/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
        
        <div className="flex items-center gap-4 mb-20 relative z-10">
          <div className="w-12 h-12 bg-royal-green rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-royal-green/30">
            <HeartPulse size={28} className="animate-pulse" />
          </div>
          <div>
            <span className="text-3xl font-black tracking-tighter block leading-none">MEDLINK</span>
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">Patient Portal v2.0</span>
          </div>
        </div>

        <nav className="flex-1 space-y-3 relative z-10">
          {[
            { id: 'overview', label: 'My Health', icon: <LayoutDashboard /> },
            { id: 'history', label: 'Prescriptions', icon: <History /> },
            { id: 'pharmacies', label: 'Find Pharmacy', icon: <Navigation /> },
            { id: 'profile', label: 'Settings', icon: <User /> },
          ].map((link) => (
            <button
              key={link.id}
              onClick={() => setActiveTab(link.id)}
              className={`w-full flex items-center gap-5 px-7 py-5 rounded-[2rem] font-black text-[11px] uppercase tracking-widest transition-all duration-500 group ${activeTab === link.id ? 'bg-royal-green text-white shadow-3xl shadow-royal-green/30' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
            >
              <span className={`transition-transform group-hover:scale-110 ${activeTab === link.id ? 'text-white' : 'text-royal-green/50'}`}>
                {React.cloneElement(link.icon, { size: 22 })}
              </span>
              {link.label}
            </button>
          ))}
        </nav>

        <div className="mt-auto pt-10 border-t border-white/5 relative z-10">
          <button onClick={logout} className="flex items-center gap-4 px-7 py-4 text-slate-500 hover:text-red-400 transition-colors font-black text-[10px] uppercase tracking-widest">
            <LogOut size={18} />
            Secure Exit
          </button>
        </div>
      </aside>

      {/* Main Viewport */}
      <main className="flex-1 overflow-y-auto p-16 custom-scrollbar relative flex flex-col items-center">
        <div className="w-full max-w-4xl">
          <header className="flex justify-between items-start mb-16">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">بوابة المريض الرقمية</span>
                <div className="w-1.5 h-1.5 rounded-full bg-royal-green animate-ping" />
              </div>
              <h1 className="text-6xl font-black text-royal-dark tracking-tighter leading-none">
                Health <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-royal-dark via-royal-green to-tech-turquoise">
                  Ecosystem.
                </span>
              </h1>
              <p className="text-slate-400 font-bold text-xs mt-4 uppercase tracking-widest">
                Welcome, {user?.name || 'Amine'} • CNAS Insured
              </p>
            </motion.div>
            
            <div className="flex gap-4">
               <button className="w-14 h-14 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-royal-dark hover:bg-slate-50 transition-all shadow-sm">
                 <Bell size={24} />
               </button>
               <div className="w-14 h-14 rounded-2xl bg-royal-dark flex items-center justify-center text-tech-turquoise shadow-xl shadow-royal-dark/20">
                 <User size={28} />
               </div>
            </div>
          </header>

          <div className="grid lg:grid-cols-12 gap-12">
            {/* Left Column: ID & Actions */}
            <div className="lg:col-span-5 space-y-10">
              {/* Digital Chifa Card */}
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="bg-royal-dark p-10 rounded-[3.5rem] text-white shadow-3xl relative overflow-hidden group cursor-pointer"
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-royal-green/20 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2" />
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-tech-turquoise/10 blur-[80px] rounded-full -translate-x-1/2 translate-y-1/2" />
                
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-12">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-royal-green border border-white/5">
                        <CreditCard size={24} />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60">National Chifa ID</span>
                    </div>
                    <QrCode size={32} className="opacity-40" />
                  </div>
                  
                  <div className="mb-12">
                    <p className="text-sm font-bold opacity-40 uppercase tracking-widest mb-1">Insurance Coverage</p>
                    <div className="flex items-end gap-3">
                      <span className="text-6xl font-black tracking-tighter">100%</span>
                      <span className="text-xs font-black text-royal-green uppercase tracking-widest mb-3">Verified CNAS</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-end border-t border-white/10 pt-8">
                    <div>
                      <p className="text-[9px] font-black opacity-30 uppercase tracking-[0.4em] mb-2">Member Serial</p>
                      <p className="font-mono text-lg tracking-[0.2em]">1234 •••• •••• 9012</p>
                    </div>
                    <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10">
                      <Activity className="text-royal-green" />
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Quick Hub */}
              <div className="grid grid-cols-2 gap-6">
                <ActionBtn 
                  icon={<Camera />} 
                  label="Scan Ordo" 
                  color="bg-tech-turquoise/10 text-tech-turquoise border-tech-turquoise/20"
                  onClick={() => setIsScanning(true)}
                />
                <ActionBtn 
                  icon={<MapPin />} 
                  label="Pharmacies" 
                  color="bg-royal-green/10 text-royal-green border-royal-green/20" 
                />
              </div>
            </div>

            {/* Right Column: History & Stats */}
            <div className="lg:col-span-7 space-y-10">
              <div className="p-12 rounded-[4rem] bg-white border border-slate-100 shadow-xl shadow-slate-200/20">
                <div className="flex justify-between items-center mb-10">
                  <h3 className="text-2xl font-black text-royal-dark tracking-tighter uppercase">Recent History</h3>
                  <button className="text-royal-green text-[10px] font-black uppercase tracking-widest hover:underline">View Timeline</button>
                </div>

                <div className="space-y-6">
                  {[
                    { name: 'Amoxil 500mg', date: '25 Apr 2026', type: 'Antibiotic', provider: 'Dr. Samir Benali' },
                    { name: 'Panadol Extra', date: '12 Apr 2026', type: 'Painkiller', provider: 'Pharmacie Ibn Sina' },
                    { name: 'Ventoline Spray', date: '01 Apr 2026', type: 'Respiratory', provider: 'Dr. Karima Dz' }
                  ].map((item, i) => (
                    <div key={i} className="p-8 rounded-[2.5rem] bg-slate-50 border border-transparent hover:border-royal-green/20 hover:bg-white hover:shadow-2xl transition-all group cursor-pointer">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-6">
                          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-royal-green border border-slate-100 group-hover:bg-royal-green group-hover:text-white transition-all shadow-sm">
                            <Pill size={24} />
                          </div>
                          <div>
                            <h4 className="font-black text-royal-dark text-xl tracking-tighter uppercase mb-1 leading-none">{item.name}</h4>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                              {item.type} <span className="w-1 h-1 bg-slate-200 rounded-full" /> {item.date}
                            </p>
                          </div>
                        </div>
                        <ChevronRight className="text-slate-200 group-hover:text-royal-green transition-colors" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Health Activity Mini Card */}
              <div className="grid grid-cols-2 gap-10">
                <div className="p-10 rounded-[3.5rem] bg-slate-50 border border-slate-100 flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-red-400 shadow-sm mb-6">
                    <HeartPulse size={24} />
                  </div>
                  <p className="text-4xl font-black text-royal-dark tracking-tighter mb-1 leading-none">72</p>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Avg Pulse BPM</p>
                </div>
                <div className="p-10 rounded-[3.5rem] bg-slate-50 border border-slate-100 flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-royal-green shadow-sm mb-6">
                    <Clock size={24} />
                  </div>
                  <p className="text-4xl font-black text-royal-dark tracking-tighter mb-1 leading-none">14</p>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Days Since Visit</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AI-OCR Scanner Interface */}
        <AnimatePresence>
          {isScanning && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-royal-dark/95 z-[100] flex flex-col items-center justify-center p-20 backdrop-blur-2xl"
            >
              <div className="absolute top-10 right-10 flex gap-4">
                <button onClick={() => setIsScanning(false)} className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white rounded-full text-xs font-black uppercase tracking-widest transition-all">
                  Terminate Scan
                </button>
              </div>

              <div className="relative w-full max-w-lg aspect-[3/4] bg-white/5 border-2 border-white/10 rounded-[4rem] overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center opacity-20">
                  <Camera size={120} className="text-white" />
                </div>
                
                {/* Scanning Laser Line */}
                <motion.div 
                  animate={{ top: ['0%', '100%', '0%'] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  className="absolute left-0 right-0 h-1 bg-tech-turquoise shadow-[0_0_50px_#2DD4BF] z-10" 
                />

                {/* Progress Indicators */}
                <div className="absolute bottom-12 left-12 right-12">
                   <div className="flex justify-between mb-4">
                     <span className="text-[10px] font-black text-tech-turquoise uppercase tracking-widest">MedLink AI Engine</span>
                     <span className="text-[10px] font-black text-white uppercase tracking-widest">{scanProgress}%</span>
                   </div>
                   <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                     <motion.div 
                      className="h-full bg-tech-turquoise" 
                      style={{ width: `${scanProgress}%` }}
                     />
                   </div>
                </div>

                {/* Corner Markers */}
                <div className="absolute top-12 left-12 w-10 h-10 border-t-4 border-l-4 border-tech-turquoise rounded-tl-xl opacity-50" />
                <div className="absolute top-12 right-12 w-10 h-10 border-t-4 border-r-4 border-tech-turquoise rounded-tr-xl opacity-50" />
                <div className="absolute bottom-12 left-12 w-10 h-10 border-b-4 border-l-4 border-tech-turquoise rounded-bl-xl opacity-50" />
                <div className="absolute bottom-12 right-12 w-10 h-10 border-b-4 border-r-4 border-tech-turquoise rounded-br-xl opacity-50" />
              </div>

              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="mt-16 text-center"
              >
                <h2 className="text-4xl font-black text-white tracking-tighter mb-4 uppercase">Initializing AI Scan</h2>
                <p className="text-slate-500 font-bold max-w-sm uppercase text-[10px] tracking-[0.2em] leading-relaxed">
                  Extracting clinical signatures and prescription metadata via secure neural grid.
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

const ActionBtn = ({ icon, label, color, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full p-10 rounded-[3.5rem] border ${color} flex flex-col items-center gap-6 hover:scale-105 transition-all group shadow-xl shadow-transparent hover:shadow-current/5`}
  >
    <div className="w-16 h-16 rounded-[2rem] bg-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
      {React.cloneElement(icon, { size: 28 })}
    </div>
    <span className="text-[10px] font-black uppercase tracking-[0.3em]">{label}</span>
  </button>
);

export default PatientDashboard;
