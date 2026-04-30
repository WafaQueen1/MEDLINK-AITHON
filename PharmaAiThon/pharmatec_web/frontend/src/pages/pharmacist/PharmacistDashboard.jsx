import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CreditCard, CheckCircle, Clock, Search, ChevronRight, 
  Package, ShieldCheck, Activity, Stethoscope, Loader2, 
  Wifi, HeartPulse, LayoutDashboard, Bell, Cpu, 
  Megaphone, Send, AlertCircle, ShoppingCart, Truck, Plus, Trash2
} from 'lucide-react';
import { apiRequest } from '../../services/api';

const PharmacistDashboard = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [activeRequest, setActiveRequest] = useState(null);
  const [coverage, setCoverage] = useState(80);
  const [isDispensing, setIsDispensing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [latency, setLatency] = useState(24);
  const [activeTab, setActiveTab] = useState('incoming');
  
  // Promotions State
  const [myPromotions, setMyPromotions] = useState([]);
  const [promotionForm, setPromotionForm] = useState({
    title: '', description: '', type: 'Discount',
    medicine_names: '', discount_percentage: '', expiry_date: ''
  });

  // Stock State
  const [suppliers, setSuppliers] = useState([]);
  const [stockOrders, setStockOrders] = useState([]);
  const [stockForm, setStockForm] = useState({ supplier_id: '', items: '', amount: '' });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [reqs, promos, sups] = await Promise.all([
          apiRequest('/pharmacist/requests'),
          apiRequest('/promotions/my'),
          apiRequest('/public/suppliers')
        ]);
        setPrescriptions(reqs);
        setMyPromotions(promos.promotions || []);
        setSuppliers(sups.suppliers || []);
        if (reqs.length > 0 && !activeRequest) setActiveRequest(reqs[0]);
      } catch (error) {
        console.error('Data sync failed:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
    const intervalId = setInterval(loadData, 10000);
    return () => clearInterval(intervalId);
  }, []);

  const handlePromotionSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiRequest('/promotions', {
        method: 'POST',
        body: JSON.stringify(promotionForm)
      });
      alert("✅ Promotion published!");
      setPromotionForm({ title: '', description: '', type: 'Discount', medicine_names: '', discount_percentage: '', expiry_date: '' });
      // Refresh promos
      const data = await apiRequest('/promotions/my');
      setMyPromotions(data.promotions);
    } catch (err) {
      alert("Publishing failed: " + err.message);
    }
  };

  const handleStockOrder = async (e) => {
    e.preventDefault();
    try {
      await apiRequest('/pharmacist/request-stock', {
        method: 'POST',
        body: JSON.stringify({
          supplier_id: stockForm.supplier_id,
          total_amount: stockForm.amount
        })
      });
      alert("🚀 Stock request sent to supplier!");
      setStockForm({ supplier_id: '', items: '', amount: '' });
    } catch (err) {
      alert("Stock request failed: " + err.message);
    }
  };

  const handleDispense = async () => {
    if (!activeRequest) return;
    setIsDispensing(true);
    try {
      const chifaType = coverage === 100 ? '100' : (coverage === 80 ? '80' : 'NONE');
      await apiRequest(`/pharmacist/verify-chifa/${activeRequest.id}`, {
        method: 'POST',
        body: JSON.stringify({ chifa_type: chifaType })
      });
      setIsDispensing(false);
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 3000);
      // Refresh requests
      const reqs = await apiRequest('/pharmacist/requests');
      setPrescriptions(reqs);
      setActiveRequest(null);
    } catch (err) {
      alert("Dispensing failed: " + err.message);
      setIsDispensing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-royal-dark flex flex-col items-center justify-center">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2 }} className="w-20 h-20 border-4 border-tech-turquoise border-t-transparent rounded-[2.5rem] mb-10" />
        <p className="text-white font-black tracking-[0.6em] text-[10px] uppercase">Syncing Terminal...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-tech-gray dark:bg-royal-dark flex overflow-hidden font-sans transition-all duration-500">
      {/* Sidebar */}
      <aside className="w-96 bg-white dark:bg-royal-dark text-royal-dark dark:text-white flex flex-col p-10 relative z-20 shadow-2xl border-r border-slate-200 dark:border-white/5">
        <div className="flex items-center gap-4 mb-16 relative z-10">
          <div className="w-12 h-12 bg-tech-turquoise rounded-2xl flex items-center justify-center text-royal-dark shadow-2xl">
            <HeartPulse size={28} />
          </div>
          <div>
            <span className="text-3xl font-black tracking-tighter block leading-none text-royal-dark dark:text-white">MEDLINK</span>
            <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">Dispensing Terminal v3.0</span>
          </div>
        </div>

        <div className="relative z-10 flex-1 flex flex-col">
          <div className="mb-8 flex flex-col gap-2">
            {[
              { id: 'incoming', label: 'Dispense Hub', icon: <Package /> },
              { id: 'promotions', label: 'My Promotions', icon: <Megaphone /> },
              { id: 'stock', label: 'Stock Orders', icon: <ShoppingCart /> },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-4 px-6 py-4 rounded-2xl transition-all ${activeTab === tab.id ? 'bg-tech-turquoise text-royal-dark font-black shadow-lg shadow-tech-turquoise/20' : 'hover:bg-slate-50 dark:hover:bg-white/5 text-slate-500 dark:text-slate-300 font-bold hover:text-royal-dark dark:hover:text-white'}`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar-dark">
            <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4 px-4">Active Stream</h2>
            <AnimatePresence mode="popLayout">
              {prescriptions.map((req) => (
                <motion.div 
                  layout key={req.id}
                  onClick={() => {setActiveRequest(req); setActiveTab('incoming');}}
                  className={`p-6 rounded-[2.5rem] cursor-pointer group transition-all duration-500 border-2 ${(activeRequest?.id === req.id && activeTab === 'incoming') ? 'border-tech-turquoise bg-white/5' : 'bg-transparent border-transparent hover:bg-white/5'}`}
                >
                   <div className="flex justify-between items-center">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${activeRequest?.id === req.id ? 'bg-tech-turquoise text-royal-dark' : 'bg-white/5 text-slate-500'}`}>
                          <Stethoscope size={22} />
                        </div>
                        <div>
                          <p className="font-black text-white text-sm tracking-tight">{req.patient_name}</p>
                          <span className="text-[8px] font-black uppercase text-slate-500">{req.status} • {new Date(req.created_at).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>
                        </div>
                      </div>
                      {req.status === 'SENT' && <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />}
                   </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </aside>

      {/* Main Workspace */}
      <main className="flex-1 overflow-y-auto p-16 custom-scrollbar bg-tech-gray dark:bg-royal-dark transition-colors duration-300">
        <header className="flex justify-between items-start mb-16">
          <div>
            <div className="flex items-center gap-3 mb-4"><span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Operations Center</span><div className="w-1.5 h-1.5 rounded-full bg-tech-turquoise" /></div>
            <h1 className="text-5xl font-black text-royal-dark dark:text-white tracking-tighter uppercase">{activeTab.replace('-', ' ')}</h1>
          </div>
          <div className="flex gap-4">
             <div className="p-4 bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-2xl shadow-sm flex items-center gap-4">
                <Bell size={20} className="text-slate-300" />
                <div className="w-10 h-10 bg-royal-dark dark:bg-white/10 text-tech-turquoise rounded-xl flex items-center justify-center font-black text-xs border border-white/5">AI</div>
             </div>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {activeTab === 'incoming' && (
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} className="space-y-10">
              {activeRequest ? (
                <div className="grid lg:grid-cols-12 gap-10">
                   <div className="lg:col-span-7 space-y-8">
                      <div className="p-12 rounded-[4rem] bg-white border border-slate-100 shadow-premium relative overflow-hidden">
                         <div className="flex justify-between items-center relative z-10">
                            <div className="flex gap-8 items-center">
                               <div className="w-20 h-20 bg-royal-dark text-tech-turquoise rounded-[2.5rem] flex items-center justify-center shadow-2xl"><Activity size={40} /></div>
                               <div>
                                  <h3 className="text-4xl font-black text-royal-dark tracking-tighter uppercase mb-1">{activeRequest.patient_name}</h3>
                                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Prescription ID: #{activeRequest.prescription_id.slice(0,8)}</p>
                               </div>
                            </div>
                         </div>
                      </div>
                      <div className="p-10 rounded-[3rem] bg-white border border-slate-100 shadow-xl">
                         <h4 className="text-xs font-black uppercase text-slate-400 tracking-widest mb-8">Diagnosis & Notes</h4>
                         <p className="text-2xl font-black text-royal-dark italic leading-tight">"{activeRequest.diagnosis || 'Post-surgical recovery medication bundle'}"</p>
                      </div>
                   </div>
                   <div className="lg:col-span-5">
                      <div className="p-12 rounded-[4rem] bg-royal-dark text-white shadow-3xl">
                         <h3 className="text-2xl font-black tracking-tighter mb-10 flex items-center gap-3"><Cpu className="text-tech-turquoise" /> Chifa Verification</h3>
                         <div className="space-y-8">
                            <div>
                               <label className="text-[9px] uppercase font-black text-slate-600 tracking-widest mb-3 block">Enter Member ID</label>
                               <input type="text" placeholder="XXXX XXXX XXXX XXXX" className="w-full bg-white/5 border border-white/10 py-6 px-8 rounded-2xl font-mono text-xl text-tech-turquoise outline-none focus:ring-4 focus:ring-tech-turquoise/20" onChange={(e)=>setCoverage(e.target.value.endsWith('0')?100:80)} />
                            </div>
                            <div className="flex justify-between items-center py-6 border-y border-white/5">
                               <span className="text-[10px] font-black text-slate-500 uppercase">Coverage Index</span>
                               <span className="text-4xl font-black text-tech-turquoise">{coverage}%</span>
                            </div>
                            <div className="pt-4">
                               <p className="text-[10px] font-black text-slate-500 uppercase mb-2">Patient Payment</p>
                               <div className="flex items-baseline gap-2">
                                  <span className="text-6xl font-black tracking-tighter text-white">{(parseFloat(activeRequest.standard_price) * (1 - coverage/100)).toLocaleString()}</span>
                                  <span className="text-xs font-black text-tech-turquoise uppercase">DZD</span>
                               </div>
                            </div>
                            <button onClick={handleDispense} disabled={isDispensing} className="w-full py-6 bg-tech-turquoise text-royal-dark rounded-2xl font-black text-xl hover:bg-white transition-all shadow-xl flex items-center justify-center gap-4">
                               {isDispensing ? <Loader2 className="animate-spin" /> : <><CheckCircle /> Authorize Dispense</>}
                            </button>
                         </div>
                      </div>
                   </div>
                </div>
              ) : (
                <div className="py-40 text-center"><p className="text-slate-300 font-black uppercase tracking-[0.6em]">Select active request from stream</p></div>
              )}
            </motion.div>
          )}

          {activeTab === 'promotions' && (
            <motion.div initial={{ opacity:0, y: 20 }} animate={{ opacity:1, y: 0 }} className="grid lg:grid-cols-12 gap-12">
               <div className="lg:col-span-5">
                  <div className="p-10 rounded-[3rem] bg-white border border-slate-100 shadow-xl">
                     <h3 className="text-2xl font-black text-royal-dark tracking-tighter mb-8 flex items-center gap-3"><Plus className="text-tech-turquoise" /> New Promotion</h3>
                     <form onSubmit={handlePromotionSubmit} className="space-y-6">
                        <input type="text" placeholder="Title (e.g. Winter Vitamin Boost)" className="w-full p-5 bg-slate-50 rounded-2xl font-bold outline-none border border-slate-100" value={promotionForm.title} onChange={e=>setPromotionForm({...promotionForm, title: e.target.value})} />
                        <textarea placeholder="Details..." className="w-full p-5 bg-slate-50 rounded-2xl font-bold outline-none border border-slate-100 h-32" value={promotionForm.description} onChange={e=>setPromotionForm({...promotionForm, description: e.target.value})} />
                        <div className="grid grid-cols-2 gap-4">
                           <input type="number" placeholder="Discount %" className="p-5 bg-slate-50 rounded-2xl font-bold outline-none border border-slate-100" value={promotionForm.discount_percentage} onChange={e=>setPromotionForm({...promotionForm, discount_percentage: e.target.value})} />
                           <input type="date" className="p-5 bg-slate-50 rounded-2xl font-bold outline-none border border-slate-100" value={promotionForm.expiry_date} onChange={e=>setPromotionForm({...promotionForm, expiry_date: e.target.value})} />
                        </div>
                        <button type="submit" className="w-full py-5 bg-royal-dark text-white rounded-2xl font-black uppercase tracking-widest hover:bg-tech-turquoise hover:text-royal-dark transition-all">Publish Post</button>
                     </form>
                  </div>
               </div>
               <div className="lg:col-span-7 space-y-6">
                  <h3 className="text-xs font-black uppercase text-slate-400 tracking-[0.3em] ml-4">My Published Posts</h3>
                  {myPromotions.map(promo => (
                    <div key={promo.id} className="p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm flex justify-between items-center group">
                       <div className="flex gap-6 items-center">
                          <div className="w-14 h-14 bg-tech-turquoise/10 text-tech-turquoise rounded-2xl flex items-center justify-center"><Tag size={24} /></div>
                          <div>
                             <h4 className="font-black text-royal-dark text-xl tracking-tighter uppercase">{promo.title}</h4>
                             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{promo.type} • Expires {new Date(promo.expiry_date).toLocaleDateString()}</p>
                          </div>
                       </div>
                       <button className="p-4 text-slate-200 hover:text-red-400 transition-colors"><Trash2 size={20} /></button>
                    </div>
                  ))}
               </div>
            </motion.div>
          )}

          {activeTab === 'stock' && (
            <motion.div initial={{ opacity:0, y: 20 }} animate={{ opacity:1, y: 0 }} className="grid lg:grid-cols-12 gap-12">
               <div className="lg:col-span-5">
                  <div className="p-10 rounded-[3rem] bg-white border border-slate-100 shadow-xl">
                     <h3 className="text-2xl font-black text-royal-dark tracking-tighter mb-8 flex items-center gap-3"><Truck className="text-tech-turquoise" /> Order Stock</h3>
                     <form onSubmit={handleStockOrder} className="space-y-6">
                        <select className="w-full p-5 bg-slate-50 rounded-2xl font-bold outline-none border border-slate-100" value={stockForm.supplier_id} onChange={e=>setStockForm({...stockForm, supplier_id: e.target.value})}>
                           <option value="">Select Supplier</option>
                           {suppliers.map(s => <option key={s.id} value={s.id}>{s.company_name} ({s.wilaya})</option>)}
                        </select>
                        <textarea placeholder="List medicines and quantities..." className="w-full p-5 bg-slate-50 rounded-2xl font-bold outline-none border border-slate-100 h-32" value={stockForm.items} onChange={e=>setStockForm({...stockForm, items: e.target.value})} />
                        <input type="number" placeholder="Estimated Budget (DZD)" className="w-full p-5 bg-slate-50 rounded-2xl font-bold outline-none border border-slate-100" value={stockForm.amount} onChange={e=>setStockForm({...stockForm, amount: e.target.value})} />
                        <button type="submit" className="w-full py-5 bg-royal-dark text-white rounded-2xl font-black uppercase tracking-widest hover:bg-tech-turquoise hover:text-royal-dark transition-all">Submit B2B Order</button>
                     </form>
                  </div>
               </div>
               <div className="lg:col-span-7">
                  <div className="p-10 rounded-[3.5rem] bg-royal-dark text-white shadow-3xl">
                     <h3 className="text-xs font-black uppercase text-slate-500 tracking-[0.3em] mb-8">Order History</h3>
                     <div className="py-20 text-center opacity-30"><ShoppingCart size={64} className="mx-auto mb-6" /><p className="font-black uppercase tracking-widest">No recent B2B orders</p></div>
                  </div>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Success Modal */}
      <AnimatePresence>
        {isSuccess && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} className="fixed inset-0 z-[100] bg-royal-dark/95 backdrop-blur-xl flex items-center justify-center">
             <motion.div initial={{ scale:0.8 }} animate={{ scale:1 }} className="text-center bg-white p-20 rounded-[5rem] shadow-3xl">
                <div className="w-24 h-24 bg-royal-green text-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl"><CheckCircle size={48} /></div>
                <h2 className="text-5xl font-black text-royal-dark tracking-tighter mb-4">Dispense Authorized.</h2>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-10">Inventory Updated • Patient Notified</p>
                <button onClick={()=>setIsSuccess(false)} className="px-12 py-5 bg-royal-dark text-white rounded-2xl font-black uppercase tracking-widest text-xs">Return to Terminal</button>
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PharmacistDashboard;
