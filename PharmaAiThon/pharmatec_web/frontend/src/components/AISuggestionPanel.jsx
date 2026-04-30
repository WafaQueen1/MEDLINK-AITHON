import { useState } from 'react';
import { Sparkles, Plus, AlertTriangle, Loader2 } from 'lucide-react';

const AISuggestionPanel = ({ onAddMedicine }) => {
  const [diagnosis, setDiagnosis] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const getSuggestions = async () => {
    if (!diagnosis.trim()) return;

    setLoading(true);
    setSuggestions([]);

    // Mock Data - للهاكاثون (جميلة وواقعية)
    setTimeout(() => {
      setSuggestions([
        {
          id: 1,
          brand: "Norvasc",
          generic: "Amlodipine 5 mg",
          dosage: "1 tablet per day",
          rupture: false,
          note: "First-line medication for hypertension in Algeria"
        },
        {
          id: 2,
          brand: "Glucophage",
          generic: "Metformin 500 mg",
          dosage: "2 times per day",
          rupture: true,
          note: "Frequent shortage in recent weeks"
        },
        {
          id: 3,
          brand: "Cozaar",
          generic: "Losartan 50 mg",
          dosage: "1 tablet per day",
          rupture: false,
          note: "Excellent alternative for intolerance cases"
        }
      ]);
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="glass p-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-gradient-to-br from-royal-green to-tech-turquoise rounded-2xl flex items-center justify-center">
          <Sparkles className="w-7 h-7 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-semibold gradient-text">Clinical AI Assistant</h2>
          <p className="text-slate-500 dark:text-slate-400">
            Describe the patient's diagnosis
          </p>
        </div>
      </div>

      {/* Input Area */}
      <div className="flex gap-4 mb-8">
        <input
          type="text"
          value={diagnosis}
          onChange={(e) => setDiagnosis(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && getSuggestions()}
          placeholder="Ex: Hypertension, Type 2 Diabetes, Urinary Tract Infection..."
          className="input-field flex-1 text-lg py-4"
        />
        <button
          onClick={getSuggestions}
          disabled={loading || !diagnosis.trim()}
          className="btn-royal px-10 text-base font-semibold whitespace-nowrap"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              Analyzing...
            </span>
          ) : (
            'Suggest'
          )}
        </button>
      </div>

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <div className="space-y-5">
          <h3 className="text-lg font-medium text-slate-700 dark:text-slate-300 mb-4">
            Recommended medications for this case
          </h3>

          {suggestions.map((med) => (
            <div
              key={med.id}
              className="glass p-6 flex flex-col md:flex-row md:items-center gap-6 group hover:border-tech-turquoise/60 transition-all duration-300"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-bold text-xl text-royal-green">{med.brand}</span>
                  {med.rupture && (
                    <span className="flex items-center gap-1.5 text-xs font-medium bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300 px-4 py-1 rounded-2xl">
                      <AlertTriangle className="w-4 h-4" />
                      Possible Shortage
                    </span>
                  )}
                </div>

                <p className="text-tech-turquoise font-medium text-lg">{med.generic}</p>
                <p className="text-slate-600 dark:text-slate-400 mt-2">{med.dosage}</p>
                {med.note && (
                  <p className="text-sm text-slate-500 mt-3 italic border-l-2 border-tech-turquoise pl-3">
                    {med.note}
                  </p>
                )}
              </div>

              <button
                onClick={() => onAddMedicine(med)}
                className="btn-royal flex items-center gap-3 px-8 py-3 text-base group-hover:scale-105 transition-transform"
              >
                <Plus className="w-5 h-5" />
                Add to Prescription
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AISuggestionPanel;
