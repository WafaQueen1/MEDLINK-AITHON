import React, { useState, useEffect } from 'react';
import { 
  Users, FileText, PlusCircle, Send, History, 
  AlertCircle, LayoutDashboard, ShieldCheck, Sparkles, Trash2,
  Clock, CheckCircle, Search
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import AISuggestionPanel from '../../components/AISuggestionPanel';
import { fetchPatients, createPrescriptionRequest, fetchPrescriptions } from '../../services/doctorService';

const DoctorDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('prescribe');
  const [prescription, setPrescription] = useState({
    patientId: '',
    notes: '',
    medicines: []
  });

  const [patients, setPatients] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadPatients();
  }, []);

  useEffect(() => {
    if (activeTab === 'history') {
      loadHistory();
    }
  }, [activeTab]);

  const loadPatients = async (search = '') => {
    try {
      setLoading(true);
      const data = await fetchPatients(search);
      setPatients(data.patients || []);
    } catch (err) {
      console.error("Fetch Patients Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadHistory = async () => {
    try {
      setLoading(true);
      const data = await fetchPrescriptions();
      setHistory(data.prescriptions || []);
    } catch (err) {
      console.error("Fetch History Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const patientMedications = {}; // Managed by real API now or AI suggestions

  const handleAddMedicineFromAI = (med) => {
    const newMed = {
      medicineName: med.brand || med.generic || med.name,
      dosage: med.dosage || "As prescribed",
      frequency: "1 pill / day",
      duration: "30 days"
    };

    setPrescription(prev => ({
      ...prev,
      medicines: [...prev.medicines, newMed]
    }));
  };

  const addManualMedicine = () => {
    setPrescription(prev => ({
      ...prev,
      medicines: [...prev.medicines, { medicineName: '', dosage: '', frequency: '', duration: '' }]
    }));
  };

  const removeMedicine = (index) => {
    setPrescription(prev => ({
      ...prev,
      medicines: prev.medicines.filter((_, i) => i !== index)
    }));
  };

  const handleSubmitPrescription = async (e) => {
    e.preventDefault();
    if (!prescription.patientId) return alert("Please select a patient.");
    if (prescription.medicines.length === 0) return alert("Please add at least one medicine.");
    
    try {
      setLoading(true);
      await createPrescriptionRequest(prescription);
      alert("✅ Digital Prescription successfully sent and secured!");
      setPrescription({ patientId: '', notes: '', medicines: [] });
      setActiveTab('history');
    } catch (err) {
      console.error("Submit Prescription Error:", err);
      alert("❌ Error sending prescription: " + (err.message || "Server Error"));
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'prescribe':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* 1. Patient Selector */}
            <div className="glass p-8 rounded-[2.5rem] border border-slate-200 dark:border-white/10 shadow-premium relative overflow-hidden">
              <div className="absolute top-0 left-0 w-2 h-full bg-tech-turquoise" />
              <label className="block text-xs font-black mb-4 text-slate-400 uppercase tracking-widest ml-4">Select Target Patient</label>
              <div className="relative">
                <Users className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                <select 
                  className="input-field w-full pl-16 py-5 text-lg font-bold bg-white dark:bg-[#151921] border-slate-100 dark:border-white/10 rounded-2xl shadow-inner outline-none focus:border-tech-turquoise transition-all"
                  value={prescription.patientId}
                  onChange={(e) => setPrescription({...prescription, patientId: e.target.value})}
                >
                  <option value="">-- Choose patient from registry --</option>
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.first_name} {p.last_name} ({p.age} yrs) - {p.chronic_disease || 'No Chronic'}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 2. Clinical Profile (Conditional) */}
            {prescription.patientId && patients.find(p => p.id === prescription.patientId)?.chronic_disease && (
              <div className="p-10 rounded-[3rem] bg-white dark:bg-[#151921] border border-slate-100 dark:border-white/10 shadow-premium">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-royal-dark dark:bg-white/10 rounded-2xl flex items-center justify-center text-tech-turquoise shadow-lg border border-white/5">
                      <History size={24} />
                    </div>
                    <h3 className="text-2xl font-black text-royal-dark dark:text-white tracking-tighter">Clinical Intelligence</h3>
                  </div>
                  <span className="px-6 py-2 bg-royal-green/10 text-royal-green text-[10px] font-black uppercase tracking-widest rounded-full border border-royal-green/20">Secure Record</span>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <div className="p-8 border border-slate-50 dark:border-white/5 rounded-[2rem] bg-slate-50 dark:bg-royal-dark/30">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Diagnosed Condition</p>
                    <p className="font-black text-royal-dark dark:text-white text-2xl tracking-tight">{patients.find(p => p.id === prescription.patientId)?.chronic_disease || 'None'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-6 p-8 bg-amber-500/5 border border-amber-500/20 rounded-[2rem]">
                  <AlertCircle className="text-amber-500 shrink-0 mt-1" size={24} />
                  <p className="text-sm font-medium text-amber-800 dark:text-amber-400 leading-relaxed">
                    <strong>Clinical Insight:</strong> This profile is synchronized with the national healthcare ledger. All active molecules are monitored for potential contraindications.
                  </p>
                </div>
              </div>
            )}

            {/* 3. AI Assistant */}
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-tech-turquoise to-royal-green rounded-[3rem] blur opacity-20" />
              <div className="relative">
                <AISuggestionPanel onAddMedicine={handleAddMedicineFromAI} />
              </div>
            </div>

            {/* 4. Prescription Builder */}
            <div className="glass p-12 rounded-[3rem] border border-slate-200 dark:border-white/10 shadow-premium">
              <div className="flex justify-between items-center mb-10 pb-8 border-b border-slate-100 dark:border-white/5">
                <div>
                  <h2 className="text-3xl font-black text-royal-dark dark:text-white tracking-tighter uppercase">Digital Script</h2>
                  <p className="text-[10px] text-slate-400 uppercase tracking-[0.3em] font-black mt-2">Molecules & Dosage Builder</p>
                </div>
                <button type="button" onClick={addManualMedicine} className="px-6 py-3 bg-royal-dark dark:bg-white text-white dark:text-royal-dark rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-transform flex items-center gap-2 shadow-xl">
                  <PlusCircle size={16} /> Manual Entry
                </button>
              </div>

              <form onSubmit={handleSubmitPrescription} className="space-y-10">
                <div className="space-y-6">
                  {prescription.medicines.length === 0 ? (
                    <div className="text-center p-20 border-2 border-dashed border-slate-200 dark:border-white/10 rounded-[3rem] text-slate-400 flex flex-col items-center justify-center bg-slate-50/30 dark:bg-transparent">
                      <Sparkles size={48} className="text-tech-turquoise mb-6 animate-pulse" />
                      <p className="font-black text-lg uppercase tracking-tight">Prescription Ledger Empty</p>
                      <p className="text-xs mt-2 uppercase tracking-widest opacity-60">Use AI Assistant or Add Manually</p>
                    </div>
                  ) : (
                    prescription.medicines.map((med, index) => (
                      <div key={index} className="p-8 bg-white dark:bg-[#151921] border border-slate-100 dark:border-white/5 rounded-[2.5rem] flex flex-col xl:flex-row gap-8 justify-between items-start xl:items-center relative group shadow-sm hover:shadow-xl transition-all">
                        <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-royal-dark dark:bg-white text-white dark:text-royal-dark rounded-2xl flex items-center justify-center text-xs font-black shadow-2xl">
                          {index + 1}
                        </div>
                        
                        <div className="flex-1 grid md:grid-cols-4 gap-6 w-full pl-6">
                          <div className="space-y-2">
                            <label className="text-[9px] uppercase font-black text-slate-400 tracking-[0.2em] ml-2">Molecule Name</label>
                            <input 
                              className="input-field py-4 px-6 bg-slate-50 dark:bg-royal-dark border-transparent w-full rounded-2xl font-bold outline-none focus:ring-2 focus:ring-tech-turquoise/20" 
                              value={med.medicineName} 
                              onChange={(e) => {
                                const newMeds = [...prescription.medicines];
                                newMeds[index].medicineName = e.target.value;
                                setPrescription({...prescription, medicines: newMeds});
                              }}
                              required 
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[9px] uppercase font-black text-slate-400 tracking-[0.2em] ml-2">Dosage</label>
                            <input 
                              className="input-field py-4 px-6 bg-slate-50 dark:bg-royal-dark border-transparent w-full rounded-2xl font-bold outline-none focus:ring-2 focus:ring-tech-turquoise/20" 
                              value={med.dosage} 
                              onChange={(e) => {
                                const newMeds = [...prescription.medicines];
                                newMeds[index].dosage = e.target.value;
                                setPrescription({...prescription, medicines: newMeds});
                              }}
                              required 
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[9px] uppercase font-black text-slate-400 tracking-[0.2em] ml-2">Frequency</label>
                            <input 
                              className="input-field py-4 px-6 bg-slate-50 dark:bg-royal-dark border-transparent w-full rounded-2xl font-bold outline-none focus:ring-2 focus:ring-tech-turquoise/20" 
                              value={med.frequency} 
                              onChange={(e) => {
                                const newMeds = [...prescription.medicines];
                                newMeds[index].frequency = e.target.value;
                                setPrescription({...prescription, medicines: newMeds});
                              }}
                              required 
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[9px] uppercase font-black text-slate-400 tracking-[0.2em] ml-2">Duration</label>
                            <input 
                              className="input-field py-4 px-6 bg-slate-50 dark:bg-royal-dark border-transparent w-full rounded-2xl font-bold outline-none focus:ring-2 focus:ring-tech-turquoise/20" 
                              value={med.duration} 
                              onChange={(e) => {
                                const newMeds = [...prescription.medicines];
                                newMeds[index].duration = e.target.value;
                                setPrescription({...prescription, medicines: newMeds});
                              }}
                              required 
                            />
                          </div>
                        </div>
                        
                        <button 
                          type="button"
                          onClick={() => removeMedicine(index)}
                          className="w-14 h-14 flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-2xl transition-all"
                        >
                          <Trash2 size={24} />
                        </button>
                      </div>
                    ))
                  )}
                </div>

                <div className="pt-6">
                  <label className="block text-xs font-black mb-4 text-slate-400 uppercase tracking-widest ml-6">Clinical Directives (Encrypted)</label>
                  <textarea 
                    className="input-field h-32 p-8 w-full bg-white dark:bg-[#151921] border-slate-100 dark:border-white/5 rounded-[2rem] resize-none font-medium text-lg shadow-inner outline-none focus:border-tech-turquoise"
                    placeholder="Additional instructions for patient or pharmacist..."
                    value={prescription.notes}
                    onChange={(e) => setPrescription({...prescription, notes: e.target.value})}
                  />
                </div>

                <div className="pt-8">
                  <button 
                    type="submit"
                    disabled={loading}
                    className="btn-royal w-full py-8 text-2xl font-black flex items-center justify-center gap-4 shadow-3xl hover:scale-[1.01] active:scale-[0.99] transition-all rounded-[2rem] disabled:opacity-50"
                  >
                    <Send size={28} />
                    {loading ? 'SECURING LEDGER...' : 'SIGN & BROADCAST PRESCRIPTION'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        );

      case 'dashboard':
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="p-12 rounded-[4rem] bg-white dark:bg-[#151921] border border-slate-100 dark:border-white/5 shadow-premium">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6">Patient Population</p>
              <h3 className="text-7xl font-black text-royal-dark dark:text-white tracking-tighter">{patients.length}</h3>
              <div className="mt-8 flex items-center gap-2 text-royal-green text-[10px] font-black uppercase tracking-widest">
                <CheckCircle size={14} /> Registry Verified
              </div>
            </div>
            <div className="p-12 rounded-[4rem] bg-tech-turquoise text-royal-dark shadow-3xl shadow-tech-turquoise/20">
              <p className="text-[10px] font-black opacity-60 uppercase tracking-[0.3em] mb-6">Cycle Throughput</p>
              <h3 className="text-7xl font-black tracking-tighter">{history.length}</h3>
              <p className="mt-8 text-[10px] font-black uppercase tracking-widest opacity-60">Total Encrypted Scripts</p>
            </div>
            <div className="p-12 rounded-[4rem] bg-royal-dark text-white shadow-premium">
              <p className="text-[10px] font-black opacity-40 uppercase tracking-[0.3em] mb-6">Security Layer</p>
              <h3 className="text-4xl font-black uppercase tracking-tighter">Active</h3>
              <div className="mt-12 w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <div className="w-full h-full bg-tech-turquoise animate-pulse" />
              </div>
            </div>
          </div>
        );

      case 'patients':
        return (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
              <div>
                <h2 className="text-5xl font-black text-royal-dark dark:text-white tracking-tighter uppercase">Registry Hub</h2>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-[0.3em] mt-3">Authenticated National Health Records</p>
              </div>
              <div className="relative w-full md:w-[450px]">
                <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-400" size={24} />
                <input 
                  placeholder="Filter records by ID or Name..."
                  className="input-field pl-20 pr-8 py-5 w-full bg-white dark:bg-[#151921] border-slate-100 dark:border-white/10 rounded-[2rem] shadow-xl text-lg font-bold outline-none focus:border-tech-turquoise"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    loadPatients(e.target.value);
                  }}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {patients.map(p => (
                <div key={p.id} className="p-10 rounded-[3.5rem] bg-white dark:bg-[#151921] border border-slate-50 dark:border-white/5 shadow-premium group hover:border-tech-turquoise/40 transition-all hover:-translate-y-2 cursor-pointer">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-8">
                      <div className="w-20 h-20 rounded-3xl bg-slate-50 dark:bg-royal-dark flex items-center justify-center text-3xl font-black text-royal-dark dark:text-white shadow-inner group-hover:bg-tech-turquoise group-hover:text-royal-dark transition-colors">
                        {p.first_name?.[0] || ''}{p.last_name?.[0] || ''}
                      </div>
                      <div>
                        <h4 className="text-2xl font-black text-royal-dark dark:text-white uppercase tracking-tighter">{p.first_name} {p.last_name}</h4>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">{p.age} YEARS • {p.sex} • CHIFA: {p.chifa_number?.slice(-4) || 'XXXX'}</p>
                      </div>
                    </div>
                    <span className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest ${p.chronic_disease ? 'bg-amber-500/10 text-amber-500' : 'bg-royal-green/10 text-royal-green'}`}>
                      {p.chronic_disease || 'No Chronic'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'history':
        return (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex justify-between items-end mb-12">
              <div>
                <h2 className="text-5xl font-black text-royal-dark dark:text-white tracking-tighter uppercase">Archive Hub</h2>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-[0.3em] mt-3">Verified Prescription Stream</p>
              </div>
              <button onClick={loadHistory} className="px-6 py-3 bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-tech-turquoise hover:text-royal-dark transition-all">Refresh Stream</button>
            </div>

            {loading && history.length === 0 ? (
              <div className="text-center py-32 animate-pulse text-slate-400 font-black uppercase tracking-[0.4em] text-sm">Synchronizing Secure Ledger...</div>
            ) : history.length === 0 ? (
              <div className="text-center py-32 text-slate-400 font-bold uppercase tracking-widest bg-white dark:bg-[#151921] rounded-[4rem] border border-dashed border-slate-200 dark:border-white/10">
                No prescription history detected in the digital vault.
              </div>
            ) : (
              <div className="space-y-8">
                {history.map((item) => (
                  <div key={item.id} className="p-12 rounded-[4rem] bg-white dark:bg-[#151921] border border-slate-100 dark:border-white/5 shadow-premium group transition-all hover:border-tech-turquoise/30">
                    <div className="flex justify-between items-start mb-10">
                      <div className="flex items-center gap-8">
                        <div className="w-16 h-16 bg-royal-dark rounded-[1.5rem] flex items-center justify-center text-tech-turquoise shadow-xl">
                          <History size={32} />
                        </div>
                        <div>
                          <h4 className="text-3xl font-black text-royal-dark dark:text-white uppercase tracking-tighter">
                            {item.patient_first_name} {item.patient_last_name}
                          </h4>
                          <div className="flex items-center gap-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-2">
                            <Clock size={14} className="text-tech-turquoise" />
                            {new Date(item.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 px-6 py-3 bg-royal-green/10 text-royal-green rounded-2xl text-[10px] font-black uppercase tracking-widest border border-royal-green/20 shadow-sm">
                        <CheckCircle size={16} /> Finalized & Secured
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {item.medicines.map((med, idx) => (
                        <div key={idx} className="p-8 rounded-[2rem] bg-slate-50 dark:bg-royal-dark/50 border border-slate-100 dark:border-white/5 shadow-inner">
                          <p className="text-lg font-black text-royal-dark dark:text-tech-turquoise mb-2 tracking-tight">{med.medicineName}</p>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{med.dosage} • {med.frequency}</p>
                          <p className="text-[9px] font-bold text-slate-400 uppercase mt-1 opacity-60">Duration: {med.duration}</p>
                        </div>
                      ))}
                    </div>
                    
                    {item.notes && (
                      <div className="mt-10 p-8 rounded-[2.5rem] bg-amber-500/5 border border-amber-500/10 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-2 h-full bg-amber-500/20" />
                        <p className="text-[10px] font-black text-amber-500 uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
                          <AlertCircle size={14} /> Clinical Directives
                        </p>
                        <p className="text-lg text-slate-600 dark:text-slate-400 font-bold italic leading-relaxed">"{item.notes}"</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-tech-gray dark:bg-royal-dark overflow-hidden font-sans transition-colors duration-300">
      
      {/* 🧭 PREMIUM SIDEBAR */}
      <aside className="w-80 bg-white dark:bg-[#0E1116] border-r border-slate-200 dark:border-white/10 flex flex-col p-8 z-30 shadow-2xl transition-colors duration-300">
         <div className="flex items-center gap-4 mb-12 group cursor-pointer">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-tech-turquoise to-royal-blue text-white flex items-center justify-center text-2xl font-black shadow-lg group-hover:rotate-12 transition-transform">
              {user?.firstName ? user.firstName[0] : 'D'}
            </div>
            <div>
              <h3 className="font-black text-xl text-royal-dark dark:text-white tracking-tighter">Dr. {user?.lastName || 'Doctor'}</h3>
              <div className="flex items-center gap-2 text-[10px] font-black text-royal-green uppercase tracking-widest mt-1">
                <div className="w-2 h-2 rounded-full bg-royal-green animate-pulse" /> Certified
              </div>
            </div>
         </div>

         <nav className="flex-1 space-y-3">
            {[
              { id: 'prescribe', label: 'New Prescription', icon: <PlusCircle size={20} /> },
              { id: 'patients', label: 'Patient Registry', icon: <Users size={20} /> },
              { id: 'history', label: 'Archive Hub', icon: <History size={20} /> },
              { id: 'dashboard', label: 'Analytics Hub', icon: <LayoutDashboard size={20} /> },
            ].map(item => (
              <button 
                key={item.id}
                onClick={() => setActiveTab(item.id)} 
                className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all font-black text-xs uppercase tracking-widest ${
                  activeTab === item.id 
                    ? 'bg-tech-turquoise text-royal-dark shadow-xl shadow-tech-turquoise/20 translate-x-2' 
                    : 'text-slate-500 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-royal-dark dark:hover:text-white'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
         </nav>

         <div className="pt-8 border-t border-slate-100 dark:border-white/5">
            <button 
              onClick={logout} 
              className="w-full py-4 rounded-2xl border border-red-500/20 text-red-500 font-black text-[10px] uppercase tracking-[0.3em] hover:bg-red-500 hover:text-white transition-all shadow-sm"
            >
              Terminate Session
            </button>
         </div>
      </aside> 

      {/* 🚀 MAIN WORKSPACE */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Dynamic Background Elements */}
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-tech-turquoise/5 blur-[150px] rounded-full pointer-events-none" />
        
        {/* Top Header Bar */}
        <div className="bg-white/80 dark:bg-[#0E1116]/80 backdrop-blur-xl border-b border-slate-100 dark:border-white/10 px-12 py-5 flex items-center justify-between z-20">
           <div className="flex items-center gap-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <Clock size={14} className="text-tech-turquoise" />
              <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
           </div>
           <div className="flex items-center gap-3 px-4 py-2 bg-royal-green/10 text-royal-green rounded-full text-[10px] font-black uppercase tracking-widest border border-royal-green/20">
              <ShieldCheck size={14} /> Encrypted Node: Alpha-7
           </div>
        </div>

        {/* Scrollable Content Area */}
        <main className="flex-1 overflow-auto p-12 custom-scrollbar relative z-10">
          <div className="max-w-5xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DoctorDashboard;