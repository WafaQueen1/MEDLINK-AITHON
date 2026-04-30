import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  CheckCircle, 
  XCircle, 
  Database, 
  Lock, 
  Eye, 
  Activity, 
  Users, 
  Server, 
  Globe, 
  AlertTriangle, 
  Terminal,
  LogOut,
  LayoutDashboard,
  ShieldCheck,
  HeartPulse,
  Settings
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('compliance');
  const [gridStatus, setGridStatus] = useState('Optimal');
  
  const [verifications] = useState([
    { id: 101, name: 'Dr. Samir Benali', type: 'doctor', license: 'DOC-998822', date: '2026-04-28', status: 'Pending' },
    { id: 202, name: 'Pharmacie Ibn Sina', type: 'pharmacy', license: 'PH-445566', date: '2026-04-29', status: 'Pending' },
    { id: 303, name: 'MedLabs Oran', type: 'supplier', license: 'LAB-112233', date: '2026-04-29', status: 'Review' }
  ]);

  const [logs, setLogs] = useState([
    { id: 1, type: 'SUCCESS', msg: 'User Sarah Bennani (Doctor) accessed Patient Amine record (ID: 7721). Encryption verified.', time: '10:45:01', color: 'text-royal-green' },
    { id: 2, type: 'INFO', msg: 'System backup completed. 1.2GB compressed and moved to vault-01.', time: '10:42:15', color: 'text-tech-turquoise' },
    { id: 3, type: 'WARNING', msg: 'Multiple login attempts from IP 192.168.1.45. Account locked for 15m.', time: '09:30:44', color: 'text-amber-400' }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate real-time grid status
      setGridStatus(Math.random() > 0.9 ? 'Syncing' : 'Optimal');
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-tech-gray dark:bg-royal-dark flex font-sans overflow-hidden transition-colors duration-500">
      {/* Admin Power Sidebar */}
      <aside className="w-80 bg-white dark:bg-royal-dark text-royal-dark dark:text-white flex flex-col p-10 relative z-20 shadow-2xl overflow-hidden border-r border-slate-200 dark:border-white/5">
        <div className="absolute top-0 right-0 w-64 h-64 bg-tech-turquoise/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
        
        <div className="flex items-center gap-4 mb-20 relative z-10">
          <div className="w-12 h-12 bg-tech-turquoise rounded-2xl flex items-center justify-center text-royal-dark shadow-2xl shadow-tech-turquoise/30">
            <Shield size={28} className="animate-pulse" />
          </div>
          <div>
            <span className="text-3xl font-black tracking-tighter block leading-none text-royal-dark dark:text-white">MEDLINK</span>
            <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">Admin Power Suite</span>
          </div>
        </div>

        <nav className="flex-1 space-y-3 relative z-10">
          {[
            { id: 'compliance', label: 'Security Hub', icon: <ShieldCheck /> },
            { id: 'network', label: 'Network Grid', icon: <Globe /> },
            { id: 'database', label: 'Ecosystem Logs', icon: <Database /> },
            { id: 'settings', label: 'System Config', icon: <Settings /> },
          ].map((link) => (
            <button
              key={link.id}
              onClick={() => setActiveTab(link.id)}
              className={`w-full flex items-center gap-5 px-7 py-5 rounded-[2rem] font-black text-[11px] uppercase tracking-widest transition-all duration-500 group ${activeTab === link.id ? 'bg-tech-turquoise text-royal-dark shadow-3xl' : 'text-slate-500 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-royal-dark dark:hover:text-white'}`}
            >
              <span className={`transition-transform group-hover:scale-110 ${activeTab === link.id ? 'text-royal-dark' : 'text-tech-turquoise/50 dark:text-tech-turquoise/60 group-hover:dark:text-tech-turquoise'}`}>
                {React.cloneElement(link.icon, { size: 22 })}
              </span>
              {link.label}
            </button>
          ))}
        </nav>

        <div className="mt-auto pt-10 border-t border-white/5 relative z-10">
          <button onClick={logout} className="flex items-center gap-4 px-7 py-4 text-slate-500 hover:text-red-400 transition-colors font-black text-[10px] uppercase tracking-widest">
            <LogOut size={18} />
            Eject Admin Terminal
          </button>
        </div>
      </aside>

      {/* Admin Primary Viewport */}
      <main className="flex-1 overflow-y-auto p-16 custom-scrollbar bg-tech-gray dark:bg-royal-dark transition-colors duration-300">
        <header className="flex justify-between items-start mb-16">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">مركز حماية البيانات الإدارية</span>
              <div className="w-1.5 h-1.5 rounded-full bg-tech-turquoise animate-ping" />
            </div>
            <h1 className="text-6xl font-black text-royal-dark dark:text-white tracking-tighter leading-none">
              Control <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-royal-dark dark:from-white via-royal-green to-tech-turquoise uppercase">
                Dashboard
              </span>
            </h1>
            <p className="text-slate-400 font-bold text-xs mt-4 uppercase tracking-widest">
              Authenticated as Root Admin • Session Secure
            </p>
          </motion.div>
          
          <div className="flex gap-4">
            <div className="glass px-8 py-4 rounded-[2rem] border border-slate-200 shadow-sm flex items-center gap-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-xs transition-colors ${gridStatus === 'Optimal' ? 'bg-royal-green' : 'bg-amber-500'}`}>
                {gridStatus === 'Optimal' ? <Activity size={18} /> : <Server size={18} />}
              </div>
              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Grid Status</p>
                <p className="text-sm font-black text-royal-dark">{gridStatus}</p>
              </div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-10 mb-16">
          <StatCard icon={<Users />} label="Verified Nodes" value="1,240" color="bg-royal-dark" />
          <StatCard icon={<ShieldCheck />} label="Compliance Rate" value="99.9%" color="bg-tech-turquoise text-royal-dark" />
          <StatCard icon={<Database />} label="Network Data" value="4.2 TB" color="bg-royal-green" />
          <StatCard icon={<Lock />} label="Uptime Shield" value="365d" color="bg-slate-100 text-royal-dark" isDark />
        </div>

        <div className="grid lg:grid-cols-12 gap-12">
          {/* Compliance Queue */}
          <div className="lg:col-span-7">
            <div className="p-12 rounded-[4rem] bg-white border border-slate-100 shadow-xl shadow-slate-200/20">
              <div className="flex justify-between items-center mb-12">
                <h3 className="text-2xl font-black text-royal-dark tracking-tighter uppercase">License Registry</h3>
                <span className="px-4 py-2 bg-slate-50 text-slate-400 rounded-full text-[10px] font-black uppercase tracking-widest">Audit Required</span>
              </div>
              
              <div className="space-y-6">
                {verifications.map((item) => (
                  <div key={item.id} className="p-8 rounded-[2.5rem] bg-slate-50 border border-transparent hover:border-tech-turquoise/30 hover:bg-white hover:shadow-2xl transition-all group">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-royal-dark font-black text-lg border border-slate-100 shadow-sm group-hover:bg-royal-dark group-hover:text-white transition-all">
                          {item.name[0]}
                        </div>
                        <div>
                          <h3 className="font-black text-royal-dark text-xl uppercase tracking-tighter leading-none mb-2">{item.name}</h3>
                          <div className="flex gap-4">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.type} Node</span>
                            <span className="w-1 h-1 rounded-full bg-slate-200 self-center" />
                            <span className="text-[10px] font-bold text-tech-turquoise uppercase tracking-widest">{item.license}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <button className="w-12 h-12 rounded-2xl bg-white text-red-400 border border-slate-100 flex items-center justify-center hover:bg-red-50 transition-all">
                          <XCircle size={22} />
                        </button>
                        <button className="w-12 h-12 rounded-2xl bg-white text-royal-green border border-slate-100 flex items-center justify-center hover:bg-royal-green/10 transition-all">
                          <CheckCircle size={22} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Real-time Security Terminal */}
          <div className="lg:col-span-5">
            <div className="p-12 rounded-[4rem] bg-royal-dark text-white shadow-3xl relative overflow-hidden h-full">
              <div className="absolute top-0 right-0 w-64 h-64 bg-tech-turquoise/10 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2" />
              
              <div className="flex items-center gap-5 mb-12 relative z-10">
                <div className="w-16 h-16 bg-white/5 backdrop-blur-xl rounded-[2rem] flex items-center justify-center text-tech-turquoise border border-white/10">
                  <Terminal size={32} />
                </div>
                <div>
                  <h3 className="text-2xl font-black tracking-tighter leading-none mb-1">Audit Stream</h3>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Live Security Feed</p>
                </div>
              </div>

              <div className="space-y-6 relative z-10 font-mono">
                <AnimatePresence mode="popLayout">
                  {logs.map((log) => (
                    <motion.div 
                      key={log.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="p-5 rounded-[1.5rem] bg-white/5 border-l-4 border-white/10 border-l-tech-turquoise/50"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className={`text-[10px] font-black uppercase tracking-widest ${log.color}`}>[{log.type}]</span>
                        <span className="text-[10px] text-slate-500">{log.time}</span>
                      </div>
                      <p className="text-[11px] text-slate-300 leading-relaxed">{log.msg}</p>
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                <div className="pt-10 border-t border-white/10">
                  <button className="w-full py-5 rounded-[2rem] border-2 border-white/10 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white hover:border-tech-turquoise transition-all flex items-center justify-center gap-3">
                    <Database size={16} /> Generate Compliance Report (PDF)
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const StatCard = ({ icon, label, value, color, isDark }) => (
  <div className={`p-10 rounded-[4rem] ${color} ${isDark ? 'text-royal-dark border border-slate-200 bg-white' : 'text-white shadow-3xl'} relative overflow-hidden group hover:scale-[1.02] transition-all cursor-default`}>
    <div className={`absolute top-0 right-0 w-40 h-40 ${isDark ? 'bg-royal-dark/5' : 'bg-white/10'} blur-[80px] rounded-full transition-transform duration-700 group-hover:scale-125`} />
    <div className={`w-14 h-14 ${isDark ? 'bg-royal-dark text-white' : 'bg-white/20'} rounded-2xl flex items-center justify-center mb-10 relative z-10 shadow-xl`}>
      {React.cloneElement(icon, { size: 28 })}
    </div>
    <p className={`text-[10px] font-black uppercase tracking-[0.4em] ${isDark ? 'text-slate-400' : 'text-white/60'} mb-2 relative z-10`}>{label}</p>
    <p className="text-5xl font-black tracking-tighter relative z-10 leading-none">{value}</p>
  </div>
);

export default AdminDashboard;
