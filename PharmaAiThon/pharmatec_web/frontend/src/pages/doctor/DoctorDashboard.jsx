import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, FileText, PlusCircle, Search, ChevronRight, 
  Activity, Stethoscope, LogOut, BrainCircuit, Calendar, 
  AlertCircle, CheckCircle2, HeartPulse, LayoutDashboard, 
  MessageSquareCode, ShieldCheck, Sparkles, Send, Trash2,
  Microscope, Pill, Info
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import {
  createPatientRequest,
  createPrescriptionRequest,
  fetchDoctorDashboard,
} from '../../services/doctorService';
import AISuggestionPanel from '../../components/AISuggestionPanel';

const patientForm = {
  firstName: '',
  lastName: '',
  age: '',
  sex: 'male',
  chronicDisease: '',
};

const prescriptionItem = {
  medicineName: '',
  dosage: '',
  frequency: '',
  duration: '',
};

export const DoctorDashboard = () => {
  const { user, logout } = useAuth();
  const [dashboard, setDashboard] = useState({ stats: {}, patients: [], prescriptions: [] });
  const [activeTab, setActiveTab] = useState('overview');
  const [newPatient, setNewPatient] = useState(patientForm);
  const [prescription, setPrescription] = useState({ patientId: '', notes: '', medicines: [{ ...prescriptionItem }] });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const loadDashboard = async () => {
    setIsLoading(true);
    try {
      const data = await fetchDoctorDashboard();
      setDashboard(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const handlePatientSubmit = async (e) => {
    e.preventDefault();
    try {
      await createPatientRequest({ ...newPatient, age: Number(newPatient.age) });
      setNewPatient(patientForm);
      loadDashboard();
      setActiveTab('patients');
    } catch (err) {
      setError(err.message);
    }
  };

  const handlePrescriptionSubmit = async (e) => {
    e.preventDefault();
    try {
      await createPrescriptionRequest(prescription);
      setPrescription({ patientId: '', notes: '', medicines: [{ ...prescriptionItem }] });
      loadDashboard();
      setActiveTab('history');
    } catch (err) {
      setError(err.message);
    }
  };

  const addMedicineFromAI = (med) => {
    const newItem = {
      medicineName: med.name,
      dosage: med.dosage,
      frequency: "As prescribed", // Default
      duration: "30 days", // Default
    };
    
    // Check if the first item is empty, if so replace it
    if (prescription.medicines.length === 1 && !prescription.medicines[0].medicineName) {
      setPrescription({ ...prescription, medicines: [newItem] });
    } else {
      setPrescription({ ...prescription, medicines: [...prescription.medicines, newItem] });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-royal-dark flex flex-col items-center justify-center">
        <motion.div 
          animate={{ rotate: 360, scale: [1, 1.2, 1] }} 
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="w-16 h-16 border-4 border-tech-turquoise border-t-transparent rounded-full mb-8 shadow-turquoise" 
        />
        <p className="text-white font-black tracking-[0.5em] text-[10px] uppercase animate-pulse">Initializing Medical Grid...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFDFD] dark:bg-royal-dark flex overflow-hidden font-sans transition-colors duration-700">
      {/* Side Terminal Navigation */}
      <aside className="w-80 bg-royal-dark text-white flex flex-col p-10 relative z-20 shadow-2xl overflow-hidden border-r border-white/5">
        <div className="absolute top-0 right-0 w-64 h-64 bg-tech-turquoise/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
        
        <div className="flex items-center gap-4 mb-20 relative z-10">
          <div className="w-12 h-12 bg-tech-turquoise rounded-2xl flex items-center justify-center text-royal-dark shadow-2xl shadow-tech-turquoise/30">
            <HeartPulse size={28} className="animate-pulse" />
          </div>
          <div>
            <span className="text-3xl font-black tracking-tighter block leading-none">MEDLINK</span>
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">Medical OS v2.0</span>
          </div>
        </div>

        <nav className="flex-1 space-y-3 relative z-10">
          {[
            { id: 'overview', label: 'Ecosystem Overview', icon: <LayoutDashboard /> },
            { id: 'patients', label: 'Patient Registry', icon: <Users /> },
            { id: 'prescribe', label: 'Clinical Terminal', icon: <Stethoscope /> },
            { id: 'history', label: 'Archive Hub', icon: <FileText /> },
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
            Eject Workspace
          </button>
        </div>
      </aside>

      {/* Primary Workspace */}
      <main className="flex-1 overflow-y-auto p-16 custom-scrollbar relative">
        <header className="flex justify-between items-start mb-16">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">بوابة الطبيب الرقمية</span>
              <div className="w-1.5 h-1.5 rounded-full bg-tech-turquoise animate-ping" />
            </div>
            <h1 className="text-6xl font-black text-royal-dark dark:text-white tracking-tighter leading-none">
              Welcome back, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-royal-dark dark:from-white via-royal-green to-tech-turquoise">
                Dr. {user?.lastName}
              </span>
            </h1>
            <p className="text-slate-400 font-bold text-xs mt-4 uppercase tracking-widest">
              {user?.medicalSpecialty || 'General Practitioner'} • Hospital Central
            </p>
          </motion.div>
          
          <div className="flex gap-4">
            <div className="glass dark:bg-white/5 px-8 py-4 rounded-[2rem] border border-slate-200 dark:border-white/10 shadow-sm flex items-center gap-4">
              <div className="w-10 h-10 bg-slate-100 dark:bg-white/10 rounded-xl flex items-center justify-center text-royal-dark dark:text-white font-black text-xs">
                {new Date().getDate()}
              </div>
              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Current Sync</p>
                <p className="text-sm font-black text-royal-dark dark:text-white">{new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</p>
              </div>
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
              className="space-y-16"
            >
              {/* High-Fidelity Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                <StatCard icon={<Users />} label="Patient Footprint" value={dashboard.stats.totalPatients || 0} color="bg-royal-dark" />
                <StatCard icon={<FileText />} label="Issued Ordonnances" value={dashboard.stats.totalPrescriptions || 0} color="bg-tech-turquoise text-royal-dark" />
                <StatCard icon={<ShieldCheck />} label="Verified ID" value="98%" color="bg-royal-green text-white" />
              </div>

              <div className="grid lg:grid-cols-12 gap-12">
                <div className="lg:col-span-8">
                  <div className="p-12 rounded-[4rem] bg-white dark:bg-white/5 border border-slate-100 dark:border-white/5 shadow-xl shadow-slate-200/20 relative overflow-hidden">
                    <div className="flex justify-between items-center mb-12">
                      <h3 className="text-2xl font-black text-royal-dark dark:text-white tracking-tighter uppercase">Clinical Activity</h3>
                      <button onClick={() => setActiveTab('patients')} className="btn-outline dark:text-white dark:border-white/20 px-6 py-2 text-[10px]">Audit Registry</button>
                    </div>
                    
                    <div className="space-y-6">
                      {dashboard.patients.slice(0, 4).map((p) => (
                        <div key={p.id} className="flex justify-between items-center p-6 rounded-[2.5rem] bg-tech-gray/30 dark:bg-white/5 border border-transparent hover:border-tech-turquoise/30 hover:bg-white dark:hover:bg-white/10 hover:shadow-2xl transition-all group cursor-pointer">
                          <div className="flex items-center gap-6">
                            <div className="w-16 h-16 bg-white dark:bg-royal-dark rounded-[1.5rem] flex items-center justify-center text-royal-dark dark:text-white shadow-sm font-black text-lg border border-slate-100 dark:border-white/5 group-hover:bg-royal-dark group-hover:text-white transition-all">
                              {p.first_name[0]}{p.last_name[0]}
                            </div>
                            <div>
                              <p className="font-black text-royal-dark dark:text-white text-lg uppercase tracking-tight leading-none mb-2">{p.first_name} {p.last_name}</p>
                              <div className="flex gap-3">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{p.age} Yrs</span>
                                <span className="w-1 h-1 rounded-full bg-slate-300 self-center" />
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{p.sex}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="flex flex-col items-end mr-4">
                              <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">Status</p>
                              <div className="flex items-center gap-1.5 px-3 py-1 bg-royal-green/10 text-royal-green rounded-full">
                                <div className="w-1.5 h-1.5 rounded-full bg-royal-green animate-pulse" />
                                <span className="text-[10px] font-black uppercase">Stable</span>
                              </div>
                            </div>
                            <button onClick={() => {
                              setPrescription(prev => ({ ...prev, patientId: p.id }));
                              setActiveTab('prescribe');
                            }} className="w-12 h-12 rounded-2xl bg-white dark:bg-white/5 text-slate-300 group-hover:bg-tech-turquoise group-hover:text-royal-dark flex items-center justify-center shadow-sm transition-all border border-slate-100 dark:border-white/5 group-hover:border-transparent">
                              <ChevronRight size={24} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-4 space-y-10">
                  {/* AI Smart Terminal Promo */}
                  <div className="p-10 rounded-[3.5rem] bg-royal-dark text-white shadow-3xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-tech-turquoise/10 blur-[80px] rounded-full group-hover:scale-150 transition-transform duration-1000" />
                    
                    <div className="flex items-center gap-4 mb-10 relative z-10">
                      <div className="w-14 h-14 bg-white/5 backdrop-blur-xl rounded-[1.5rem] flex items-center justify-center text-tech-turquoise border border-white/10 shadow-inner">
                        <BrainCircuit size={28} />
                      </div>
                      <div>
                        <h3 className="text-xl font-black tracking-tighter leading-none mb-1">Next-Gen AI</h3>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Clinical Support</p>
                      </div>
                    </div>

                    <div className="space-y-6 relative z-10">
                      <p className="text-[11px] font-medium leading-relaxed text-slate-300">
                        Our proprietary AI now suggests bio-equivalent molecules and flags potential stock ruptures in real-time.
                      </p>
                      <button 
                        onClick={() => setActiveTab('prescribe')}
                        className="w-full py-4 bg-tech-turquoise text-royal-dark rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-white transition-all shadow-xl"
                      >
                        Try AI Assistant
                      </button>
                    </div>
                  </div>
                  
                  {/* Chifa Verification Promo */}
                  <div className="p-10 rounded-[3.5rem] bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 relative overflow-hidden shadow-inner">
                    <ShieldCheck className="text-royal-green/20 absolute bottom-[-10px] right-[-10px]" size={120} />
                    <h4 className="text-sm font-black text-royal-dark dark:text-white uppercase tracking-widest mb-4">Network Security</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-6">Every ordonnance issued is cryptographically signed and verified via the national hub.</p>
                    <div className="flex items-center gap-2 px-3 py-1 bg-white dark:bg-white/10 border border-slate-200 dark:border-white/5 rounded-full w-fit">
                      <div className="w-1.5 h-1.5 rounded-full bg-royal-green" />
                      <span className="text-[9px] font-black uppercase text-royal-dark dark:text-white">Verified Connection</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'prescribe' && (
            <motion.div 
              key="prescribe"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              className="max-w-5xl"
            >
              {/* 🧠 AI ASSISTANT PANEL INTEGRATION */}
              <AISuggestionPanel 
                patientId={prescription.patientId} 
                onAddMedicine={addMedicineFromAI} 
              />

              <div className="p-16 rounded-[4rem] bg-white dark:bg-white/5 border border-slate-100 dark:border-white/5 shadow-3xl">
                <div className="flex justify-between items-center mb-12">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-royal-dark text-tech-turquoise rounded-2xl flex items-center justify-center shadow-xl">
                      <PlusCircle size={32} />
                    </div>
                    <h2 className="text-4xl font-black text-royal-dark dark:text-white tracking-tighter uppercase leading-none">New Digital <br /> Ordonnance</h2>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Prescription Hub</p>
                    <p className="text-xs font-black text-tech-turquoise uppercase">Session Active</p>
                  </div>
                </div>
                
                <form onSubmit={handlePrescriptionSubmit} className="space-y-12">
                  <div className="grid md:grid-cols-2 gap-10">
                    <div className="space-y-4">
                      <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest ml-4 block">Select Patient Registry</label>
                      <div className="relative group">
                        <Users className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-tech-turquoise transition-colors" size={20} />
                        <select 
                          className="w-full bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-[1.5rem] py-5 pl-16 pr-8 text-sm font-black text-royal-dark dark:text-white outline-none focus:ring-4 focus:ring-tech-turquoise/10 transition-all appearance-none"
                          value={prescription.patientId}
                          onChange={(e) => setPrescription({ ...prescription, patientId: e.target.value })}
                          required
                        >
                          <option value="">Select Target Patient</option>
                          {dashboard.patients.map(p => (
                            <option key={p.id} value={p.id}>{p.first_name} {p.last_name}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-8">
                    <div className="flex justify-between items-center px-4">
                      <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest block">Clinical Medication List</label>
                      <button 
                        type="button" 
                        onClick={() => setPrescription({ ...prescription, medicines: [...prescription.medicines, { ...prescriptionItem }] })}
                        className="text-[10px] font-black text-tech-turquoise flex items-center gap-2 hover:bg-tech-turquoise/10 px-4 py-2 rounded-full transition-all uppercase tracking-widest border border-tech-turquoise/20"
                      >
                        <PlusCircle size={16} /> Add Manual Entry
                      </button>
                    </div>
                    
                    <div className="space-y-6">
                      {prescription.medicines.map((m, idx) => (
                        <motion.div 
                          key={idx} 
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="p-10 rounded-[3rem] bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 space-y-8 relative group/item"
                        >
                          <div className="flex justify-between items-center mb-2">
                            <span className="w-10 h-10 bg-royal-dark text-white rounded-xl flex items-center justify-center font-black text-xs shadow-lg">
                              {idx + 1}
                            </span>
                            {prescription.medicines.length > 1 && (
                              <button 
                                type="button"
                                onClick={() => {
                                  const updated = prescription.medicines.filter((_, i) => i !== idx);
                                  setPrescription({ ...prescription, medicines: updated });
                                }}
                                className="text-slate-300 hover:text-red-500 transition-colors"
                              >
                                <Trash2 size={20} />
                              </button>
                            )}
                          </div>

                          <div className="grid md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                              <label className="text-[9px] uppercase font-black text-slate-400 tracking-widest ml-4">Substance/Brand Name</label>
                              <div className="relative group">
                                <Pill className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-tech-turquoise transition-colors" size={18} />
                                <input 
                                  placeholder="e.g. Amoxicilline" 
                                  className="input-field pl-16 py-4 dark:bg-white/5" 
                                  value={m.medicineName}
                                  onChange={(e) => {
                                    const updated = [...prescription.medicines];
                                    updated[idx].medicineName = e.target.value;
                                    setPrescription({ ...prescription, medicines: updated });
                                  }}
                                  required
                                />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <label className="text-[9px] uppercase font-black text-slate-400 tracking-widest ml-4">Posology/Dosage</label>
                              <div className="relative group">
                                <Activity className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-tech-turquoise transition-colors" size={18} />
                                <input 
                                  placeholder="e.g. 500mg" 
                                  className="input-field pl-16 py-4 dark:bg-white/5"
                                  value={m.dosage}
                                  onChange={(e) => {
                                    const updated = [...prescription.medicines];
                                    updated[idx].dosage = e.target.value;
                                    setPrescription({ ...prescription, medicines: updated });
                                  }}
                                  required
                                />
                              </div>
                            </div>
                          </div>
                          <div className="grid md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                              <label className="text-[9px] uppercase font-black text-slate-400 tracking-widest ml-4">Frequency of Intake</label>
                              <input 
                                placeholder="e.g. 1 tab x 3 / day" 
                                className="input-field py-4 px-8 dark:bg-white/5"
                                value={m.frequency}
                                onChange={(e) => {
                                  const updated = [...prescription.medicines];
                                  updated[idx].frequency = e.target.value;
                                  setPrescription({ ...prescription, medicines: updated });
                                }}
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[9px] uppercase font-black text-slate-400 tracking-widest ml-4">Treatment Cycle</label>
                              <input 
                                placeholder="e.g. 15 days" 
                                className="input-field py-4 px-8 dark:bg-white/5"
                                value={m.duration}
                                onChange={(e) => {
                                  const updated = [...prescription.medicines];
                                  updated[idx].duration = e.target.value;
                                  setPrescription({ ...prescription, medicines: updated });
                                }}
                                required
                              />
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest ml-4 block">Clinical Observations (Optional)</label>
                    <textarea 
                      className="input-field h-32 p-8 dark:bg-white/5" 
                      placeholder="Special instructions for patient or pharmacist..."
                      value={prescription.notes}
                      onChange={(e) => setPrescription({ ...prescription, notes: e.target.value })}
                    />
                  </div>

                  <div className="pt-10 flex flex-col sm:flex-row gap-6">
                    <button type="submit" className="flex-1 btn-royal py-6 text-xl shadow-3xl group">
                      Sign & Broadcast Hub <Send size={24} className="group-hover:translate-x-2 group-hover:-translate-y-1 transition-transform" />
                    </button>
                    <button type="button" onClick={() => setPrescription({ patientId: '', notes: '', medicines: [{ ...prescriptionItem }] })} className="px-10 py-6 glass text-royal-dark dark:text-white font-black text-sm uppercase tracking-widest hover:bg-slate-100 dark:hover:bg-white/10 transition-all rounded-[2rem]">
                      Reset Terminal
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}

          {activeTab === 'patients' && (
            <motion.div 
              key="patients"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-12"
            >
              <div className="flex justify-between items-end">
                <div>
                  <h2 className="text-4xl font-black text-royal-dark dark:text-white tracking-tighter uppercase">Patient Registry</h2>
                  <p className="text-slate-400 font-bold text-xs mt-2 uppercase tracking-widest">Manage your clinical footprint</p>
                </div>
                <div className="glass px-6 py-3 border-slate-200 dark:border-white/10 rounded-2xl flex items-center gap-3">
                  <Search size={18} className="text-slate-400" />
                  <input placeholder="Fuzzy search registry..." className="bg-transparent border-none outline-none text-xs font-black uppercase tracking-widest text-royal-dark dark:text-white placeholder:text-slate-300" />
                </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Add New Patient Card */}
                <div className="p-8 rounded-[3rem] bg-white dark:bg-white/5 border-2 border-dashed border-slate-200 dark:border-white/10 flex flex-col items-center justify-center text-center group hover:border-tech-turquoise transition-all cursor-pointer">
                  <div className="w-20 h-20 bg-slate-50 dark:bg-white/5 rounded-full flex items-center justify-center text-slate-300 group-hover:bg-tech-turquoise group-hover:text-royal-dark transition-all mb-6">
                    <PlusCircle size={40} />
                  </div>
                  <h3 className="text-xl font-black text-royal-dark dark:text-white uppercase tracking-tight">New Registry Entry</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">Initialize new patient hub</p>
                </div>

                {dashboard.patients.map(p => (
                  <div key={p.id} className="card-premium p-8 group">
                    <div className="flex items-start justify-between mb-8">
                      <div className="w-16 h-16 bg-royal-dark text-tech-turquoise rounded-2xl flex items-center justify-center font-black text-xl shadow-xl group-hover:scale-110 transition-transform">
                        {p.first_name[0]}{p.last_name[0]}
                      </div>
                      <div className="text-right">
                        <span className="text-[8px] font-black bg-royal-green/10 text-royal-green px-2 py-1 rounded-full uppercase tracking-widest">Active File</span>
                      </div>
                    </div>
                    <h3 className="text-2xl font-black text-royal-dark dark:text-white tracking-tighter uppercase mb-1">{p.first_name} {p.last_name}</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">{p.age} Yrs • {p.sex}</p>
                    
                    <div className="pt-6 border-t border-slate-100 dark:border-white/5 flex gap-4">
                      <button 
                        onClick={() => {
                          setPrescription(prev => ({ ...prev, patientId: p.id }));
                          setActiveTab('prescribe');
                        }}
                        className="flex-1 py-3 bg-slate-50 dark:bg-white/5 rounded-xl font-black text-[9px] uppercase tracking-widest text-royal-dark dark:text-white hover:bg-tech-turquoise hover:text-royal-dark transition-all"
                      >
                        Clinical Terminal
                      </button>
                      <button className="w-12 h-12 glass border-slate-100 dark:border-white/5 flex items-center justify-center rounded-xl text-slate-300 hover:text-royal-dark dark:hover:text-white transition-all">
                        <Info size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'history' && (
            <motion.div 
              key="history"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-12"
            >
              <div className="flex justify-between items-end">
                <div>
                  <h2 className="text-4xl font-black text-royal-dark dark:text-white tracking-tighter uppercase">Clinical Archive Hub</h2>
                  <p className="text-slate-400 font-bold text-xs mt-2 uppercase tracking-widest">Digital Audit of issued prescriptions</p>
                </div>
                <div className="flex gap-4">
                   <button className="glass px-6 py-3 rounded-2xl flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-royal-dark dark:text-white hover:bg-slate-100 transition-all">
                     <Calendar size={18} /> Filter by Cycle
                   </button>
                </div>
              </div>

              <div className="space-y-6">
                {dashboard.prescriptions.map((pres, idx) => (
                  <div key={idx} className="glass p-10 rounded-[3rem] border-slate-100 dark:border-white/5 hover:border-tech-turquoise/30 transition-all group relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-tech-turquoise/5 blur-[80px] rounded-full -z-10" />
                    
                    <div className="flex flex-col md:flex-row justify-between gap-10">
                      <div className="flex gap-8">
                        <div className="w-20 h-20 bg-royal-dark text-tech-turquoise rounded-[2rem] flex items-center justify-center shadow-xl border border-white/5">
                          <FileText size={36} />
                        </div>
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-3xl font-black text-royal-dark dark:text-white tracking-tighter uppercase leading-none">ID #{pres.id.slice(0, 8)}</h3>
                            <span className="px-3 py-1 bg-royal-green text-white text-[8px] font-black rounded-full uppercase tracking-widest">Broadcasted</span>
                          </div>
                          <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-4">Patient ID: {pres.patient_id}</p>
                          <div className="flex flex-wrap gap-3">
                            {pres.medicines.map((m, i) => (
                              <span key={i} className="px-4 py-2 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-xl text-[10px] font-black text-royal-dark dark:text-slate-300 uppercase tracking-widest">
                                {m.medicineName}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col justify-between items-end border-l border-slate-100 dark:border-white/5 pl-10">
                        <div className="text-right">
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Time Issued</p>
                          <p className="text-sm font-black text-royal-dark dark:text-white">{new Date(pres.created_at).toLocaleString()}</p>
                        </div>
                        <div className="flex gap-4">
                          <button className="p-4 bg-royal-dark text-white rounded-2xl hover:bg-tech-turquoise hover:text-royal-dark transition-all shadow-xl group-hover:scale-110">
                            <ChevronRight size={20} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
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

export default DoctorDashboard;
