import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Shield, Lock, Mail, ChevronRight, Activity, Stethoscope, 
  Pill, Truck, User, UserCog, HeartPulse, ArrowLeft, 
  CheckCircle2, Fingerprint, Microscope, Globe
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const SignupPage = () => {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState('patient');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    licenseNumber: '',
    pharmacyName: '',
    medicalSpecialty: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    if (step < 2 && role !== 'patient') {
      setStep(2);
      return;
    }
    setLoading(true);
    setError('');
    try {
      await signup({ ...formData, role });
      navigate(`/${role.toLowerCase()}`);
    } catch (err) {
      setError(err.message || 'Verification failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const roles = [
    { id: 'patient', icon: <User />, label: 'Patient', desc: 'Personal health portal' },
    { id: 'doctor', icon: <Stethoscope />, label: 'Doctor', desc: 'Clinical prescribing terminal' },
    { id: 'pharmacist', icon: <Pill />, label: 'Pharmacist', desc: 'Dispensing & Chifa hub' },
    { id: 'supplier', icon: <Truck />, label: 'Supplier', desc: 'Inventory & supply chain' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-royal-dark flex font-sans overflow-hidden transition-colors duration-700">
      {/* 🌌 High-Fidelity Backdrop */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-tech-turquoise/5 blur-[180px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-royal-green/5 blur-[150px] rounded-full" />
      </div>

      {/* Left side: Institutional Trust & Info */}
      <div className="hidden lg:flex w-5/12 bg-royal-dark relative overflow-hidden flex-col justify-between p-24 text-white border-r border-white/5">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5" />
        
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10">
          <div className="flex items-center gap-4 mb-20">
            <div className="w-12 h-12 bg-tech-turquoise rounded-2xl flex items-center justify-center text-royal-dark shadow-2xl">
              <HeartPulse size={28} />
            </div>
            <span className="text-2xl font-black tracking-tighter uppercase">MEDLINK</span>
          </div>

          <div className="space-y-10">
            <div className="space-y-4">
              <span className="text-[10px] font-black text-tech-turquoise uppercase tracking-[0.4em] block">Sovereign Infrastructure</span>
              <h1 className="text-6xl font-black tracking-tighter leading-none mb-8">
                Join the <br /> <span className="gradient-text">National Grid.</span>
              </h1>
              <p className="text-lg text-slate-400 font-medium leading-relaxed max-w-sm">
                MedLink is the official digital backbone for the Algerian medical ecosystem, ensuring secure data exchange and professional collaboration.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-8 pt-12 border-t border-white/5">
              <TrustStat icon={<Fingerprint />} val="Biometric" label="ID Ready" />
              <TrustStat icon={<Globe />} val="National" label="Coverage" />
              <TrustStat icon={<Microscope />} val="Clinical" label="Validation" />
              <TrustStat icon={<Shield />} val="AES-256" label="Encryption" />
            </div>
          </div>
        </motion.div>

        <div className="relative z-10 flex items-center gap-4 text-xs font-black text-slate-500 uppercase tracking-widest">
          <div className="w-2 h-2 bg-tech-turquoise rounded-full animate-ping" />
          System Operational • 12.4k Nodes Active
        </div>
      </div>

      {/* Right side: Multi-step Signup Form */}
      <div className="w-full lg:w-7/12 flex items-center justify-center p-8 md:p-24 relative overflow-y-auto">
        <div className="w-full max-w-2xl relative z-10">
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="mb-12">
            <Link to="/login" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-royal-dark transition-colors mb-8 group">
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Terminal
            </Link>
            <h2 className="text-5xl font-black text-royal-dark dark:text-white tracking-tighter mb-4">Initialize Account.</h2>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Step {step} of {role === 'patient' ? '1' : '2'} • Role Selection</p>
          </motion.div>

          <form onSubmit={handleSignup} className="space-y-10">
            <AnimatePresence mode="wait">
              {step === 1 ? (
                <motion.div 
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-10"
                >
                  {/* Role Selection Grid */}
                  <div className="grid grid-cols-2 gap-6">
                    {roles.map((r) => (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => setRole(r.id)}
                        className={`p-8 rounded-[2.5rem] text-left transition-all duration-500 group relative overflow-hidden border-2 ${role === r.id ? 'bg-royal-dark text-white border-royal-dark shadow-3xl' : 'bg-white dark:bg-white/5 border-slate-100 dark:border-white/5 text-royal-dark dark:text-slate-400 hover:border-tech-turquoise/30'}`}
                      >
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-all duration-500 ${role === r.id ? 'bg-tech-turquoise text-royal-dark shadow-xl' : 'bg-slate-50 dark:bg-white/5 group-hover:scale-110'}`}>
                          {React.cloneElement(r.icon, { size: 28 })}
                        </div>
                        <h3 className="text-2xl font-black tracking-tighter mb-2 leading-none uppercase">{r.label}</h3>
                        <p className={`text-[10px] font-black uppercase tracking-widest opacity-60`}>{r.desc}</p>
                        {role === r.id && (
                          <motion.div layoutId="check" className="absolute top-6 right-6 text-tech-turquoise">
                            <CheckCircle2 size={24} />
                          </motion.div>
                        )}
                      </button>
                    ))}
                  </div>

                  <div className="grid md:grid-cols-2 gap-8 pt-6">
                    <div className="space-y-3">
                      <label className="text-[10px] uppercase font-black text-slate-400 tracking-[0.4em] ml-4 block">First Identity</label>
                      <input 
                        className="input-field dark:bg-white/5" 
                        placeholder="Clinical First Name"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] uppercase font-black text-slate-400 tracking-[0.4em] ml-4 block">Last Identity</label>
                      <input 
                        className="input-field dark:bg-white/5" 
                        placeholder="Clinical Last Name"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] uppercase font-black text-slate-400 tracking-[0.4em] ml-4 block">Professional Email</label>
                    <div className="relative">
                      <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                      <input 
                        type="email" 
                        className="input-field pl-16 dark:bg-white/5" 
                        placeholder="name@provider.dz"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-10"
                >
                  <button onClick={() => setStep(1)} className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400 hover:text-royal-dark transition-colors">
                    <ArrowLeft size={14} /> Back to Identity
                  </button>
                  
                  {role === 'doctor' && (
                    <div className="space-y-8">
                      <div className="space-y-3">
                        <label className="text-[10px] uppercase font-black text-slate-400 tracking-[0.4em] ml-4 block">Medical License Number</label>
                        <input className="input-field dark:bg-white/5" placeholder="CNOM-XXXX-XXXX" required />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] uppercase font-black text-slate-400 tracking-[0.4em] ml-4 block">Clinical Specialty</label>
                        <input className="input-field dark:bg-white/5" placeholder="e.g. Cardiology" required />
                      </div>
                    </div>
                  )}

                  {role === 'pharmacist' && (
                    <div className="space-y-8">
                      <div className="space-y-3">
                        <label className="text-[10px] uppercase font-black text-slate-400 tracking-[0.4em] ml-4 block">Pharmacy Registry Name</label>
                        <input className="input-field dark:bg-white/5" placeholder="Officine El-Chifa Algiers" required />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] uppercase font-black text-slate-400 tracking-[0.4em] ml-4 block">Tax Identifier (NIF)</label>
                        <input className="input-field dark:bg-white/5" placeholder="00016XXXXXXXXXX" required />
                      </div>
                    </div>
                  )}

                  <div className="space-y-3">
                    <label className="text-[10px] uppercase font-black text-slate-400 tracking-[0.4em] ml-4 block">Secure Password</label>
                    <div className="relative">
                      <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                      <input 
                        type="password" 
                        className="input-field pl-16 dark:bg-white/5" 
                        placeholder="••••••••••••"
                        required
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {error && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-3xl text-red-600 dark:text-red-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-4">
                <Activity size={16} className="animate-pulse" />
                {error}
              </motion.div>
            )}

            <div className="pt-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-royal text-xl py-6 shadow-3xl group"
              >
                {loading ? (
                  <div className="w-8 h-8 border-4 border-white/30 border-t-tech-turquoise rounded-full animate-spin" />
                ) : (
                  <>
                    {step === 1 && role !== 'patient' ? 'Validate Identity' : 'Establish Connection'}
                    <ChevronRight size={24} className="group-hover:translate-x-2 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </form>

          <p className="mt-12 text-center text-slate-400 font-bold text-xs uppercase tracking-widest">
            Already registered? <Link to="/login" className="text-royal-dark dark:text-white border-b-2 border-tech-turquoise/30">Terminal Access</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

const TrustStat = ({ icon, val, label }) => (
  <div className="flex flex-col gap-3">
    <div className="text-tech-turquoise">
      {React.cloneElement(icon, { size: 24 })}
    </div>
    <div>
      <p className="text-xl font-black text-white leading-none">{val}</p>
      <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">{label}</p>
    </div>
  </div>
);

export default SignupPage;
