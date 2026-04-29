import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Send, AlertCircle, CheckCircle, Search, ShieldCheck, Clock, Stethoscope, ChevronRight } from 'lucide-react';
import { ALGERIAN_MEDICINES } from '../../services/MockData';
import { fetchPatients, createPrescriptionRequest } from '../../services/doctorService';

const DoctorWorkspace = () => {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [prescription, setPrescription] = useState([]);
  const [currentMed, setCurrentMed] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPatients = async () => {
      try {
        const data = await fetchPatients();
        setPatients(data.patients);
        if (data.patients.length > 0) {
          setSelectedPatient(data.patients[0]);
        }
      } catch (error) {
        console.error('Failed to fetch patients:', error);
      } finally {
        setLoading(false);
      }
    };
    loadPatients();
  }, []);

  useEffect(() => {
    if (currentMed.trim()) {
      const filtered = ALGERIAN_MEDICINES.filter(m => 
        m.name.toLowerCase().includes(currentMed.toLowerCase())
      );
      setSearchResults(filtered);
    } else {
      setSearchResults([]);
    }
  }, [currentMed]);

  const addMedicine = (med) => {
    setPrescription([...prescription, { 
      ...med, 
      id: Date.now(), 
      dosage: '1g', 
      frequency: 'Twice daily', 
      duration: '7 days' 
    }]);
    setCurrentMed('');
    setSearchResults([]);
  };

  const removeMed = (id) => {
    setPrescription(prescription.filter(m => m.id !== id));
  };

  const handleBroadcast = async () => {
    if (!selectedPatient || prescription.length === 0) return;

    setIsSending(true);
    try {
      const payload = {
        patientId: selectedPatient.id,
        notes: 'Broadcasted via Smart Pad',
        medicines: prescription.map(m => ({
          medicineName: m.name,
          dosage: m.dosage,
          frequency: m.frequency,
          duration: m.duration
        }))
      };

      await createPrescriptionRequest(payload);
      
      setShowConfetti(true);
      setTimeout(() => {
        setShowConfetti(false);
        setPrescription([]);
      }, 3000);
    } catch (error) {
      alert('Failed to send prescription: ' + error.message);
    } finally {
      setIsSending(false);
    }
  };

  if (loading) {
    return (
      <div className="pl-64 h-screen flex flex-col items-center justify-center bg-tech-gray text-royal-dark font-black tracking-[0.5em] animate-pulse">
        <div className="w-16 h-16 border-4 border-tech-turquoise border-t-transparent rounded-full animate-spin mb-8" />
        LOADING CLINICAL DATA...
      </div>
    );
  }

  return (
    <div className="pl-64 min-h-screen bg-tech-gray">
      <div className="p-8 max-w-6xl mx-auto">
        {/* Patient Context Bar */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass p-6 mb-8 flex justify-between items-center rounded-[32px] border-white shadow-premium"
        >
          <div className="flex gap-10">
            <div>
              <p className="text-[10px] uppercase font-black text-slate-400 tracking-[0.2em] mb-2">Active Patient</p>
              <div className="flex items-center gap-4">
                <select 
                  className="bg-tech-gray border-none font-black text-royal-dark text-xl tracking-tighter rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-tech-turquoise/20 transition-all cursor-pointer"
                  value={selectedPatient?.id}
                  onChange={(e) => setSelectedPatient(patients.find(p => p.id === e.target.value))}
                >
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>{p.first_name} {p.last_name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="w-px h-12 bg-slate-200" />
            <div>
              <p className="text-[10px] uppercase font-black text-slate-400 tracking-[0.2em] mb-2">Biometrics</p>
              <p className="font-black text-slate-700 text-lg">{selectedPatient?.age}Y • {selectedPatient?.sex?.toUpperCase()}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 bg-tech-turquoise/10 px-6 py-3 rounded-2xl border border-tech-turquoise/20">
            <div className="w-2.5 h-2.5 rounded-full bg-tech-turquoise animate-pulse" />
            <span className="text-sm font-black text-royal-dark uppercase tracking-widest">
              Digital ID: {selectedPatient?.id?.slice(0, 8)}
            </span>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Prescriber */}
          <div className="lg:col-span-8 space-y-8">
            <div className="card-premium relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-tech-turquoise/5 blur-[80px] rounded-full translate-x-1/2 -translate-y-1/2" />
              
              <div className="flex justify-between items-center mb-10 relative z-10">
                <div>
                  <h2 className="text-3xl font-black text-royal-dark tracking-tighter">Smart Pad</h2>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">AI-Powered Prescription Engine</p>
                </div>
                <div className="w-12 h-12 bg-tech-gray rounded-2xl flex items-center justify-center text-royal-dark group-hover:bg-tech-turquoise group-hover:text-white transition-all">
                  <Stethoscope size={24} />
                </div>
              </div>

              <div className="relative mb-10 z-10">
                <div className={`p-1.5 rounded-[24px] border-2 transition-all ${currentMed && searchResults.some(m => m.isRupture) ? 'border-tech-gold ring-4 ring-tech-gold/10' : 'border-slate-100 focus-within:border-tech-turquoise focus-within:ring-4 focus-within:ring-tech-turquoise/10'}`}>
                  <div className="relative">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input 
                      value={currentMed}
                      onChange={(e) => setCurrentMed(e.target.value)}
                      placeholder="Search Algerian Medicines (e.g. Augmentin)..."
                      className="w-full pl-16 pr-6 py-5 rounded-[18px] text-lg outline-none bg-transparent font-medium"
                    />
                  </div>
                </div>

                {/* Dropdown Results */}
                <AnimatePresence>
                  {searchResults.length > 0 && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute w-full mt-3 bg-white/90 backdrop-blur-xl border border-slate-200 rounded-3xl shadow-2xl z-30 overflow-hidden"
                    >
                      {searchResults.map(med => (
                        <button 
                          key={med.id}
                          onClick={() => addMedicine(med)}
                          className="w-full px-8 py-5 flex justify-between items-center hover:bg-tech-turquoise/5 transition-all text-left group/item"
                        >
                          <div>
                            <p className="font-black text-royal-dark text-lg group-hover/item:text-tech-turquoise transition-colors">{med.name}</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{med.genericName} • {med.type}</p>
                          </div>
                          {med.isRupture ? (
                            <span className="text-[10px] bg-tech-gold/20 text-royal-dark px-3 py-1.5 rounded-full font-black uppercase tracking-widest">Rupture</span>
                          ) : (
                            <ChevronRight size={18} className="text-slate-200 group-hover/item:translate-x-1 group-hover/item:text-tech-turquoise transition-all" />
                          )}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Prescription List */}
              <div className="space-y-4 min-h-[300px] relative z-10">
                <AnimatePresence mode="popLayout">
                  {prescription.map((med) => (
                    <motion.div 
                      key={med.id}
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="p-6 rounded-3xl bg-tech-gray border border-slate-100 flex justify-between items-center group/med"
                    >
                      <div>
                        <p className="font-black text-royal-dark text-lg uppercase tracking-tight">{med.name}</p>
                        <div className="flex gap-4 mt-2">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{med.dosage}</span>
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{med.frequency}</span>
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{med.duration}</span>
                        </div>
                      </div>
                      <button 
                        onClick={() => removeMed(med.id)}
                        className="w-10 h-10 rounded-xl bg-white text-slate-300 flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-all opacity-0 group-hover/med:opacity-100"
                      >
                        <Plus className="rotate-45" size={20} />
                      </button>
                    </motion.div>
                  ))}
                  {prescription.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center text-slate-300 py-20">
                      <Plus size={48} className="mb-4 opacity-20" />
                      <p className="font-bold uppercase tracking-[0.2em] text-[10px]">Empty Smart Pad</p>
                    </div>
                  )}
                </AnimatePresence>
              </div>

              <button 
                onClick={handleBroadcast}
                disabled={prescription.length === 0 || isSending}
                className="w-full mt-10 bg-royal-dark text-white py-6 rounded-3xl font-black text-lg tracking-widest uppercase shadow-2xl shadow-royal-dark/20 hover:bg-black transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {isSending ? (
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
                    <ShieldCheck size={24} />
                  </motion.div>
                ) : (
                  <Send size={24} />
                )}
                {isSending ? 'Syncing with Network...' : 'Finalize & Broadcast'}
              </button>
            </div>
          </div>

          {/* Right Sidebar - Clinical Context */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-royal-dark rounded-[40px] p-8 text-white shadow-2xl shadow-royal-dark/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-tech-turquoise/10 rounded-full -mr-16 -mt-16 blur-2xl" />
              <h3 className="text-xl font-black mb-8 flex items-center gap-3">
                <ShieldCheck size={24} className="text-tech-turquoise" />
                Medical Profile
              </h3>
              <div className="space-y-8">
                <div>
                  <p className="text-[10px] uppercase font-black text-white/30 tracking-[0.2em] mb-3">Chronic Condition</p>
                  <p className="text-lg font-black text-tech-turquoise uppercase tracking-tight">
                    {selectedPatient?.chronic_disease || 'None Reported'}
                  </p>
                </div>

                <div className="space-y-4">
                  <p className="text-[10px] uppercase font-black text-white/30 tracking-[0.2em] mb-4">Verification Status</p>
                  <div className="bg-white/5 p-5 rounded-3xl border border-white/10">
                    <div className="flex items-center gap-3 mb-2">
                      <BadgeCheck className="text-tech-turquoise" size={20} />
                      <span className="text-xs font-black uppercase tracking-widest">CNAS Verified</span>
                    </div>
                    <p className="text-[10px] text-white/40 font-medium">Standard 80% coverage applies to this session.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="card-premium p-8">
              <h4 className="font-black text-royal-dark uppercase tracking-tighter mb-4">Nearby Inventory</h4>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest leading-relaxed mb-6">Real-time check for Rupture medicines in Algiers network.</p>
              <div className="flex items-center gap-4 text-royal-dark bg-tech-gray p-5 rounded-2xl border border-slate-100 hover:border-tech-turquoise transition-all cursor-pointer">
                <Search size={20} />
                <span className="text-[10px] font-black tracking-[0.2em] uppercase">Analyze Local Stock</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Signature Animation Modal */}
      <AnimatePresence>
        {showConfetti && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-white/80 backdrop-blur-xl flex items-center justify-center"
          >
            <motion.div 
              initial={{ scale: 0.5, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="text-center"
            >
              <div className="w-24 h-24 bg-tech-turquoise rounded-full flex items-center justify-center text-royal-dark mx-auto mb-6 shadow-2xl shadow-tech-turquoise/20">
                <CheckCircle size={48} />
              </div>
              <h2 className="text-4xl font-black text-royal-dark tracking-tighter mb-2">SIGNED & SYNCED</h2>
              <p className="text-slate-500 font-black uppercase tracking-[0.2em] text-xs">Prescription Broadcasted to National Network</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DoctorWorkspace;
