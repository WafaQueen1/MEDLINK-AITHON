import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CreditCard, 
  CheckCircle, 
  Clock, 
  Search, 
  ChevronRight, 
  Package, 
  ShieldCheck, 
  Activity, 
  Stethoscope, 
  Loader2, 
  Wifi, 
  HeartPulse, 
  LayoutDashboard, 
  Bell,
  Cpu
} from 'lucide-react';
import { fetchPrescriptions } from '../../services/pharmacistService';

const PharmacistDashboard = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [activeRequest, setActiveRequest] = useState(null);
  const [coverage, setCoverage] = useState(80);
  const [totalPrice, setTotalPrice] = useState(1250);
  const [isDispensing, setIsDispensing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [latency, setLatency] = useState(24);

  useEffect(() => {
    const loadPrescriptions = async () => {
      try {
        const data = await fetchPrescriptions();
        setPrescriptions(data.prescriptions);
        if (data.prescriptions.length > 0) {
          setActiveRequest(data.prescriptions[0]);
        }
      } catch (error) {
        console.error('Failed to fetch prescriptions:', error);
      } finally {
        setLoading(false);
      }
    };
    loadPrescriptions();

    // Latency simulation
    const interval = setInterval(() => {
      setLatency(Math.floor(Math.random() * 15) + 15);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const finalAmount = totalPrice * (1 - coverage / 100);

  const handleDispense = () => {
    setIsDispensing(true);
    setTimeout(() => {
      setIsDispensing(false);
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 3000);
    }, 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-royal-dark flex flex-col items-center justify-center">
        <motion.div 
          animate={{ rotate: 360, scale: [1, 1.1, 1] }} 
          transition={{ repeat: Infinity, duration: 2 }}
          className="w-20 h-20 border-4 border-tech-turquoise border-t-transparent rounded-[2.5rem] mb-10 shadow-3xl shadow-tech-turquoise/20" 
        />
        <p className="text-white font-black tracking-[0.6em] text-[10px] uppercase animate-pulse">Syncing Pharmacy Hub...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex overflow-hidden font-sans">
      {/* Live Ecosystem Sidebar */}
      <aside className="w-96 bg-royal-dark text-white flex flex-col p-10 relative z-20 shadow-2xl">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5" />
        
        <div className="flex items-center gap-4 mb-16 relative z-10">
          <div className="w-12 h-12 bg-tech-turquoise rounded-2xl flex items-center justify-center text-royal-dark shadow-2xl shadow-tech-turquoise/30">
            <HeartPulse size={28} />
          </div>
          <div>
            <span className="text-3xl font-black tracking-tighter block leading-none">MEDLINK</span>
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">Dispensing Terminal</span>
          </div>
        </div>

        <div className="relative z-10 flex-1 flex flex-col">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-sm font-black uppercase tracking-widest text-slate-400">Live Stream</h2>
              <p className="text-[9px] font-bold text-tech-turquoise uppercase mt-1">Real-time Prescriptions</p>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/5">
              <div className="w-1.5 h-1.5 rounded-full bg-tech-turquoise animate-ping" />
              <span className="text-[10px] font-black">{prescriptions.length} Active</span>
            </div>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar-dark">
            <AnimatePresence mode="popLayout">
              {prescriptions.map((req) => (
                <motion.div 
                  layout
                  key={req.id}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  onClick={() => setActiveRequest(req)}
                  className={`p-6 rounded-[2.5rem] cursor-pointer group relative overflow-hidden transition-all duration-500 border-2 ${activeRequest?.id === req.id ? 'border-tech-turquoise bg-white/5 shadow-2xl shadow-tech-turquoise/10' : 'bg-transparent border-transparent hover:bg-white/5'}`}
                >
                  <div className="flex justify-between items-start relative z-10">
                    <div className="flex gap-5">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 ${activeRequest?.id === req.id ? 'bg-tech-turquoise text-royal-dark shadow-xl' : 'bg-white/5 text-slate-500'}`}>
                        <Stethoscope size={26} />
                      </div>
                      <div>
                        <p className="font-black text-white text-base tracking-tight mb-1 truncate max-w-[140px]">
                          {req.patient_first_name} {req.patient_last_name}
                        </p>
                        <div className="flex items-center gap-2">
                          <Clock size={12} className="text-slate-500" />
                          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                            {new Date(req.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    </div>
                    {activeRequest?.id === req.id && (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-8 h-8 bg-tech-turquoise text-royal-dark rounded-full flex items-center justify-center shadow-lg shadow-tech-turquoise/40">
                        <CheckCircle size={16} />
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="mt-10 pt-10 border-t border-white/5 space-y-6">
            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-500">
              <span className="flex items-center gap-2">
                <Wifi size={14} className="text-royal-green" /> Hub Latency
              </span>
              <span className="text-white">{latency}ms</span>
            </div>
            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
              <motion.div animate={{ x: ['-100%', '100%'] }} transition={{ repeat: Infinity, duration: 2 }} className="w-1/3 h-full bg-tech-turquoise shadow-turquoise" />
            </div>
          </div>
        </div>
      </aside>

      {/* Operations Workspace */}
      <main className="flex-1 overflow-y-auto p-16 custom-scrollbar">
        <header className="flex justify-between items-start mb-16">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">محطة الصيدلي الرقمية</span>
              <div className="w-1.5 h-1.5 rounded-full bg-tech-turquoise" />
            </div>
            <h1 className="text-5xl font-black text-royal-dark tracking-tighter">Clinical Fulfillment</h1>
            <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px] mt-3">Node Algiers-Central • Chifa API Active</p>
          </div>
          
          <div className="flex gap-4">
            <div className="p-4 bg-white border border-slate-100 rounded-[1.5rem] shadow-sm flex items-center gap-4">
              <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-royal-dark">
                <Bell size={20} />
              </div>
              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">System Alerts</p>
                <p className="text-xs font-black text-royal-dark">Operational</p>
              </div>
            </div>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {activeRequest ? (
            <motion.div
              key={activeRequest.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              className="space-y-12"
            >
              {/* Detailed Prescription Header */}
              <div className="p-12 rounded-[4rem] bg-white border border-slate-100 shadow-premium relative overflow-hidden">
                <div className="absolute top-0 right-0 w-80 h-80 bg-tech-turquoise/5 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2" />
                
                <div className="flex justify-between items-start relative z-10">
                  <div className="flex gap-10">
                    <div className="w-24 h-24 bg-royal-dark rounded-[3rem] flex items-center justify-center text-tech-turquoise shadow-3xl shadow-royal-dark/30">
                      <Activity size={48} />
                    </div>
                    <div>
                      <h3 className="text-4xl font-black text-royal-dark tracking-tighter mb-2 uppercase leading-none">
                        {activeRequest.patient_first_name} <br />
                        <span className="text-slate-300">{activeRequest.patient_last_name}</span>
                      </h3>
                      <div className="flex gap-4 items-center">
                        <span className="px-4 py-1.5 bg-slate-50 text-slate-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-slate-100">
                          Hub ID: {activeRequest.id.slice(0, 12)}
                        </span>
                        <span className="text-[10px] font-black text-tech-turquoise uppercase tracking-widest">Priority Standard</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-2">Prescribing Authority</p>
                    <div className="flex items-center gap-3 justify-end">
                      <p className="font-black text-royal-dark text-lg uppercase tracking-tight">Dr. Lamine Bensaid</p>
                      <div className="w-10 h-10 bg-royal-green/10 text-royal-green rounded-xl flex items-center justify-center border border-royal-green/20">
                        <ShieldCheck size={20} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid lg:grid-cols-12 gap-12">
                <div className="lg:col-span-7">
                  <div className="p-10 rounded-[3.5rem] bg-white border border-slate-100 shadow-xl shadow-slate-200/20">
                    <div className="flex justify-between items-center mb-10">
                      <h4 className="text-sm font-black text-royal-dark uppercase tracking-widest flex items-center gap-3">
                        <Package size={20} className="text-tech-turquoise" />
                        Medication Bundle
                      </h4>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Items: {activeRequest.medicines?.length || 0}</span>
                    </div>
                    
                    <div className="space-y-4">
                      {activeRequest.medicines?.map((m, idx) => (
                        <motion.div 
                          layout
                          key={idx} 
                          className="p-8 rounded-[2.5rem] bg-slate-50 border border-slate-100 flex justify-between items-center group hover:bg-white hover:border-tech-turquoise/30 hover:shadow-2xl transition-all duration-500"
                        >
                          <div className="flex items-center gap-6">
                            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-royal-dark font-black shadow-sm group-hover:bg-royal-dark group-hover:text-white transition-all">
                              {idx + 1}
                            </div>
                            <div>
                              <p className="font-black text-royal-dark text-xl uppercase tracking-tighter leading-none mb-2">{m.medicineName}</p>
                              <div className="flex gap-4">
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{m.dosage}</p>
                                <span className="w-1 h-1 rounded-full bg-slate-200 self-center" />
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{m.frequency}</p>
                              </div>
                            </div>
                          </div>
                          <div className="text-tech-turquoise font-black text-[10px] uppercase tracking-widest bg-white px-5 py-2 rounded-full border border-slate-100 shadow-sm">
                            {m.duration} Cycle
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-5">
                  <div className="p-12 rounded-[4rem] bg-royal-dark text-white shadow-3xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-tech-turquoise/10 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2" />
                    
                    <div className="flex items-center gap-5 mb-12 relative z-10">
                      <div className="w-16 h-16 bg-white/5 backdrop-blur-xl rounded-[2rem] flex items-center justify-center text-tech-turquoise border border-white/10 shadow-inner">
                        <Cpu size={32} />
                      </div>
                      <div>
                        <h3 className="text-2xl font-black tracking-tighter leading-none mb-1">Chifa Protocol</h3>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Real-time Claims Node</p>
                      </div>
                    </div>

                    <div className="space-y-10 relative z-10">
                      <div>
                        <label className="text-[10px] uppercase font-black text-slate-600 tracking-[0.3em] mb-4 block ml-2">Verification Serial</label>
                        <div className="relative group/input">
                          <input 
                            type="text"
                            placeholder="0000 0000 0000 0000 00"
                            className="w-full bg-white/5 backdrop-blur-md border border-white/10 py-6 px-8 rounded-[2rem] font-mono text-xl focus:ring-4 focus:ring-tech-turquoise/20 transition-all outline-none text-tech-turquoise placeholder:text-white/5 tracking-[0.2em]"
                            onChange={(e) => {
                              const val = e.target.value;
                              if (val.length >= 1) {
                                setCoverage(val.endsWith('0') ? 100 : 80);
                              }
                            }}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-6">
                        <div className="p-6 rounded-[2rem] bg-white/5 border border-white/5">
                          <p className="text-[9px] uppercase font-black text-slate-600 tracking-widest mb-2">Coverage Index</p>
                          <p className="text-4xl font-black text-tech-turquoise leading-none">{coverage}%</p>
                        </div>
                        <div className="p-6 rounded-[2rem] bg-white/5 border border-white/5">
                          <p className="text-[9px] uppercase font-black text-slate-600 tracking-widest mb-2">Patient Co-Pay</p>
                          <p className="text-4xl font-black text-white leading-none">{100 - coverage}%</p>
                        </div>
                      </div>

                      <div className="pt-10 border-t border-white/10">
                        <div className="flex justify-between items-end mb-10">
                          <div>
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] block mb-2">Transaction Total</span>
                            <div className="flex items-baseline gap-2">
                              <span className="text-5xl font-black tracking-tighter text-white">{finalAmount.toLocaleString()}</span>
                              <span className="text-xs font-black text-tech-turquoise uppercase tracking-widest">DZD</span>
                            </div>
                          </div>
                        </div>

                        <button 
                          onClick={handleDispense}
                          disabled={isDispensing}
                          className="w-full py-6 rounded-[2rem] font-black text-xl bg-tech-turquoise text-royal-dark hover:bg-white transition-all duration-500 shadow-3xl shadow-tech-turquoise/20 flex items-center justify-center gap-4 active:scale-95 group"
                        >
                          {isDispensing ? (
                            <Loader2 className="animate-spin" size={28} />
                          ) : (
                            <>
                              Dispense & Clear <CheckCircle size={28} className="group-hover:rotate-12 transition-transform" />
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-200 py-60">
              <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-8 border border-slate-100 shadow-inner">
                <LayoutDashboard size={48} className="opacity-20" />
              </div>
              <p className="font-black uppercase tracking-[0.6em] text-[10px]">Select hub request to initiate</p>
            </div>
          )}
        </AnimatePresence>
      </main>

      {/* Royal Success Modal */}
      <AnimatePresence>
        {isSuccess && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-royal-dark/95 backdrop-blur-2xl flex items-center justify-center"
          >
            <motion.div 
              initial={{ scale: 0.8, y: 40 }}
              animate={{ scale: 1, y: 0 }}
              className="text-center p-20 rounded-[5rem] bg-white shadow-3xl max-w-lg relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-royal-green" />
              <div className="w-32 h-32 bg-royal-green text-white rounded-[3rem] flex items-center justify-center mx-auto mb-10 shadow-2xl shadow-royal-green/40">
                <CheckCircle size={64} />
              </div>
              <h2 className="text-6xl font-black text-royal-dark tracking-tighter mb-4 leading-none">Hub Sync <br /> Success.</h2>
              <p className="text-slate-400 font-bold uppercase tracking-[0.4em] text-[10px] mb-10">Inventory Updated • Blockchain Logged</p>
              <button onClick={() => setIsSuccess(false)} className="px-12 py-5 bg-royal-dark text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-tech-turquoise hover:text-royal-dark transition-all">Continue Operations</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PharmacistDashboard;
