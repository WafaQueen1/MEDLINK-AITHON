import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Camera, Search, MapPin, Pill, Activity, User, 
  CreditCard, HeartPulse, Clock, ChevronRight, QrCode,
  Bell, LogOut, LayoutDashboard, History, Navigation,
  ShieldCheck, Info, Filter, Star, Phone, DollarSign,
  AlertCircle, CheckCircle2, Hospital, Sparkles, Tag,
  Loader2, FileText, Send, ArrowLeft
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { apiRequest } from '../../services/api';

const PatientDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [selectedOrdo, setSelectedOrdo] = useState(null);
  
  // Location State
  const [location, setLocation] = useState({ lat: 36.7538, lng: 3.0588 }); // Default Algiers
  const [isLocating, setIsLocating] = useState(false);

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

  const [nearbyPharmacies, setNearbyPharmacies] = useState([]);
  const [loadingPharmacies, setLoadingPharmacies] = useState(false);
  const [activeRequest, setActiveRequest] = useState(null);
  const [requestStatus, setRequestStatus] = useState(null);
  const [myPrescriptions, setMyPrescriptions] = useState([]);
  const [loadingPrescriptions, setLoadingPrescriptions] = useState(false);

  // Function to get real location
  const getUserLocation = () => {
    setIsLocating(true);
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ lat: latitude, lng: longitude });
        setIsLocating(false);
        console.log("Location found:", latitude, longitude);
      },
      (error) => {
        console.error("Error finding location:", error);
        setIsLocating(false);
        alert("Could not detect your location. Using default center.");
      },
      { enableHighAccuracy: true }
    );
  };

  useEffect(() => {
    getUserLocation(); // Auto-detect on mount
  }, []);

  // Fetch real prescriptions on mount
  useEffect(() => {
    const fetchPrescriptions = async () => {
      setLoadingPrescriptions(true);
      try {
        const data = await apiRequest('/patient/my-prescriptions');
        setMyPrescriptions(data.prescriptions || []);
        if (data.prescriptions?.length > 0) {
          setSelectedOrdo(data.prescriptions[0]);
        }
      } catch (err) {
        console.error("Fetch Prescriptions Error:", err);
      } finally {
        setLoadingPrescriptions(false);
      }
    };
    fetchPrescriptions();
  }, []);

  // Poll for request status updates
  useEffect(() => {
    let pollInterval;
    if (activeRequest) {
      pollInterval = setInterval(async () => {
        try {
          const data = await apiRequest(`/patient/request-status/${activeRequest.id}`);
          if (data.status !== requestStatus) {
            setRequestStatus(data.status);
            if (data.status === 'READY') {
              alert(`🔔 Success! Your order at ${data.pharmacy_name} is READY for pickup. Final Price: ${data.final_patient_pay} DZD`);
            }
          }
        } catch (err) {
          console.error("Polling error:", err);
        }
      }, 5000);
    }
    return () => clearInterval(pollInterval);
  }, [activeRequest, requestStatus]);

  const findBestPharmacies = async (ordoId) => {
    setLoadingPharmacies(true);
    try {
      const data = await apiRequest(`/patient/find-pharmacy/${ordoId}`, {
        method: 'POST',
        body: JSON.stringify({
          patientLat: location.lat,
          patientLng: location.lng
        })
      });
      setNearbyPharmacies(data.pharmacies);
      setActiveTab('pharmacies');
    } catch (err) {
      alert("Error finding pharmacies. Please try again.");
    } finally {
      setLoadingPharmacies(false);
    }
  };

  const sendRequestToPharmacy = async (pharmacy) => {
    if (!selectedOrdo) return;
    const standardPrice = pharmacy.standard_price;
    try {
      const data = await apiRequest('/patient/send-request', {
        method: 'POST',
        body: JSON.stringify({
          prescription_id: selectedOrdo.id,
          pharmacy_id: pharmacy.id,
          standard_price: standardPrice
        })
      });
      setActiveRequest(data.request);
      setRequestStatus('SENT');
      alert(`🚀 Request sent to ${pharmacy.name}! We will notify you when they verify your Chifa card.`);
    } catch (err) {
      alert(err.message || "Failed to send request.");
    }
  };

  const [promotions, setPromotions] = useState([]);
  const [loadingPromotions, setLoadingPromotions] = useState(false);

  useEffect(() => {
    const fetchPromotions = async () => {
      setLoadingPromotions(true);
      try {
        const data = await apiRequest('/promotions/active');
        setPromotions(data.promotions || []);
      } catch (err) {
        console.error("Fetch Promotions Error:", err);
      } finally {
        setLoadingPromotions(false);
      }
    };
    fetchPromotions();
  }, []);

  const calculateChifa = (ordo) => {
    if (!ordo) return { total: 0, patientShare: 0, chifaShare: 0 };
    const total = ordo.medicines.reduce((acc, m) => acc + (m.price || 0), 0);
    const coveredAmount = ordo.medicines.filter(m => m.covered).reduce((acc, m) => acc + (m.price || 0), 0);
    const chifaShare = coveredAmount * 1.0; 
    const patientShare = total - chifaShare;
    return { total, patientShare, chifaShare };
  };

  return (
    <div className="min-h-screen bg-tech-gray dark:bg-royal-dark flex font-sans overflow-hidden transition-colors duration-700">
      {/* Sidebar - Unified Navbar */}
      <aside className="w-80 bg-white dark:bg-[#0E1116] text-royal-dark dark:text-white flex flex-col p-10 relative z-20 shadow-2xl overflow-hidden border-r border-slate-200 dark:border-white/5">
        <div className="absolute top-0 right-0 w-64 h-64 bg-royal-green/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="flex items-center gap-4 mb-20 relative z-10">
          <div className="w-12 h-12 bg-royal-green rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-royal-green/30">
            <HeartPulse size={28} className="animate-pulse" />
          </div>
          <div>
            <span className="text-3xl font-black tracking-tighter block leading-none text-royal-dark dark:text-white">MEDLINK</span>
            <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">Patient Portal v2.0</span>
          </div>
        </div>

        <nav className="flex-1 space-y-3 relative z-10">
          {[
            { id: 'overview', label: 'Health Hub', icon: <LayoutDashboard /> },
            { id: 'history', label: 'My Prescriptions', icon: <History /> },
            { id: 'promotions', label: 'Pharmacy Offers', icon: <Tag /> },
            { id: 'pharmacies', label: 'Find Pharmacy', icon: <Navigation /> },
            { id: 'profile', label: 'Settings', icon: <User /> },
          ].map((link) => (
            <button
              key={link.id}
              onClick={() => setActiveTab(link.id)}
              className={`w-full flex items-center gap-5 px-7 py-5 rounded-[2rem] font-black text-[11px] uppercase tracking-widest transition-all duration-500 group ${activeTab === link.id ? 'bg-royal-green text-white shadow-3xl shadow-royal-green/30' : 'text-slate-500 dark:text-slate-300 hover:bg-royal-green/5 dark:hover:bg-white/5 dark:hover:text-white'}`}
            >
              <span className={`transition-transform group-hover:scale-110 ${activeTab === link.id ? 'text-white' : 'text-royal-green/50 dark:text-tech-turquoise/60 group-hover:dark:text-tech-turquoise'}`}>
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
      <main className="flex-1 overflow-y-auto p-16 custom-scrollbar relative flex flex-col items-center bg-[#FAFAFA] dark:bg-royal-dark/50">
        <div className="w-full max-w-6xl">
          <header className="flex justify-between items-start mb-16">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Digital Patient Portal</span>
                <div className="w-1.5 h-1.5 rounded-full bg-royal-green animate-ping" />
              </div>
              
              <div className="flex items-center gap-6">
                {activeTab !== 'overview' && (
                  <button 
                    onClick={() => setActiveTab('overview')}
                    className="p-4 bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-2xl text-royal-dark dark:text-white hover:bg-royal-green hover:text-white transition-all shadow-sm group"
                  >
                    <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
                  </button>
                )}
                <h1 className="text-6xl font-black text-royal-dark dark:text-white tracking-tighter leading-none">
                  {activeTab === 'overview' ? 'Clinical' : activeTab.charAt(0).toUpperCase() + activeTab.slice(1).replace('-', ' ')} <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-royal-dark dark:from-white via-royal-green to-tech-turquoise uppercase">
                    {activeTab === 'overview' ? 'Ecosystem.' : 'Management.'}
                  </span>
                </h1>
              </div>

              <p className="text-slate-400 font-bold text-xs mt-4 uppercase tracking-widest">
                Welcome, {user?.lastName || 'Amine'} • {isLocating ? 'Detecting Location...' : `Lat: ${location.lat.toFixed(4)}, Lng: ${location.lng.toFixed(4)}`}
              </p>
            </motion.div>
            
            <div className="flex gap-4">
               <button onClick={getUserLocation} className={`w-14 h-14 rounded-2xl bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10 flex items-center justify-center text-royal-dark dark:text-white hover:bg-slate-50 transition-all shadow-sm ${isLocating ? 'animate-spin' : ''}`}>
                 <MapPin size={24} className={isLocating ? 'text-tech-turquoise' : ''} />
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
                {/* Left Column */}
                <div className="lg:col-span-5 space-y-10">
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

                  <div className="grid grid-cols-2 gap-10">
                    <div className="p-10 rounded-[3.5rem] bg-tech-turquoise text-royal-dark border border-white/10 flex flex-col items-center text-center group shadow-2xl shadow-tech-turquoise/20">
                      <ShieldCheck size={32} className="mb-4" />
                      <p className="text-sm font-black uppercase tracking-widest leading-tight">Chifa <br /> Verified Member</p>
                    </div>
                    <div className="p-10 rounded-[3.5rem] bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10 flex flex-col items-center text-center hover:scale-105 transition-all cursor-pointer group shadow-sm" onClick={() => setActiveTab('pharmacies')}>
                      <Hospital size={32} className="text-royal-green mb-4 group-hover:scale-110 transition-transform" />
                      <p className="text-sm font-black text-royal-dark dark:text-white uppercase tracking-widest leading-tight">Emergency <br /> Night Pharma</p>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="lg:col-span-7 space-y-10">
                  <div className="p-12 rounded-[4rem] bg-white dark:bg-white/5 border border-slate-100 dark:border-white/5 shadow-xl shadow-slate-200/20">
                    <div className="flex justify-between items-center mb-10">
                      <h3 className="text-2xl font-black text-royal-dark dark:text-white tracking-tighter uppercase">Recent Activity</h3>
                      <button onClick={() => setActiveTab('history')} className="text-royal-green text-[10px] font-black uppercase tracking-widest hover:underline">Full History</button>
                    </div>
                    <div className="space-y-6">
                      {myPrescriptions.slice(0, 3).map((item, i) => (
                        <div 
                          key={i} 
                          onClick={() => {
                            setSelectedOrdo(item);
                            setActiveTab('history');
                          }}
                          className="p-8 rounded-[2.5rem] bg-slate-50 dark:bg-white/5 border border-transparent hover:border-royal-green/20 hover:bg-white dark:hover:bg-white/10 hover:shadow-2xl transition-all group cursor-pointer"
                        >
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-6">
                              <div className="w-16 h-16 bg-white dark:bg-royal-dark rounded-2xl flex items-center justify-center text-royal-green border border-slate-100 dark:border-white/5 group-hover:bg-royal-green group-hover:text-white transition-all shadow-sm">
                                <Pill size={24} />
                              </div>
                              <div>
                                <h4 className="font-black text-royal-dark dark:text-white text-xl tracking-tighter uppercase mb-1 leading-none">#{item.id?.slice(0, 8)}</h4>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                  Dr. {item.doctor_name} <span className="w-1 h-1 bg-slate-200 rounded-full" /> {new Date(item.created_at).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${item.status === 'ACTIVE' || !item.status ? 'bg-royal-green text-white' : 'bg-slate-200 text-slate-500'}`}>
                                {item.status || 'ACTIVE'}
                              </span>
                              <ChevronRight className="text-slate-200 group-hover:text-royal-green transition-colors" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'promotions' && (
              <motion.div key="promotions" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="space-y-12">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {loadingPromotions ? (
                    <div className="col-span-full py-20 text-center text-slate-400 animate-pulse font-black uppercase tracking-widest">Syncing Pharmacy Network...</div>
                  ) : promotions.length === 0 ? (
                    <div className="col-span-full py-20 text-center bg-white dark:bg-white/5 rounded-[4rem] border-2 border-dashed border-slate-100">
                      <Tag size={48} className="mx-auto mb-6 text-slate-200" />
                      <p className="text-slate-400 font-black uppercase">No active deals found today</p>
                    </div>
                  ) : (
                    promotions.map((promo) => (
                      <div key={promo.id} className="p-10 rounded-[4rem] bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10 hover:border-tech-turquoise/50 transition-all group relative overflow-hidden shadow-premium flex flex-col h-full">
                        <div className="flex justify-between items-start mb-6">
                          <span className="px-5 py-2 bg-tech-turquoise/10 text-tech-turquoise text-[10px] font-black uppercase rounded-full">{promo.type}</span>
                          {promo.discount_percentage > 0 && <span className="text-3xl font-black text-royal-green">-{promo.discount_percentage}%</span>}
                        </div>
                        <h3 className="font-black text-3xl mb-4 text-royal-dark dark:text-white tracking-tighter leading-tight">{promo.title}</h3>
                        <p className="text-slate-500 text-sm mb-8 font-bold leading-relaxed flex-1">{promo.description}</p>
                        <div className="pt-8 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                          <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">📍 {promo.pharmacy_name}</div>
                          <button className="w-10 h-10 rounded-xl bg-royal-dark text-white flex items-center justify-center hover:bg-tech-turquoise transition-colors"><ChevronRight size={20} /></button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === 'history' && (
              <motion.div key="history" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="space-y-12">
                <div className="grid lg:grid-cols-12 gap-10">
                  <div className="lg:col-span-7 space-y-6 overflow-y-auto max-h-[600px] pr-4 custom-scrollbar">
                    {loadingPrescriptions ? (
                        <div className="p-20 text-center animate-pulse text-slate-400 font-black uppercase tracking-widest">Accessing Digital Archives...</div>
                    ) : myPrescriptions.length === 0 ? (
                        <div className="p-20 text-center bg-white dark:bg-white/5 rounded-[3rem] border-2 border-dashed border-slate-100">
                             <FileText size={48} className="mx-auto mb-6 text-slate-200" />
                             <p className="text-slate-400 font-black uppercase">No prescriptions found in your account</p>
                        </div>
                    ) : (
                        myPrescriptions.map((pres) => (
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
                                    <h3 className="text-2xl font-black tracking-tighter uppercase mb-1">#{pres.id?.slice(0, 8)}</h3>
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Dr. {pres.doctor_name} • {new Date(pres.created_at).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className={`text-[9px] font-black uppercase tracking-widest mb-2 ${selectedOrdo?.id === pres.id ? 'text-tech-turquoise' : 'text-royal-green'}`}>{pres.status || 'ACTIVE'}</p>
                                </div>
                                </div>
                            </div>
                        ))
                    )}
                  </div>
                  <div className="lg:col-span-5">
                    {selectedOrdo ? (
                      <motion.div key={selectedOrdo.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-10 rounded-[4rem] bg-royal-dark text-white shadow-3xl sticky top-0 border border-white/5 overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-royal-green/20 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2" />
                        <div className="relative z-10">
                          <h3 className="text-2xl font-black tracking-tighter uppercase mb-2">Chifa Coverage Details</h3>
                          <div className="space-y-6 mb-10 mt-8">
                            {selectedOrdo.medicines.map((m, i) => (
                              <div key={i} className="flex justify-between items-center">
                                <div>
                                  <p className="font-black text-sm uppercase tracking-tight">{m.name}</p>
                                  <p className="text-[9px] font-bold text-slate-500 uppercase">{m.dosage}</p>
                                </div>
                                <div className="text-right">
                                  <p className="font-black text-sm">{m.price || 0} DA</p>
                                  <p className={`text-[9px] font-black uppercase ${m.covered ? 'text-royal-green' : 'text-red-400'}`}>{m.covered ? 'Covered' : 'Out-of-Pocket'}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                          <div className="pt-8 border-t border-white/10 space-y-4">
                            <div className="flex justify-between text-slate-400 text-[10px] font-black uppercase tracking-widest">
                              <span>Pharmacy Total</span>
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
                          <button onClick={() => findBestPharmacies(selectedOrdo.id)} disabled={loadingPharmacies} className="w-full mt-10 py-5 bg-white text-royal-dark rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-tech-turquoise transition-all shadow-xl flex items-center justify-center gap-3 disabled:opacity-50">
                            {loadingPharmacies ? <Loader2 className="animate-spin" /> : <Navigation size={18} />} 
                            Find Available Stock
                          </button>
                        </div>
                      </motion.div>
                    ) : (
                      <div className="p-16 rounded-[4rem] bg-slate-50 dark:bg-white/5 border-2 border-dashed border-slate-200 dark:border-white/10 flex flex-col items-center justify-center text-center">
                         <Info size={48} className="text-slate-300 mb-6" />
                         <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Select a prescription <br /> to view coverage</p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'pharmacies' && (
              <motion.div key="pharmacies" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
                <div className="grid lg:grid-cols-12 gap-12">
                  <div className="lg:col-span-7 space-y-6">
                    {nearbyPharmacies.length === 0 ? (
                      <div className="p-20 text-center bg-white dark:bg-white/5 rounded-[3rem] border-2 border-dashed border-slate-100">
                        <Search size={48} className="mx-auto mb-6 text-slate-200" />
                        <p className="text-slate-400 font-black uppercase">Select a prescription in archives to find matching pharmacies</p>
                        <button onClick={() => setActiveTab('history')} className="mt-6 px-8 py-4 bg-royal-dark text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-royal-green transition-all">Go to Archives</button>
                      </div>
                    ) : (
                      nearbyPharmacies.map((ph, i) => (
                        <div key={i} className="p-8 rounded-[3rem] bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10 hover:border-royal-green/30 hover:shadow-2xl transition-all flex justify-between items-center">
                          <div className="flex gap-6">
                             <div className="w-16 h-16 bg-slate-50 dark:bg-royal-dark text-royal-green rounded-2xl flex items-center justify-center border border-slate-100 dark:border-white/5 shadow-sm">
                               <Hospital size={28} />
                             </div>
                             <div>
                               <h3 className="text-xl font-black text-royal-dark dark:text-white tracking-tighter uppercase">{ph.name}</h3>
                               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{ph.distance} km • {ph.phone || '021 XX XX XX'}</p>
                               <div className="flex gap-1 mt-1">
                                  {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={10} className={i < (ph.rating || 4) ? 'text-amber-400 fill-amber-400' : 'text-slate-200'} />
                                  ))}
                               </div>
                             </div>
                          </div>
                          <button onClick={() => sendRequestToPharmacy(ph)} className="px-6 py-4 bg-royal-dark text-white rounded-2xl flex items-center gap-3 hover:bg-royal-green transition-all text-[10px] font-black uppercase tracking-widest">
                            Reserve <Send size={14} />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="lg:col-span-5">
                    <div className="w-full aspect-square rounded-[4rem] bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 relative overflow-hidden group shadow-inner">
                       <div 
                         className="absolute inset-0 bg-cover opacity-50 dark:invert group-hover:scale-110 transition-transform duration-1000" 
                         style={{ backgroundImage: `url('https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/pin-s+2dd4bf(${location.lng},${location.lat})/${location.lng},${location.lat},13,0/600x600?access_token=pk.eyJ1IjoiYm91emlhbmUiLCJhIjoiY2x3bW5mZ3R6MDBqZzJqcDByM2o2ZDN0dSJ9.YourToken_Fake')` }}
                       />
                       <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-4 h-4 bg-tech-turquoise rounded-full animate-ping" />
                       </div>
                       <div className="absolute bottom-10 left-10 right-10 p-6 glass rounded-3xl">
                         <p className="text-[10px] font-black uppercase tracking-widest text-royal-dark mb-1">Your Detected Location</p>
                         <p className="text-sm font-black text-royal-dark italic leading-none">Lat: {location.lat.toFixed(3)}, Lng: {location.lng.toFixed(3)}</p>
                         <p className="text-[9px] font-bold text-slate-500 uppercase mt-2">Accuracy: High-Precision GPS</p>
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
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-royal-dark/95 z-[100] flex flex-col items-center justify-center p-20 backdrop-blur-2xl">
              <div className="absolute top-10 right-10"><button onClick={() => setIsScanning(false)} className="px-8 py-4 bg-white/10 text-white rounded-full text-xs font-black uppercase">Terminate Scan</button></div>
              <div className="relative w-full max-w-lg aspect-[3/4] bg-white/5 border-2 border-white/10 rounded-[4rem] overflow-hidden">
                <motion.div animate={{ top: ['0%', '100%', '0%'] }} transition={{ duration: 4, repeat: Infinity }} className="absolute left-0 right-0 h-1 bg-tech-turquoise shadow-[0_0_50px_#2DD4BF] z-10" />
                <div className="absolute bottom-12 left-12 right-12">
                   <div className="flex justify-between mb-4"><span className="text-[10px] font-black text-tech-turquoise uppercase">MedLink AI Engine</span><span className="text-[10px] font-black text-white uppercase">{scanProgress}%</span></div>
                   <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden"><motion.div className="h-full bg-tech-turquoise" style={{ width: `${scanProgress}%` }} /></div>
                </div>
              </div>
              <div className="mt-16 text-center"><h2 className="text-4xl font-black text-white tracking-tighter mb-4 uppercase">AI Extraction Grid</h2></div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

const ActionBtn = ({ icon, label, color, onClick }) => (
  <button onClick={onClick} className={`w-full p-10 rounded-[3.5rem] border ${color} flex flex-col items-center gap-6 hover:scale-105 transition-all shadow-xl`}>
    <div className="w-16 h-16 rounded-[2rem] bg-white dark:bg-royal-dark flex items-center justify-center shadow-lg">{React.cloneElement(icon, { size: 28 })}</div>
    <span className="text-[10px] font-black uppercase tracking-[0.3em]">{label}</span>
  </button>
);

export default PatientDashboard;
