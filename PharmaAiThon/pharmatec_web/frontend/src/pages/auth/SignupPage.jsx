import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, Lock, Mail, ChevronRight, Activity, Stethoscope, Pill, Truck, User, MapPin, BadgeCheck, Loader2, HeartPulse } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const SignupPage = () => {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState('patient');
  const [isLoading, setIsLoading] = useState(false);
  const { signup } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    medicalSpecialty: '',
    licenseNumber: '',
    chifaNumber: '',
    pharmacyName: '',
    address: '',
  });

  const navigate = useNavigate();

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSignup = async () => {
    setIsLoading(true);
    try {
      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        role: role,
        medicalSpecialty: formData.medicalSpecialty,
        licenseNumber: formData.licenseNumber,
        pharmacyName: formData.pharmacyName,
        pharmacyAddress: formData.address,
        chifaNumber: formData.chifaNumber,
      };

      const user = await signup(payload);
      const targetRole = user.role.toLowerCase();
      navigate(`/${targetRole}`);
    } catch (error) {
      alert('Registration failed: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const roles = [
    { id: 'patient', icon: <User />, label: 'Patient', desc: 'National Chifa Card Holder' },
    { id: 'doctor', icon: <Stethoscope />, label: 'Doctor', desc: 'Licensed Medical Practitioner' },
    { id: 'pharmacist', icon: <Pill />, label: 'Pharmacist', desc: 'Registered Dispensing Hub' },
    { id: 'supplier', icon: <Truck />, label: 'Supplier', desc: 'Supply Chain Partner' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-tech-turquoise/5 blur-[180px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-royal-dark/5 blur-[150px] rounded-full" />
      </div>
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-5xl grid md:grid-cols-12 glass rounded-[3rem] overflow-hidden shadow-premium"
      >
        {/* Left Side: Progress & Branding */}
        <div className="md:col-span-4 bg-royal-dark p-12 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-tech-turquoise/10 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-16">
              <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-tech-turquoise border border-white/20">
                <HeartPulse size={24} />
              </div>
              <span className="text-2xl font-black tracking-tighter">MEDLINK</span>
            </div>
            
            <div className="space-y-12">
              {[
                { s: 1, l: 'System Role', d: 'Identify your medical status' },
                { s: 2, l: 'Personal Identity', d: 'Legal name and credentials' },
                { s: 3, l: 'Security Grid', d: 'Verification and encryption' },
              ].map((item) => (
                <div key={item.s} className={`flex gap-6 items-start transition-all duration-500 ${step === item.s ? 'opacity-100 translate-x-2' : 'opacity-30'}`}>
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm ${step === item.s ? 'bg-tech-turquoise text-royal-dark shadow-turquoise' : 'bg-white/10 border border-white/10'}`}>
                    {item.s}
                  </div>
                  <div>
                    <p className="font-black text-sm uppercase tracking-[0.2em]">{item.l}</p>
                    <p className="text-[10px] text-slate-400 font-bold mt-1">{item.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-10 pt-12 border-t border-white/10">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-3">Institutional Partner</p>
            <div className="flex items-center gap-2">
              <Shield size={16} className="text-tech-turquoise" />
              <p className="text-sm font-bold text-white tracking-tight">Algerian Ministry of Health</p>
            </div>
          </div>
        </div>

        {/* Right Side: Step Forms */}
        <div className="md:col-span-8 p-16 bg-white/80 backdrop-blur-md">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
              >
                <h2 className="text-4xl font-black text-royal-dark tracking-tighter mb-4">Choose your Portal.</h2>
                <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-10">Select your role in the medical ecosystem</p>
                
                <div className="grid grid-cols-2 gap-6 mb-12">
                  {roles.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => setRole(r.id)}
                      className={`p-8 rounded-[32px] border-2 text-left transition-all group relative overflow-hidden ${role === r.id ? 'border-tech-turquoise bg-tech-turquoise/5' : 'border-slate-50 hover:border-tech-turquoise/20'}`}
                    >
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-all ${role === r.id ? 'bg-royal-dark text-tech-turquoise shadow-xl' : 'bg-slate-50 text-slate-300'}`}>
                        {React.cloneElement(r.icon, { size: 28 })}
                      </div>
                      <p className="font-black text-royal-dark text-lg tracking-tight uppercase">{r.label}</p>
                      <p className="text-[10px] text-slate-400 font-bold mt-2 leading-relaxed">{r.desc}</p>
                    </button>
                  ))}
                </div>
                <button onClick={handleNext} className="btn-royal w-full py-6 text-xl">
                  Identify Details <ChevronRight size={24} />
                </button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                className="space-y-8"
              >
                <h2 className="text-4xl font-black text-royal-dark tracking-tighter mb-10">Personal Credentials.</h2>
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] uppercase font-black text-slate-400 tracking-[0.2em] ml-2">First Identity</label>
                    <input 
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="input-field py-5 px-8 text-lg" 
                      placeholder="Lamine" 
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] uppercase font-black text-slate-400 tracking-[0.2em] ml-2">Last Identity</label>
                    <input 
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="input-field py-5 px-8 text-lg" 
                      placeholder="Bensaid" 
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] uppercase font-black text-slate-400 tracking-[0.2em] ml-2">Medical Communication Email</label>
                  <div className="relative">
                    <Mail className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-400" size={22} />
                    <input 
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="input-field pl-20 py-5 text-lg" 
                      placeholder="amine@pharmatec.dz" 
                    />
                  </div>
                </div>
                <div className="flex gap-6 pt-6">
                  <button onClick={handleBack} className="w-1/3 py-5 rounded-2xl border-2 border-slate-100 font-black text-slate-400 hover:border-royal-dark hover:text-royal-dark transition-all">Back</button>
                  <button onClick={handleNext} className="btn-royal flex-1 py-5 text-xl">Continue to Verification <ChevronRight size={24} /></button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                className="space-y-8"
              >
                <h2 className="text-4xl font-black text-royal-dark tracking-tighter mb-10">Institutional Verification.</h2>
                
                {role === 'patient' && (
                  <div className="space-y-3">
                    <label className="text-[10px] uppercase font-black text-slate-400 tracking-[0.2em] ml-2">National Chifa ID (18 Digits)</label>
                    <div className="relative">
                      <BadgeCheck className="absolute left-8 top-1/2 -translate-y-1/2 text-tech-turquoise" size={22} />
                      <input 
                        name="chifaNumber"
                        value={formData.chifaNumber}
                        onChange={handleChange}
                        className="input-field pl-20 py-5 text-lg" 
                        placeholder="0000 0000 0000 0000 00" 
                      />
                    </div>
                  </div>
                )}

                {role === 'doctor' && (
                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[10px] uppercase font-black text-slate-400 tracking-[0.2em] ml-2">Medical Specialty</label>
                      <input 
                        name="medicalSpecialty"
                        value={formData.medicalSpecialty}
                        onChange={handleChange}
                        className="input-field py-5 text-lg px-8" 
                        placeholder="e.g. Cardiology" 
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] uppercase font-black text-slate-400 tracking-[0.2em] ml-2">License Number</label>
                      <input 
                        name="licenseNumber"
                        value={formData.licenseNumber}
                        onChange={handleChange}
                        className="input-field py-5 text-lg px-8" 
                        placeholder="DZ-XXXX-MED" 
                      />
                    </div>
                  </div>
                )}

                {(role === 'pharmacist' || role === 'supplier') && (
                  <div className="space-y-3">
                    <label className="text-[10px] uppercase font-black text-slate-400 tracking-[0.2em] ml-2">Operational Address</label>
                    <div className="relative">
                      <MapPin className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-400" size={22} />
                      <input 
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className="input-field pl-20 py-5 text-lg" 
                        placeholder="Didouche Mourad, Algiers" 
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  <label className="text-[10px] uppercase font-black text-slate-400 tracking-[0.2em] ml-2">Security Hash (Password)</label>
                  <div className="relative">
                    <Lock className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-400" size={22} />
                    <input 
                      type="password" 
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="input-field pl-20 py-5 text-lg" 
                      placeholder="••••••••••••" 
                    />
                  </div>
                </div>

                <div className="flex gap-6 pt-6">
                  <button onClick={handleBack} className="w-1/3 py-5 rounded-2xl border-2 border-slate-100 font-black text-slate-400 hover:border-royal-dark hover:text-royal-dark transition-all">Back</button>
                  <button 
                    onClick={handleSignup} 
                    disabled={isLoading}
                    className="btn-royal flex-1 py-5 text-xl"
                  >
                    {isLoading ? <Loader2 className="animate-spin" /> : 'Finalize Encryption'} 
                    {!isLoading && <ChevronRight size={24} />}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-16 text-center border-t border-slate-50 pt-10">
            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">
              Already in the system? <Link to="/login" className="text-royal-dark font-black hover:text-tech-turquoise transition-colors ml-2">Login to Terminal</Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SignupPage;
