import { useState, useEffect } from 'react';
import { User, FileText, Users, Clock, PlusCircle, Send } from 'lucide-react';
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
    { id: 1, first_name: "Ahmed", last_name: "Bensaid", age: 54, sex: "Male" },
    { id: 2, first_name: "Amira", last_name: "Belkacem", age: 37, sex: "Female" },
  ];

  const handleAddMedicineFromAI = (med) => {
    const newMed = {
      medicineName: med.brand || med.generic || med.name,
      dosage: med.dosage || "Selon prescription",
      frequency: "1 fois par jour",
      duration: "30 jours"
    };

    setPrescription(prev => ({
      ...prev,
      medicines: [...prev.medicines, newMed]
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
    if (prescription.medicines.length === 0) {
      alert("أضف على الأقل دواء واحد");
      return;
    }
    alert("✅ الوصفة تم إرسالها بنجاح إلى النظام!");
    // هنا سيتم استدعاء الـ API الحقيقي لاحقاً
    setPrescription({ patientId: '', notes: '', medicines: [] });
  };

  return (
    <div className="flex h-screen bg-tech-gray dark:bg-royal-dark overflow-hidden">
      {/* Sidebar */}
      <aside className="w-72 bg-white dark:bg-royal-dark border-r border-slate-200 dark:border-white/10 flex flex-col">
        <div className="p-6 border-b border-slate-200 dark:border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-royal-green to-tech-turquoise rounded-2xl flex items-center justify-center text-white font-bold text-2xl">
              M
            </div>
            <div>
              <h1 className="text-2xl font-bold gradient-text">MEDLINK</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">Doctor Terminal</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {[
            { id: 'prescribe', label: 'Nouvelle Ordonnance', icon: <PlusCircle size={20} /> },
            { id: 'patients', label: 'Mes Patients', icon: <Users size={20} /> },
            { id: 'history', label: 'Historique', icon: <FileText size={20} /> },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-left transition-all ${
                activeTab === tab.id 
                  ? 'bg-tech-turquoise text-white shadow-lg' 
                  : 'hover:bg-slate-100 dark:hover:bg-white/5 text-slate-600 dark:text-slate-300'
              }`}
            >
              {tab.icon}
              <span className="font-semibold">{tab.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-slate-200 dark:border-white/10">
          <button onClick={logout} className="w-full py-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-2xl font-medium flex items-center justify-center gap-2">
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-10">
        <div className="max-w-5xl mx-auto">
          <div className="mb-12">
            <h1 className="text-5xl font-black text-royal-dark dark:text-white tracking-tighter">
              Bienvenue, Dr. {user?.lastName || 'Benali'}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2">Terminal Clinique • {new Date().toLocaleDateString('fr-FR')}</p>
          </div>

          {activeTab === 'prescribe' && (
            <div className="space-y-10">
              {/* AI Suggestion Panel */}
              <AISuggestionPanel onAddMedicine={handleAddMedicineFromAI} />

              {/* Prescription Form */}
              <div className="glass p-10 rounded-3xl">
                <h2 className="text-3xl font-bold mb-8 gradient-text">Nouvelle Ordonnance Digitale</h2>

                <form onSubmit={handleSubmitPrescription} className="space-y-8">
                  <div>
                    <label className="block text-sm font-medium mb-3">Patient</label>
                    <select 
                      className="input-field"
                      value={prescription.patientId}
                      onChange={(e) => setPrescription({...prescription, patientId: e.target.value})}
                    >
                      <option value="">Choisir un patient</option>
                      {patients.map(p => (
                        <option key={p.id} value={p.id}>
                          {p.first_name} {p.last_name} ({p.age} ans)
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Medicines List */}
                  <div>
                    <div className="flex justify-between mb-4">
                      <label className="block text-sm font-medium">Médicaments</label>
                      <span className="text-xs text-slate-500">{prescription.medicines.length} médicament(s)</span>
                    </div>

                    {prescription.medicines.map((med, index) => (
                      <div key={index} className="glass p-6 mb-4 flex justify-between items-center">
                        <div>
                          <p className="font-semibold">{med.medicineName}</p>
                          <p className="text-sm text-slate-500">{med.dosage} • {med.frequency}</p>
                        </div>
                        <button 
                          type="button"
                          onClick={() => removeMedicine(index)}
                          className="text-red-500 hover:text-red-600"
                        >
                          Supprimer
                        </button>
                      </div>
                    ))}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-3">Notes Cliniques</label>
                    <textarea 
                      className="input-field h-32"
                      placeholder="Instructions spéciales..."
                      value={prescription.notes}
                      onChange={(e) => setPrescription({...prescription, notes: e.target.value})}
                    />
                  </div>

                  <button 
                    type="submit"
                    className="btn-royal w-full py-5 text-lg flex items-center justify-center gap-3"
                  >
                    <Send size={22} />
                    Signer et Envoyer l'Ordonnance
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Other tabs can be added later */}
          {activeTab === 'patients' && <div className="text-center py-20 text-slate-400">Patient Registry - Coming Soon</div>}
          {activeTab === 'history' && <div className="text-center py-20 text-slate-400">Archive Hub - Coming Soon</div>}
        </div>
      </main>
    </div>
  );
};

export default DoctorDashboard;