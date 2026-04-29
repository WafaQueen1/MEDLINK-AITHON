import React, { useState } from 'react';
import { 
  Users, FileText, PlusCircle, Send, History, 
  AlertCircle, LayoutDashboard, ShieldCheck, Sparkles, Trash2 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import AISuggestionPanel from '../../components/AISuggestionPanel';

const DoctorDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('prescribe');
  const [prescription, setPrescription] = useState({
    patientId: '',
    notes: '',
    medicines: []
  });

  // Mock data for demo
  const patients = [
    { id: 1, first_name: "Ahmed", last_name: "Bensaid", age: 54, sex: "Male", chronicDisease: "Hypertension" },
    { id: 2, first_name: "Amira", last_name: "Belkacem", age: 37, sex: "Female", chronicDisease: "None" },
  ];

  const patientMedications = {
    1: [
      { name: "Amlodipine 5mg", type: "Chronic", interactionWarning: false },
      { name: "Glucophage 850mg", type: "Chronic", interactionWarning: true }
    ],
    2: []
  };

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

  const handleSubmitPrescription = (e) => {
    e.preventDefault();
    if (!prescription.patientId) return alert("Please select a patient.");
    if (prescription.medicines.length === 0) return alert("Please add at least one medicine.");
    
    alert("✅ Digital Prescription successfully sent and secured!");
    setPrescription({ patientId: '', notes: '', medicines: [] });
  };

  return (
    <div className="flex h-screen bg-tech-gray dark:bg-royal-dark overflow-hidden font-sans transition-colors duration-300">
      
      {/* Sidebar Navigation */}
      <aside className="w-72 bg-white dark:bg-[#0E1116] border-r border-slate-200 dark:border-white/10 flex flex-col shadow-xl z-20">
        <div className="p-8 border-b border-slate-200 dark:border-white/10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-royal-green to-tech-turquoise rounded-2xl flex items-center justify-center shadow-lg text-white font-black text-2xl">
              M
            </div>
            <div>
              <h1 className="text-2xl font-black text-royal-dark dark:text-white tracking-tight">MEDLINK</h1>
              <p className="text-[10px] font-bold text-tech-turquoise uppercase tracking-widest">Doctor Terminal</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-6 space-y-3">
          {[
            { id: 'prescribe', label: 'New Prescription', icon: <PlusCircle size={20} /> },
            { id: 'dashboard', label: 'Dashboard Overview', icon: <LayoutDashboard size={20} /> },
            { id: 'patients', label: 'My Patients', icon: <Users size={20} /> },
            { id: 'history', label: 'Archive Hub', icon: <FileText size={20} /> },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-left transition-all font-semibold text-sm ${
                activeTab === tab.id 
                  ? 'bg-tech-turquoise/10 text-tech-turquoise shadow-sm border border-tech-turquoise/20' 
                  : 'hover:bg-slate-100 dark:hover:bg-white/5 text-slate-500 dark:text-slate-400'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-slate-200 dark:border-white/10">
          <button onClick={logout} className="w-full py-4 text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-2xl font-bold flex items-center justify-center transition-all text-sm uppercase tracking-widest">
            Logout
          </button>
        </div>
      </aside>

      {/* Main Workspace */}
      <main className="flex-1 overflow-auto p-12 custom-scrollbar relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-tech-turquoise/5 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="max-w-5xl mx-auto relative z-10">
          <header className="mb-12 flex justify-between items-end">
            <div>
              <h1 className="text-4xl font-black text-royal-dark dark:text-white tracking-tighter">
                Welcome back, <span className="gradient-text">Dr. {user?.lastName || 'Doctor'}</span>
              </h1>
              <div className="flex items-center gap-3 mt-3 text-sm font-medium text-slate-500">
                <ShieldCheck size={16} className="text-royal-green" />
                <span>Verified Clinical Session</span>
                <span className="w-1 h-1 rounded-full bg-slate-300" />
                <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
            </div>
          </header>

          {activeTab === 'prescribe' && (
            <div className="space-y-8">
              
              {/* 1. Patient Selector */}
              <div className="glass p-8 rounded-[2rem] border border-slate-200 dark:border-white/10 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-2 h-full bg-tech-turquoise" />
                <label className="block text-xs font-black mb-4 text-slate-500 uppercase tracking-widest ml-4">Select Target Patient</label>
                <div className="relative">
                  <Users className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <select 
                    className="input-field w-full pl-16 py-4 text-lg font-bold bg-white dark:bg-[#151921] border-slate-200 dark:border-white/10"
                    value={prescription.patientId}
                    onChange={(e) => setPrescription({...prescription, patientId: e.target.value})}
                  >
                    <option value="">-- Choose a patient --</option>
                    {patients.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.first_name} {p.last_name} ({p.age} yrs) - {p.chronicDisease}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 2. Current Medications & Interaction Warning */}
              {prescription.patientId && patientMedications[prescription.patientId]?.length > 0 && (
                <div className="p-8 rounded-[2rem] bg-white dark:bg-[#151921] border border-slate-200 dark:border-white/10 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-100 dark:bg-white/5 text-royal-dark dark:text-white rounded-xl flex items-center justify-center">
                        <History size={20} />
                      </div>
                      <h3 className="text-xl font-black text-royal-dark dark:text-white">Active Medications</h3>
                    </div>
                    <span className="px-4 py-1.5 bg-royal-green/10 text-royal-green text-[10px] font-black uppercase tracking-widest rounded-full">Patient History</span>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4 mb-6">
                    {patientMedications[prescription.patientId].map((med, idx) => (
                      <div key={idx} className="p-4 border border-slate-100 dark:border-white/5 rounded-2xl flex justify-between items-center bg-slate-50 dark:bg-transparent">
                        <div>
                          <p className="font-bold text-royal-dark dark:text-white">{med.name}</p>
                          <p className="text-xs text-slate-500 uppercase font-bold tracking-wide mt-1">{med.type}</p>
                        </div>
                        <span className="w-2 h-2 rounded-full bg-tech-turquoise shadow-[0_0_8px_rgba(45,212,191,0.5)]" />
                      </div>
                    ))}
                  </div>

                  <div className="flex items-start gap-4 p-6 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-500/20 rounded-2xl">
                    <AlertCircle className="text-amber-500 shrink-0 mt-0.5" size={20} />
                    <p className="text-sm font-medium text-amber-800 dark:text-amber-400 leading-relaxed">
                      <strong>AI Interaction Alert:</strong> Patient is currently taking Metformin (Glucophage). Exercise caution if prescribing Iodine contrast media or NSAIDs to avoid renal complications.
                    </p>
                  </div>
                </div>
              )}

              {/* 3. AI Suggestion Panel (The Star) */}
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-tech-turquoise to-royal-green rounded-[2.5rem] blur opacity-20" />
                <div className="relative">
                  <AISuggestionPanel onAddMedicine={handleAddMedicineFromAI} />
                </div>
              </div>

              {/* 4. Prescription Builder */}
              <div className="glass p-10 rounded-[2.5rem] border border-slate-200 dark:border-white/10 shadow-sm">
                <div className="flex justify-between items-center mb-8 pb-6 border-b border-slate-100 dark:border-white/5">
                  <div>
                    <h2 className="text-2xl font-black text-royal-dark dark:text-white tracking-tight">Digital Ordonnance</h2>
                    <p className="text-xs text-slate-500 uppercase tracking-widest font-bold mt-2">Medication Builder</p>
                  </div>
                  <button type="button" onClick={addManualMedicine} className="btn-outline px-6 py-3 text-xs flex items-center gap-2">
                    <PlusCircle size={16} /> Add Manual Entry
                  </button>
                </div>

                <form onSubmit={handleSubmitPrescription} className="space-y-8">
                  
                  <div className="space-y-4">
                    {prescription.medicines.length === 0 ? (
                      <div className="text-center p-12 border-2 border-dashed border-slate-200 dark:border-white/10 rounded-3xl text-slate-400 flex flex-col items-center justify-center">
                        <Sparkles size={40} className="text-slate-300 dark:text-slate-600 mb-4 opacity-50" />
                        <p className="font-bold">No medicines added yet.</p>
                        <p className="text-sm mt-1">Use the AI Assistant above or add manually.</p>
                      </div>
                    ) : (
                      prescription.medicines.map((med, index) => (
                        <div key={index} className="p-6 bg-white dark:bg-[#151921] border border-slate-200 dark:border-white/10 rounded-2xl flex flex-col xl:flex-row gap-6 justify-between items-start xl:items-center relative group">
                          <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-royal-dark dark:bg-white text-white dark:text-royal-dark rounded-full flex items-center justify-center text-[10px] font-black shadow-md">
                            {index + 1}
                          </div>
                          
                          <div className="flex-1 grid md:grid-cols-4 gap-4 w-full pl-4">
                            <div className="space-y-1">
                              <label className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Medicine Name</label>
                              <input 
                                className="input-field py-3 px-4 bg-slate-50 dark:bg-royal-dark border-transparent w-full" 
                                value={med.medicineName} 
                                onChange={(e) => {
                                  const newMeds = [...prescription.medicines];
                                  newMeds[index].medicineName = e.target.value;
                                  setPrescription({...prescription, medicines: newMeds});
                                }}
                                required 
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Dosage</label>
                              <input 
                                className="input-field py-3 px-4 bg-slate-50 dark:bg-royal-dark border-transparent w-full" 
                                value={med.dosage} 
                                onChange={(e) => {
                                  const newMeds = [...prescription.medicines];
                                  newMeds[index].dosage = e.target.value;
                                  setPrescription({...prescription, medicines: newMeds});
                                }}
                                required 
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Frequency</label>
                              <input 
                                className="input-field py-3 px-4 bg-slate-50 dark:bg-royal-dark border-transparent w-full" 
                                value={med.frequency} 
                                onChange={(e) => {
                                  const newMeds = [...prescription.medicines];
                                  newMeds[index].frequency = e.target.value;
                                  setPrescription({...prescription, medicines: newMeds});
                                }}
                                required 
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Duration</label>
                              <input 
                                className="input-field py-3 px-4 bg-slate-50 dark:bg-royal-dark border-transparent w-full" 
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
                            className="w-12 h-12 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="pt-4">
                    <label className="block text-xs font-black mb-3 text-slate-500 uppercase tracking-widest ml-4">Clinical Notes (Optional)</label>
                    <textarea 
                      className="input-field h-24 p-6 w-full bg-white dark:bg-[#151921] resize-none"
                      placeholder="Special instructions for patient or pharmacist..."
                      value={prescription.notes}
                      onChange={(e) => setPrescription({...prescription, notes: e.target.value})}
                    />
                  </div>

                  {/* 5. Sign & Send Button */}
                  <div className="pt-6">
                    <button 
                      type="submit"
                      className="btn-royal w-full py-6 text-xl font-black flex items-center justify-center gap-3 shadow-xl hover:scale-[1.01] transition-transform rounded-[1.5rem]"
                    >
                      <Send size={24} />
                      Sign & Send Digital Prescription
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {activeTab === 'dashboard' && <div className="text-center py-20 text-slate-400 font-medium">Dashboard Overview - Coming Soon</div>}
          {activeTab === 'patients' && <div className="text-center py-20 text-slate-400 font-medium">Patient Registry - Coming Soon</div>}
          {activeTab === 'history' && <div className="text-center py-20 text-slate-400 font-medium">Archive Hub - Coming Soon</div>}
        </div>
      </main>
    </div>
  );
};

export default DoctorDashboard;