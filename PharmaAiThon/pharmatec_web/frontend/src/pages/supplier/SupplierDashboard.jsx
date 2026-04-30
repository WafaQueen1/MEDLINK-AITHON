import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Truck, Map as MapIcon, Package, Bell, Phone, 
  Activity, Globe, TrendingDown, ChevronRight, LogOut,
  LayoutDashboard, Box, Zap, ShieldCheck, HeartPulse,
  CheckCircle, XCircle, Loader2, DollarSign
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { apiRequest } from '../../services/api';

const SupplierDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalOrders: 0, pendingOrders: 0 });

  const fetchOrders = async () => {
    try {
      const [orderData, statData] = await Promise.all([
        apiRequest('/supplier/orders'),
        apiRequest('/supplier/stats')
      ]);
      setOrders(orderData.orders || []);
      setStats(statData.stats);
    } catch (err) {
      console.error("Fetch Orders Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await apiRequest(`/supplier/orders/${orderId}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus })
      });
      alert(`Order ${newStatus.toUpperCase()} successfully!`);
      fetchOrders();
    } catch (err) {
      alert("Status update failed: " + err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-royal-dark flex flex-col items-center justify-center">
        <Loader2 className="text-tech-turquoise animate-spin mb-8" size={48} />
        <p className="text-white font-black tracking-[0.5em] text-[10px] uppercase">Connecting to Logistics Hub...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-tech-gray dark:bg-royal-dark flex font-sans overflow-hidden transition-colors duration-500">
      {/* Sidebar */}
      <aside className="w-80 bg-white dark:bg-royal-dark text-royal-dark dark:text-white flex flex-col p-10 relative z-20 shadow-2xl overflow-hidden border-r border-slate-200 dark:border-white/5">
        <div className="absolute top-0 right-0 w-64 h-64 bg-tech-turquoise/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
        
        <div className="flex items-center gap-4 mb-20 relative z-10">
          <div className="w-12 h-12 bg-tech-turquoise rounded-2xl flex items-center justify-center text-royal-dark shadow-2xl shadow-tech-turquoise/30">
            <Truck size={28} className="animate-pulse" />
          </div>
          <div>
            <span className="text-3xl font-black tracking-tighter block leading-none text-royal-dark dark:text-white">MEDLINK</span>
            <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">Supply Chain OS v2.5</span>
          </div>
        </div>

        <nav className="flex-1 space-y-3 relative z-10">
          {[
            { id: 'orders', label: 'Order Stream', icon: <Globe /> },
            { id: 'inventory', label: 'B2B Catalog', icon: <Box /> },
            { id: 'analytics', label: 'Market Intel', icon: <Zap /> },
            { id: 'settings', label: 'Configuration', icon: <ShieldCheck /> },
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
            Safe Eject
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-16 custom-scrollbar bg-tech-gray dark:bg-royal-dark transition-colors duration-300">
        <header className="flex justify-between items-start mb-16">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Supplier Fulfillment Node</span>
              <div className="w-1.5 h-1.5 rounded-full bg-tech-turquoise animate-ping" />
            </div>
            <h1 className="text-6xl font-black text-royal-dark dark:text-white tracking-tighter leading-none">
              Distribution <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-royal-dark dark:from-white via-royal-green to-tech-turquoise uppercase">
                Intelligence.
              </span>
            </h1>
            <p className="text-slate-400 font-bold text-xs mt-4 uppercase tracking-widest">
              Node: {user?.companyName || 'MedSupply Algeria'} • Active Network
            </p>
          </motion.div>
          
          <div className="flex gap-4">
             <div className="p-8 rounded-[3rem] bg-royal-dark text-white shadow-xl flex items-center gap-6">
                <div>
                   <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Unprocessed Load</p>
                   <p className="text-4xl font-black text-tech-turquoise">{stats.pendingOrders}</p>
                </div>
                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-tech-turquoise border border-white/10"><Activity size={24} /></div>
             </div>
          </div>
        </header>

        <AnimatePresence mode="wait">
           {activeTab === 'orders' && (
             <motion.div initial={{ opacity:0, y: 20 }} animate={{ opacity:1, y: 0 }} className="space-y-12">
                <div className="grid lg:grid-cols-12 gap-12">
                   <div className="lg:col-span-8 space-y-6">
                      <h3 className="text-xs font-black uppercase text-slate-400 tracking-[0.4em] ml-4">Live B2B Order Feed</h3>
                      {orders.length === 0 ? (
                        <div className="p-20 text-center bg-white rounded-[4rem] border-2 border-dashed border-slate-100 flex flex-col items-center">
                           <Box size={64} className="text-slate-100 mb-6" />
                           <p className="text-slate-400 font-black uppercase tracking-widest">Stream Idle • Waiting for pharmacy requests</p>
                        </div>
                      ) : (
                        orders.map(order => (
                          <div key={order.id} className="p-10 rounded-[4rem] bg-white border border-slate-100 hover:border-tech-turquoise/30 transition-all shadow-premium group relative overflow-hidden">
                             <div className={`absolute left-0 top-0 bottom-0 w-2 ${order.status === 'pending' ? 'bg-amber-400' : order.status === 'accepted' ? 'bg-royal-green' : 'bg-tech-turquoise'}`} />
                             <div className="flex justify-between items-start mb-8 relative z-10">
                                <div className="flex gap-8 items-center">
                                   <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center text-royal-dark border border-slate-100 group-hover:bg-royal-dark group-hover:text-white transition-all">
                                      <LayoutDashboard size={32} />
                                   </div>
                                   <div>
                                      <h4 className="text-2xl font-black text-royal-dark tracking-tighter uppercase mb-1">{order.pharmacy_name}</h4>
                                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">{order.pharmacy_address}</p>
                                      <div className="flex gap-4">
                                         <span className="px-4 py-1.5 bg-slate-100 text-slate-500 rounded-full text-[9px] font-black uppercase tracking-widest">ID: {order.id.slice(0,8)}</span>
                                         <span className="px-4 py-1.5 bg-tech-turquoise/10 text-tech-turquoise rounded-full text-[9px] font-black uppercase tracking-widest">{order.status}</span>
                                      </div>
                                   </div>
                                </div>
                                <div className="text-right">
                                   <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Contract Value</p>
                                   <div className="flex items-baseline gap-2 justify-end">
                                      <span className="text-4xl font-black text-royal-dark tracking-tighter">{parseFloat(order.total_amount).toLocaleString()}</span>
                                      <span className="text-xs font-black text-slate-400 uppercase tracking-widest">DZD</span>
                                   </div>
                                </div>
                             </div>

                             <div className="flex gap-4 relative z-10">
                                {order.status === 'pending' ? (
                                  <>
                                     <button onClick={() => handleUpdateStatus(order.id, 'accepted')} className="flex-1 py-5 bg-royal-dark text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-royal-green transition-all shadow-xl flex items-center justify-center gap-3">
                                        <CheckCircle size={18} /> Accept Order
                                     </button>
                                     <button onClick={() => handleUpdateStatus(order.id, 'denied')} className="px-8 py-5 border border-slate-100 rounded-2xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all">
                                        <XCircle size={24} />
                                     </button>
                                  </>
                                ) : (
                                  <div className="flex-1 p-5 bg-slate-50 rounded-2xl flex items-center justify-between">
                                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Processing Phase: {order.status.toUpperCase()}</span>
                                     <div className="flex gap-2">
                                        {order.status === 'accepted' && <button onClick={() => handleUpdateStatus(order.id, 'shipped')} className="px-6 py-2 bg-royal-dark text-white rounded-xl text-[9px] font-black uppercase">Ship Stock</button>}
                                        {order.status === 'shipped' && <button onClick={() => handleUpdateStatus(order.id, 'delivered')} className="px-6 py-2 bg-royal-green text-white rounded-xl text-[9px] font-black uppercase">Mark Delivered</button>}
                                     </div>
                                  </div>
                                )}
                             </div>
                          </div>
                        ))
                      )}
                   </div>

                   <div className="lg:col-span-4 space-y-10">
                      <div className="p-10 rounded-[3.5rem] bg-tech-turquoise text-royal-dark shadow-3xl relative overflow-hidden group">
                         <Zap className="absolute bottom-[-20px] right-[-20px] opacity-10" size={150} />
                         <div className="relative z-10">
                            <h3 className="text-xs font-black uppercase tracking-[0.3em] mb-4">Market Prediction</h3>
                            <p className="text-xl font-black leading-tight mb-8">Alger-Central showing 40% increase in antibiotic demand for Week 18.</p>
                            <div className="h-1.5 w-full bg-royal-dark/10 rounded-full overflow-hidden">
                               <motion.div animate={{ x: ['-100%', '100%'] }} transition={{ duration: 2, repeat: Infinity }} className="h-full w-1/2 bg-royal-dark" />
                            </div>
                         </div>
                      </div>
                      
                      <div className="p-12 rounded-[4rem] bg-royal-dark text-white shadow-3xl">
                         <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em] mb-10">Financial Overview</h3>
                         <div className="space-y-10">
                            <div>
                               <p className="text-[10px] font-black text-slate-500 uppercase mb-2">Total Monthly Revenue</p>
                               <div className="flex items-baseline gap-2">
                                  <span className="text-5xl font-black text-tech-turquoise tracking-tighter">1.8M</span>
                                  <span className="text-xs font-black text-white uppercase tracking-widest">DZD</span>
                               </div>
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                               <div className="p-6 rounded-3xl bg-white/5 border border-white/5">
                                  <p className="text-[9px] font-black text-slate-500 uppercase mb-2">Fulfillment Rate</p>
                                  <p className="text-2xl font-black text-royal-green">98.2%</p>
                               </div>
                               <div className="p-6 rounded-3xl bg-white/5 border border-white/5">
                                  <p className="text-[9px] font-black text-slate-500 uppercase mb-2">Active Clients</p>
                                  <p className="text-2xl font-black text-white">42</p>
                               </div>
                            </div>
                         </div>
                      </div>
                   </div>
                </div>
             </motion.div>
           )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default SupplierDashboard;
