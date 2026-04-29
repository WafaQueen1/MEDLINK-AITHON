import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  FileText, 
  PlusCircle, 
  Search, 
  ChevronRight, 
  Activity, 
  Stethoscope, 
  LogOut,
  BrainCircuit,
  Calendar,
  AlertCircle,
  CheckCircle2,
  HeartPulse,
  LayoutDashboard,
  MessageSquareCode,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import {
  createPatientRequest,
  createPrescriptionRequest,
  fetchDoctorDashboard,
  fetchPrescriptions,
} from '../../services/doctorService';

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
  const [patientSearch, setPatientSearch] = useState('');
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
    <div className="min-h-screen bg-[#FDFDFD] flex overflow-hidden font-sans">
      {/* Side Terminal Navigation */}
      <aside className="w-80 bg-royal-dark text-white flex flex-col p-10 relative z-20 shadow-2xl overflow-hidden">
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
            <h1 className="text-6xl font-black text-royal-dark tracking-tighter leading-none">
              Welcome back, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-royal-dark via-royal-green to-tech-turquoise">
                Dr. {user?.lastName}
              </span>
            </h1>
            <p className="text-slate-400 font-bold text-xs mt-4 uppercase tracking-widest">
              {user?.medicalSpecialty || 'General Practitioner'} • Hospital Central
            </p>
          </motion.div>
          
          <div className="flex gap-4">
            <div className="glass px-8 py-4 rounded-[2rem] border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-royal-dark font-black text-xs">
                {new Date().getDate()}
              </div>
              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Current Sync</p>
                <p className="text-sm font-black text-royal-dark">{new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</p>
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
                  <div className="p-12 rounded-[4rem] bg-white border border-slate-100 shadow-xl shadow-slate-200/20 relative overflow-hidden">
                    <div className="flex justify-between items-center mb-12">
                      <h3 className="text-2xl font-black text-royal-dark tracking-tighter uppercase">Clinical Activity</h3>
                      <button onClick={() => setActiveTab('patients')} className="btn-outline px-6 py-2 text-[10px]">Audit Registry</button>
                    </div>
                    
                    <div className="space-y-6">
                      {dashboard.patients.slice(0, 4).map((p) => (
                        <div key={p.id} className="flex justify-between items-center p-6 rounded-[2.5rem] bg-tech-gray/30 border border-transparent hover:border-tech-turquoise/30 hover:bg-white hover:shadow-2xl transition-all group cursor-pointer">
                          <div className="flex items-center gap-6">
                            <div className="w-16 h-16 bg-white rounded-[1.5rem] flex items-center justify-center text-royal-dark shadow-sm font-black text-lg border border-slate-100 group-hover:bg-royal-dark group-hover:text-white transition-all">
                              {p.first_name[0]}{p.last_name[0]}
                            </div>
                            <div>
                              <p className="font-black text-royal-dark text-lg uppercase tracking-tight leading-none mb-2">{p.first_name} {p.last_name}</p>
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
                            }} className="w-12 h-12 rounded-2xl bg-white text-slate-300 group-hover:bg-tech-turquoise group-hover:text-royal-dark flex items-center justify-center shadow-sm transition-all border border-slate-100 group-hover:border-transparent">
                              <ChevronRight size={24} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-4 space-y-10">
                  {/* AI Smart Terminal */}
                  <div className="p-10 rounded-[3.5rem] bg-royal-dark text-white shadow-3xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-tech-turquoise/10 blur-[80px] rounded-full group-hover:scale-150 transition-transform duration-1000" />
                    
                    <div className="flex items-center gap-4 mb-10 relative z-10">
                      <div className="w-14 h-14 bg-white/5 backdrop-blur-xl rounded-[1.5rem] flex items-center justify-center text-tech-turquoise border border-white/10 shadow-inner">
                        <MessageSquareCode size={28} />
                      </div>
                      <div>
                        <h3 className="text-xl font-black tracking-tighter leading-none mb-1">Generic AI</h3>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Substitution Engine</p>
                      </div>
                    </div>

                    <div className="space-y-6 relative z-10">
                      <div className="p-5 rounded-2xl bg-white/5 border border-white/5 text-[11px] font-medium leading-relaxed text-slate-300">
                        Hello Dr. {user?.lastName}, enter a brand name to discover optimal bio-equivalent generics available in the Algerian central stock.
                      </div>
                      
                      <div className="relative group/input">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within/input:text-tech-turquoise transition-colors" size={20} />
                        <input 
                          className="w-full bg-white/5 border border-white/10 rounded-[1.5rem] py-5 pl-16 pr-6 text-sm font-black text-tech-turquoise outline-none focus:ring-4 focus:ring-tech-turquoise/10 transition-all placeholder:text-white/10"
                          placeholder="Search molecule..."
                        />
                      </div>

                      <div className="pt-4 border-t border-white/5 space-y-4">
                        <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Live Suggestions</p>
                        <div className="flex flex-wrap gap-2">
                          {['Doliprane', 'Augmentin', 'Lasilix'].map(s => (
                            <span key={s} className="px-3 py-1.5 bg-white/5 border border-white/5 rounded-full text-[10px] font-bold text-slate-400 hover:text-tech-turquoise hover:border-tech-turquoise/30 cursor-pointer transition-all">{s}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Chifa Verification Promo */}
                  <div className="p-10 rounded-[3.5rem] bg-slate-100 border border-slate-200 relative overflow-hidden shadow-inner">
                    <ShieldCheck className="text-royal-green/20 absolute bottom-[-10px] right-[-10px]" size={120} />
                    <h4 className="text-sm font-black text-royal-dark uppercase tracking-widest mb-4">Network Security</h4>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed mb-6">Every ordonnance issued is cryptographically signed and verified via the national hub.</p>
                    <div className="flex items-center gap-2 px-3 py-1 bg-white border border-slate-200 rounded-full w-fit">
                      <div className="w-1.5 h-1.5 rounded-full bg-royal-green" />
                      <span className="text-[9px] font-black uppercase text-royal-dark">Verified Connection</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          
          {/* Implement other tabs similarly with Royal Polish... */}
          {activeTab === 'prescribe' && (
             <motion.div 
             key="prescribe"
             initial={{ opacity: 0, x: 30 }}
             animate={{ opacity: 1, x: 0 }}
             exit={{ opacity: 0, x: -30 }}
             className="max-w-4xl"
           >
             <div className="p-16 rounded-[4rem] bg-white border border-slate-100 shadow-3xl">
               <div className="flex items-center gap-4 mb-12">
                  <div className="w-14 h-14 bg-royal-dark text-tech-turquoise rounded-2xl flex items-center justify-center shadow-xl">
                    <PlusCircle size={32} />
                  </div>
                  <h2 className="text-4xl font-black text-royal-dark tracking-tighter uppercase leading-none">New Digital <br /> Ordonnance</h2>
               </div>
               
               <form onSubmit={handlePrescriptionSubmit} className="space-y-12">
                 <div className="grid md:grid-cols-2 gap-10">
                   <div className="space-y-4">
                     <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest ml-4 block">Target Registry Entry</label>
                     <div className="relative">
                       <Users className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                       <select 
                         className="w-full bg-slate-50 border border-slate-100 rounded-[1.5rem] py-5 pl-16 pr-8 text-sm font-black text-royal-dark outline-none focus:ring-4 focus:ring-tech-turquoise/10 transition-all appearance-none"
                         value={prescription.patientId}
                         onChange={(e) => setPrescription({ ...prescription, patientId: e.target.value })}
                         required
                       >
                         <option value="">Choose Patient</option>
                         {dashboard.patients.map(p => (
                           <option key={p.id} value={p.id}>{p.first_name} {p.last_name}</option>
                         ))}
                       </select>
                     </div>
                   </div>
                 </div>

                 <div className="space-y-8">
                   <div className="flex justify-between items-center px-4">
                    <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest block">Medications & Clinical Posology</label>
                    <button 
                      type="button" 
                      onClick={() => setPrescription({ ...prescription, medicines: [...prescription.medicines, { ...prescriptionItem }] })}
                      className="text-[10px] font-black text-tech-turquoise flex items-center gap-2 hover:bg-tech-turquoise/10 px-4 py-2 rounded-full transition-all uppercase tracking-widest"
                    >
                      <PlusCircle size={16} /> Add Substance
                    </button>
                   </div>
                   
                   {prescription.medicines.map((m, idx) => (
                     <motion.div 
                       key={idx} 
                       initial={{ opacity: 0, scale: 0.95 }}
                       animate={{ opacity: 1, scale: 1 }}
                       className="p-10 rounded-[3rem] bg-slate-50 border border-slate-100 space-y-6 relative group/item"
                     >
                       <div className="grid md:grid-cols-2 gap-6">
                         <div className="space-y-2">
                           <label className="text-[9px] uppercase font-black text-slate-300 tracking-widest ml-4">Drug Name</label>
                           <input 
                             placeholder="e.g. Paracetamol" 
                             className="input-field py-4 px-8" 
                             value={m.medicineName}
                             onChange={(e) => {
                               const updated = [...prescription.medicines];
                               updated[idx].medicineName = e.target.value;
                               setPrescription({ ...prescription, medicines: updated });
                             }}
                           />
                         </div>
                         <div className="space-y-2">
                           <label className="text-[9px] uppercase font-black text-slate-300 tracking-widest ml-4">Specific Dosage</label>
                           <input 
                             placeholder="e.g. 1000mg" 
                             className="input-field py-4 px-8"
                             value={m.dosage}
                             onChange={(e) => {
                               const updated = [...prescription.medicines];
                               updated[idx].dosage = e.target.value;
                               setPrescription({ ...prescription, medicines: updated });
                             }}
                           />
                         </div>
                       </div>
                       <div className="grid md:grid-cols-2 gap-6">
                         <div className="space-y-2">
                           <label className="text-[9px] uppercase font-black text-slate-300 tracking-widest ml-4">Administration frequency</label>
                           <input 
                             placeholder="e.g. 3 times daily" 
                             className="input-field py-4 px-8"
                             value={m.frequency}
                             onChange={(e) => {
                               const updated = [...prescription.medicines];
                               updated[idx].frequency = e.target.value;
                               setPrescription({ ...prescription, medicines: updated });
                             }}
                           />
                         </div>
                         <div className="space-y-2">
                           <label className="text-[9px] uppercase font-black text-slate-300 tracking-widest ml-4">Hub Duration</label>
                           <input 
                             placeholder="e.g. 10 days" 
                             className="input-field py-4 px-8"
                             value={m.duration}
                             onChange={(e) => {
                               const updated = [...prescription.medicines];
                               updated[idx].duration = e.target.value;
                               setPrescription({ ...prescription, medicines: updated });
                             }}
                           />
                         </div>
                       </div>
                     </motion.div>
                   ))}
                 </div>

                 <button type="submit" className="w-full btn-royal py-6 text-xl shadow-3xl group">
                   Sign & Broadcast <ChevronRight size={24} className="group-hover:translate-x-2 transition-transform" />
                 </button>
               </form>
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
