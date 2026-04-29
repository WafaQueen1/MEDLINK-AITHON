import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Camera, Search, MapPin, Pill, Activity, User, 
  CreditCard, HeartPulse, Clock, ChevronRight, QrCode,
  Bell, LogOut, LayoutDashboard, History, Navigation,
  ShieldCheck, Info, Filter, Star, Phone, DollarSign,
  AlertCircle, CheckCircle2, Hospital
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const PatientDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [selectedOrdo, setSelectedOrdo] = useState(null);

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

  // Mock data for prescriptions
  const myPrescriptions = [
    {
      id: 'ORD-9921-X',
      doctor: 'Dr. Samir Benali',
      specialty: 'Cardiology',
      date: '2026-04-25',
      status: 'Active',
      medicines: [
        { name: 'Amlodipine', dosage: '5mg', price: 450, covered: true },
        { name: 'Losartan', dosage: '50mg', price: 820, covered: true },
        { name: 'Aspirine Protect', dosage: '100mg', price: 120, covered: false }
      ]
    },
    {
      id: 'ORD-8812-Y',
      doctor: 'Dr. Karima Dz',
      specialty: 'General Medicine',
      date: '2026-04-12',
      status: 'Dispensed',
      medicines: [
        { name: 'Amoxil', dosage: '500mg', price: 320, covered: true }
      ]
    }
  ];

  // Mock data for pharmacies
  const nearbyPharmacies = [
    { name: 'Pharmacie Ibn Sina', distance: '0.8 km', availability: 'Full', rating: 4.9, phone: '021 XX XX XX', open: true },
    { name: 'Pharmacie Centrale El Biar', distance: '1.2 km', availability: 'Partial', rating: 4.7, phone: '023 XX XX XX', open: true },
    { name: 'Pharmacie de la Liberté', distance: '2.5 km', availability: 'Full', rating: 4.5, phone: '021 XX XX XX', open: false }
  ];

  const calculateChifa = (ordo) => {
    if (!ordo) return { total: 0, patientShare: 0, chifaShare: 0 };
    const total = ordo.medicines.reduce((acc, m) => acc + m.price, 0);
    const coveredAmount = ordo.medicines.filter(m => m.covered).reduce((acc, m) => acc + m.price, 0);
    const chifaShare = coveredAmount * 1.0; // 100% coverage for this mock
    const patientShare = total - chifaShare;
    return { total, patientShare, chifaShare };
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] dark:bg-royal-dark flex font-sans overflow-hidden transition-colors duration-700">
      {/* Patient Premium Sidebar */}
      <aside className="w-80 bg-royal-dark text-white flex flex-col p-10 relative z-20 shadow-2xl overflow-hidden border-r border-white/5">
        <div className="absolute top-0 right-0 w-64 h-64 bg-royal-green/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
        
        <div className="flex items-center gap-4 mb-20 relative z-10">
          <div className="w-12 h-12 bg-royal-green rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-royal-green/30">
            <HeartPulse size={28} className="animate-pulse" />
          </div>
          <div>
            <span className="text-3xl font-black tracking-tighter block leading-none text-white">MEDLINK</span>
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">Patient Portal v2.0</span>
          </div>
        </div>

        <nav className="flex-1 space-y-3 relative z-10">
          {[
            { id: 'overview', label: 'Health Hub', icon: <LayoutDashboard /> },
            { id: 'history', label: 'My Ordonnances', icon: <History /> },
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
        <div className="w-full max-w-6xl">
          <header className="flex justify-between items-start mb-16">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">بوابة المريض الرقمية</span>
                <div className="w-1.5 h-1.5 rounded-full bg-royal-green animate-ping" />
              </div>
              <h1 className="text-6xl font-black text-royal-dark dark:text-white tracking-tighter leading-none">
                Clinical <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-royal-dark dark:from-white via-royal-green to-tech-turquoise">
                  Ecosystem.
                </span>
              </h1>
              <p className="text-slate-400 font-bold text-xs mt-4 uppercase tracking-widest">
                Welcome, {user?.lastName || 'Amine'} • National Chifa Member
              </p>
            </motion.div>
            
            <div className="flex gap-4">
               <button className="w-14 h-14 rounded-2xl bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10 flex items-center justify-center text-royal-dark dark:text-white hover:bg-slate-50 transition-all shadow-sm relative">
                 <Bell size={24} />
                 <span className="absolute top-4 right-4 w-2 h-2 bg-royal-green rounded-full border-2 border-white dark:border-royal-dark" />
               </button>
               <div className="w-14 h-14 rounded-2xl bg-royal-dark flex items-center justify-center text-tech-turquoise shadow-xl shadow-royal-dark/20 border border-white/5">
                 <User size={28} />
               </div>
            </div>
          </header>

          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div 
                key="overview"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                className="grid lg:grid-cols-12 gap-12"
              >
                {/* Left Column: ID & Actions */}
                <div className="lg:col-span-5 space-y-10">
                  {/* Digital Chifa Card */}
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    className="bg-royal-dark p-10 rounded-[3.5rem] text-white shadow-3xl relative overflow-hidden group cursor-pointer border border-white/5"
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
                          <ShieldCheck className="text-royal-green" />
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Quick Hub */}
                  <div className="grid grid-cols-2 gap-6">
                    <ActionBtn 
                      icon={<Camera />} 
                      label="Upload Ordo" 
                      color="bg-tech-turquoise/10 text-tech-turquoise border-tech-turquoise/20"
                      onClick={() => setIsScanning(true)}
                    />
                    <ActionBtn 
                      icon={<MapPin />} 
                      label="Live Map" 
                      color="bg-royal-green/10 text-royal-green border-royal-green/20"
                      onClick={() => setActiveTab('pharmacies')}
                    />
                  </div>
                </div>

                {/* Right Column: History & Stats */}
                <div className="lg:col-span-7 space-y-10">
                  <div className="p-12 rounded-[4rem] bg-white dark:bg-white/5 border border-slate-100 dark:border-white/5 shadow-xl shadow-slate-200/20">
                    <div className="flex justify-between items-center mb-10">
                      <h3 className="text-2xl font-black text-royal-dark dark:text-white tracking-tighter uppercase">Recent Activity</h3>
                      <button onClick={() => setActiveTab('history')} className="text-royal-green text-[10px] font-black uppercase tracking-widest hover:underline">Full History</button>
                    </div>

                    <div className="space-y-6">
                      {myPrescriptions.map((item, i) => (
                        <div key={i} className="p-8 rounded-[2.5rem] bg-slate-50 dark:bg-white/5 border border-transparent hover:border-royal-green/20 hover:bg-white dark:hover:bg-white/10 hover:shadow-2xl transition-all group cursor-pointer">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-6">
                              <div className="w-16 h-16 bg-white dark:bg-royal-dark rounded-2xl flex items-center justify-center text-royal-green border border-slate-100 dark:border-white/5 group-hover:bg-royal-green group-hover:text-white transition-all shadow-sm">
                                <Pill size={24} />
                              </div>
                              <div>
                                <h4 className="font-black text-royal-dark dark:text-white text-xl tracking-tighter uppercase mb-1 leading-none">{item.id}</h4>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                  {item.doctor} <span className="w-1 h-1 bg-slate-200 rounded-full" /> {item.date}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${item.status === 'Active' ? 'bg-royal-green text-white' : 'bg-slate-200 text-slate-500'}`}>
                                {item.status}
                              </span>
                              <ChevronRight className="text-slate-200 group-hover:text-royal-green transition-colors" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Health Stats */}
                  <div className="grid grid-cols-2 gap-10">
                    <StatCardSmall icon={<HeartPulse />} value="72" unit="BPM" label="Avg Pulse" />
                    <StatCardSmall icon={<Activity />} value="120/80" unit="mmHg" label="Blood Pressure" />
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'history' && (
              <motion.div 
                key="history"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-12"
              >
                <div className="flex justify-between items-end">
                  <div>
                    <h2 className="text-4xl font-black text-royal-dark dark:text-white tracking-tighter uppercase leading-none">Prescription <br /> Archives</h2>
                    <p className="text-slate-400 font-bold text-xs mt-4 uppercase tracking-widest leading-none">Your complete medical trail</p>
                  </div>
                  <div className="flex gap-4">
                     <button className="glass dark:bg-white/5 px-6 py-3 rounded-2xl flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-royal-dark dark:text-white border-slate-200 dark:border-white/10 hover:bg-slate-100 transition-all">
                       <Filter size={18} /> Sort Archives
                     </button>
                  </div>
                </div>

                <div className="grid lg:grid-cols-12 gap-10">
                  <div className="lg:col-span-7 space-y-6">
                    {myPrescriptions.map((pres) => (
                      <div 
                        key={pres.id} 
                        onClick={() => setSelectedOrdo(pres)}
                        className={`p-10 rounded-[3rem] border transition-all cursor-pointer group relative overflow-hidden ${selectedOrdo?.id === pres.id ? 'bg-royal-dark text-white border-transparent shadow-3xl' : 'bg-white dark:bg-white/5 border-slate-100 dark:border-white/10 hover:border-royal-green/30'}`}
                      >
                        <div className="flex justify-between items-start relative z-10">
                          <div className="flex gap-6">
                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all ${selectedOrdo?.id === pres.id ? 'bg-royal-green text-white' : 'bg-slate-50 dark:bg-royal-dark text-royal-green group-hover:bg-royal-green group-hover:text-white'}`}>
                              <FileText size={28} />
                            </div>
                            <div>
                              <h3 className="text-2xl font-black tracking-tighter uppercase mb-1">{pres.id}</h3>
                              <p className={`text-[10px] font-bold uppercase tracking-widest ${selectedOrdo?.id === pres.id ? 'text-slate-400' : 'text-slate-400'}`}>{pres.doctor} • {pres.date}</p>
                            </div>
                          </div>
                          <div className="text-right">
                             <p className={`text-[9px] font-black uppercase tracking-widest mb-2 ${selectedOrdo?.id === pres.id ? 'text-tech-turquoise' : 'text-royal-green'}`}>{pres.status}</p>
                             <div className="flex -space-x-2">
                               {[1,2].map(i => <div key={i} className="w-8 h-8 rounded-full border-2 border-white dark:border-royal-dark bg-slate-200" />)}
                             </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* CHIFA CALCULATOR PANEL */}
                  <div className="lg:col-span-5">
                    <AnimatePresence mode="wait">
                      {selectedOrdo ? (
                        <motion.div 
                          key={selectedOrdo.id}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="p-10 rounded-[4rem] bg-royal-dark text-white shadow-3xl sticky top-0 border border-white/5 overflow-hidden"
                        >
                          <div className="absolute top-0 right-0 w-64 h-64 bg-royal-green/20 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2" />
                          
                          <div className="relative z-10">
                            <h3 className="text-2xl font-black tracking-tighter uppercase mb-2">Chifa Coverage Details</h3>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-10">Real-time simulation based on CNAS grid</p>
                            
                            <div className="space-y-6 mb-10">
                              {selectedOrdo.medicines.map((m, i) => (
                                <div key={i} className="flex justify-between items-center">
                                  <div>
                                    <p className="font-black text-sm uppercase tracking-tight">{m.name}</p>
                                    <p className="text-[9px] font-bold text-slate-500 uppercase">{m.dosage}</p>
                                  </div>
                                  <div className="text-right">
                                    <p className="font-black text-sm">{m.price} DA</p>
                                    <p className={`text-[9px] font-black uppercase ${m.covered ? 'text-royal-green' : 'text-red-400'}`}>
                                      {m.covered ? 'Covered' : 'Out-of-Pocket'}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>

                            <div className="pt-8 border-t border-white/10 space-y-4">
                              <div className="flex justify-between text-slate-400 text-[10px] font-black uppercase tracking-widest">
                                <span>Total Pharmacie</span>
                                <span>{calculateChifa(selectedOrdo).total} DA</span>
                              </div>
                              <div className="flex justify-between text-royal-green text-[10px] font-black uppercase tracking-widest">
                                <span>Chifa (CNAS) Share</span>
                                <span>- {calculateChifa(selectedOrdo).chifaShare} DA</span>
                              </div>
                              <div className="flex justify-between items-center pt-4">
                                <span className="text-xl font-black tracking-tighter uppercase">Patient Share</span>
                                <span className="text-4xl font-black text-tech-turquoise tracking-tighter">{calculateChifa(selectedOrdo).patientShare} DA</span>
                              </div>
                            </div>

                            <button onClick={() => setActiveTab('pharmacies')} className="w-full mt-10 py-5 bg-white text-royal-dark rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-tech-turquoise transition-all shadow-xl flex items-center justify-center gap-3">
                              <Navigation size={18} /> Find Available Stock
                            </button>
                          </div>
                        </motion.div>
                      ) : (
                        <div className="p-16 rounded-[4rem] bg-slate-50 dark:bg-white/5 border-2 border-dashed border-slate-200 dark:border-white/10 flex flex-col items-center justify-center text-center">
                           <Info size={48} className="text-slate-300 mb-6" />
                           <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Select an ordonnance <br /> to view coverage</p>
                        </div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'pharmacies' && (
              <motion.div 
                key="pharmacies"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-12"
              >
                <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                  <div>
                    <h2 className="text-4xl font-black text-royal-dark dark:text-white tracking-tighter uppercase leading-none">Pharmacy Locator</h2>
                    <p className="text-slate-400 font-bold text-xs mt-4 uppercase tracking-widest leading-none">Real-time availability in your sector</p>
                  </div>
                  <div className="flex-1 w-full md:max-w-md relative group">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-royal-green transition-colors" size={20} />
                    <input 
                      placeholder="Search by neighborhood or name..." 
                      className="input-field pl-16 py-5 bg-white dark:bg-white/5"
                    />
                  </div>
                </div>

                <div className="grid lg:grid-cols-12 gap-12">
                  {/* List View */}
                  <div className="lg:col-span-7 space-y-6">
                    {nearbyPharmacies.map((ph, i) => (
                      <div key={i} className="p-8 rounded-[3rem] bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10 hover:border-royal-green/30 hover:shadow-2xl transition-all group flex justify-between items-center">
                        <div className="flex gap-6">
                           <div className="w-16 h-16 bg-slate-50 dark:bg-royal-dark text-royal-green rounded-2xl flex items-center justify-center border border-slate-100 dark:border-white/5 shadow-sm">
                             <Hospital size={28} />
                           </div>
                           <div>
                             <div className="flex items-center gap-3 mb-1">
                               <h3 className="text-xl font-black text-royal-dark dark:text-white tracking-tighter uppercase">{ph.name}</h3>
                               <div className="flex items-center gap-1 px-2 py-0.5 bg-amber-50 text-amber-600 rounded-full text-[8px] font-black">
                                 <Star size={8} fill="currentColor" /> {ph.rating}
                               </div>
                             </div>
                             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                               {ph.distance} • {ph.phone}
                             </p>
                             <div className="flex gap-2 mt-3">
                               <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${ph.availability === 'Full' ? 'bg-royal-green/10 text-royal-green' : 'bg-amber-100 text-amber-700'}`}>
                                 {ph.availability} Stock
                               </span>
                               <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${ph.open ? 'bg-green-100 text-green-700' : 'bg-red-50 text-red-400'}`}>
                                 {ph.open ? 'Open Now' : 'Closed'}
                               </span>
                             </div>
                           </div>
                        </div>
                        <button className="w-12 h-12 bg-royal-dark text-white rounded-2xl flex items-center justify-center hover:bg-royal-green transition-all shadow-xl group-hover:scale-110">
                          <Navigation size={20} />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Map Mockup */}
                  <div className="lg:col-span-5">
                    <div className="w-full aspect-square rounded-[4rem] bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 relative overflow-hidden group shadow-inner">
                       <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/light-v10/static/2.99,36.75,13,0/600x600?access_token=YOUR_TOKEN')] bg-cover opacity-50 dark:invert group-hover:scale-110 transition-transform duration-1000" />
                       <div className="absolute inset-0 bg-gradient-to-t from-royal-dark/50 to-transparent" />
                       
                       {/* Mock Pins */}
                       <div className="absolute top-1/3 left-1/2 w-4 h-4 bg-royal-green rounded-full border-4 border-white animate-bounce shadow-2xl" />
                       <div className="absolute top-1/2 right-1/4 w-4 h-4 bg-tech-turquoise rounded-full border-4 border-white shadow-2xl" />
                       
                       <div className="absolute bottom-10 left-10 right-10 p-6 glass rounded-3xl">
                         <p className="text-[10px] font-black uppercase tracking-widest text-royal-dark mb-1">Closest Station</p>
                         <p className="text-sm font-black text-royal-dark">Pharmacie Ibn Sina (0.8km)</p>
                       </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
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
                
                <motion.div 
                  animate={{ top: ['0%', '100%', '0%'] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  className="absolute left-0 right-0 h-1 bg-tech-turquoise shadow-[0_0_50px_#2DD4BF] z-10" 
                />

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
                <h2 className="text-4xl font-black text-white tracking-tighter mb-4 uppercase">AI Extraction Grid</h2>
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
    <div className="w-16 h-16 rounded-[2rem] bg-white dark:bg-royal-dark flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
      {React.cloneElement(icon, { size: 28 })}
    </div>
    <span className="text-[10px] font-black uppercase tracking-[0.3em]">{label}</span>
  </button>
);

const StatCardSmall = ({ icon, value, unit, label }) => (
  <div className="p-10 rounded-[3.5rem] bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 flex flex-col items-center text-center hover:scale-105 transition-all cursor-default">
    <div className="w-12 h-12 bg-white dark:bg-royal-dark rounded-2xl flex items-center justify-center text-royal-green shadow-sm mb-6 border border-slate-100 dark:border-white/5">
      {React.cloneElement(icon, { size: 24 })}
    </div>
    <div className="flex items-baseline gap-1 mb-1">
      <p className="text-4xl font-black text-royal-dark dark:text-white tracking-tighter leading-none">{value}</p>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{unit}</p>
    </div>
    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
  </div>
);

export default PatientDashboard;
