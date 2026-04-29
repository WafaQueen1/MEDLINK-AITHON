import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Truck, 
  Map as MapIcon, 
  Package, 
  Bell, 
  Phone, 
  Activity, 
  Globe, 
  TrendingDown, 
  ChevronRight, 
  LogOut,
  LayoutDashboard,
  Box,
  Zap,
  ShieldCheck,
  HeartPulse
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const SupplierDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('logistics');
  const [heatmapData, setHeatmapData] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    setHeatmapData([
      { wilaya: "Alger", intensity: 0.85, missing: "Doliprane 1g", trend: 'up' },
      { wilaya: "Oran", intensity: 0.45, missing: "Ventoline", trend: 'down' },
      { wilaya: "Constantine", intensity: 0.65, missing: "Glucophage", trend: 'stable' },
      { wilaya: "Setif", intensity: 0.30, missing: "Lovenox", trend: 'up' },
      { wilaya: "Tizi Ouzou", intensity: 0.90, missing: "Clamoxyl", trend: 'up' }
    ]);

    setOrders([
      { id: 1, pharmacy: 'Pharmacie Centrale', items: 'Doliprane 1g (x50)', status: 'Urgent', time: '10m ago' },
      { id: 2, pharmacy: 'Pharmacie El Hana', items: 'Lovenox (x20)', status: 'Standard', time: '45m ago' },
      { id: 3, pharmacy: 'Clinique Al-Atlas', items: 'Insulin Glargine (x100)', status: 'Urgent', time: '2h ago' }
    ]);
  }, []);

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex font-sans overflow-hidden">
      {/* Supplier Premium Sidebar */}
      <aside className="w-80 bg-royal-dark text-white flex flex-col p-10 relative z-20 shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-tech-turquoise/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
        
        <div className="flex items-center gap-4 mb-20 relative z-10">
          <div className="w-12 h-12 bg-tech-turquoise rounded-2xl flex items-center justify-center text-royal-dark shadow-2xl shadow-tech-turquoise/30">
            <Truck size={28} className="animate-pulse" />
          </div>
          <div>
            <span className="text-3xl font-black tracking-tighter block leading-none">MEDLINK</span>
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">Supply Chain OS</span>
          </div>
        </div>

        <nav className="flex-1 space-y-3 relative z-10">
          {[
            { id: 'logistics', label: 'Global Hub', icon: <Globe /> },
            { id: 'inventory', label: 'Restock Hub', icon: <Box /> },
            { id: 'shortage', label: 'Predictive AI', icon: <Zap /> },
            { id: 'profile', label: 'Provider Profile', icon: <ShieldCheck /> },
          ].map((link) => (
            <button
              key={link.id}
              onClick={() => setActiveTab(link.id)}
              className={`w-full flex items-center gap-5 px-7 py-5 rounded-[2rem] font-black text-[11px] uppercase tracking-widest transition-all duration-500 group ${activeTab === link.id ? 'bg-tech-turquoise text-royal-dark shadow-3xl' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
            >
              <span className={`transition-transform group-hover:scale-110 ${activeTab === link.id ? 'text-royal-dark' : 'text-tech-turquoise/50'}`}>
                {React.cloneElement(link.icon, { size: 22 })}
              </span>
              {link.label}
            </button>
          ))}
        </nav>

        <div className="mt-auto pt-10 border-t border-white/5 relative z-10">
          <button onClick={logout} className="flex items-center gap-4 px-7 py-4 text-slate-500 hover:text-red-400 transition-colors font-black text-[10px] uppercase tracking-widest">
            <LogOut size={18} />
            Eject Node
          </button>
        </div>
      </aside>

      {/* Main Viewport */}
      <main className="flex-1 overflow-y-auto p-16 custom-scrollbar relative">
        <header className="flex justify-between items-start mb-16">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">مركز التوزيع اللوجستي الوطني</span>
              <div className="w-1.5 h-1.5 rounded-full bg-tech-turquoise animate-ping" />
            </div>
            <h1 className="text-6xl font-black text-royal-dark tracking-tighter leading-none">
              Logistics <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-royal-dark via-royal-green to-tech-turquoise">
                Intelligence.
              </span>
            </h1>
            <p className="text-slate-400 font-bold text-xs mt-4 uppercase tracking-widest">
              Supply Node: DZ-NORTH-01 • Active Streams
            </p>
          </motion.div>
          
          <div className="flex gap-4">
            <div className="glass px-8 py-4 rounded-[2rem] border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="w-10 h-10 bg-royal-dark rounded-xl flex items-center justify-center text-tech-turquoise font-black text-xs">
                <Activity size={18} />
              </div>
              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Fleet Status</p>
                <p className="text-sm font-black text-royal-dark">94% Operational</p>
              </div>
            </div>
          </div>
        </header>

        <div className="grid lg:grid-cols-12 gap-12">
          {/* Left Column: Predictive Heatmap */}
          <div className="lg:col-span-8">
            <div className="p-12 rounded-[4rem] bg-white border border-slate-100 shadow-xl shadow-slate-200/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-royal-green/5 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2" />
              
              <div className="flex justify-between items-center mb-12 relative z-10">
                <div>
                  <h3 className="text-2xl font-black text-royal-dark tracking-tighter uppercase">Predictive Shortage Heatmap</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Live AI Monitoring</p>
                </div>
                <div className="flex gap-2">
                  <span className="px-4 py-2 bg-royal-green/10 text-royal-green rounded-full text-[10px] font-black uppercase tracking-widest">Real-time</span>
                </div>
              </div>

              <div className="space-y-6 relative z-10">
                {heatmapData.map((item, index) => (
                  <motion.div 
                    key={index}
                    whileHover={{ x: 10 }}
                    className="p-8 rounded-[2.5rem] bg-slate-50 border border-transparent hover:border-tech-turquoise/30 hover:bg-white hover:shadow-2xl transition-all group"
                  >
                    <div className="flex items-center gap-8">
                      <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-royal-dark font-black text-lg border border-slate-100 shadow-sm group-hover:bg-royal-dark group-hover:text-white transition-all">
                        {item.wilaya.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-4">
                          <div>
                            <h4 className="font-black text-royal-dark text-xl tracking-tighter uppercase mb-1">{item.wilaya}</h4>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Primary Deficit: <span className="text-royal-dark">{item.missing}</span></p>
                          </div>
                          <div className="text-right">
                            <span className="text-2xl font-black text-royal-dark tracking-tighter">{Math.round(item.intensity * 100)}%</span>
                            <p className="text-[9px] font-black text-red-400 uppercase tracking-widest">Shortage risk</p>
                          </div>
                        </div>
                        <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${item.intensity * 100}%` }}
                            transition={{ duration: 1.5, delay: index * 0.1 }}
                            className={`h-full ${item.intensity > 0.7 ? 'bg-red-400' : 'bg-tech-turquoise'}`} 
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Marketplace & Restock */}
          <div className="lg:col-span-4 space-y-10">
            {/* Restock Terminal */}
            <div className="p-12 rounded-[4rem] bg-royal-dark text-white shadow-3xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-tech-turquoise/10 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2" />
              
              <div className="flex items-center gap-5 mb-12 relative z-10">
                <div className="w-16 h-16 bg-white/5 backdrop-blur-xl rounded-[2rem] flex items-center justify-center text-tech-turquoise border border-white/10">
                  <Package size={32} />
                </div>
                <div>
                  <h3 className="text-2xl font-black tracking-tighter leading-none mb-1">Restock Feed</h3>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">B2B Order Stream</p>
                </div>
              </div>

              <div className="space-y-6 relative z-10">
                {orders.map(order => (
                  <div key={order.id} className="p-6 rounded-[2rem] bg-white/5 border border-white/5 relative group hover:bg-white/10 transition-all cursor-pointer">
                    <div className={`absolute left-0 top-6 bottom-6 w-1 rounded-full ${order.status === 'Urgent' ? 'bg-red-400 shadow-[0_0_15px_#f87171]' : 'bg-tech-turquoise shadow-[0_0_15px_#2DD4BF]'}`} />
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-black text-sm uppercase tracking-tight">{order.pharmacy}</h4>
                      <span className="text-[9px] font-black text-slate-500 uppercase">{order.time}</span>
                    </div>
                    <p className="text-xs text-slate-400 mb-6 font-medium">{order.items}</p>
                    <div className="flex gap-2">
                      <button className="flex-1 py-3 bg-white/10 hover:bg-tech-turquoise hover:text-royal-dark rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">Accept Order</button>
                      <button className="w-12 h-10 bg-white/5 hover:bg-white/20 rounded-xl flex items-center justify-center transition-all text-slate-400">
                        <Phone size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Smart Alert */}
            <div className="p-10 rounded-[3.5rem] bg-tech-turquoise text-royal-dark shadow-3xl relative overflow-hidden group cursor-pointer">
              <Zap className="absolute bottom-[-10px] right-[-10px] opacity-10" size={120} />
              <div className="flex items-center gap-3 mb-4">
                <Bell size={20} className="animate-bounce" />
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em]">Neural Alert</h4>
              </div>
              <p className="text-sm font-black leading-relaxed">
                Insulin supplies are expected to drop in Oran by 30% next week. Pre-allocate DZ-WEST units now.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SupplierDashboard;
