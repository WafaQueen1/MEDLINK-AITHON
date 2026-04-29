import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, Lock, Mail, ChevronRight, Activity, Stethoscope, Pill, Truck, User, UserCog, HeartPulse } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const LoginPage = () => {
  const [email, setEmail] = useState('doctor@pharmatec.com');
  const [password, setPassword] = useState('password123');
  const [role, setRole] = useState('doctor');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const user = await login({ email, password });
      const targetRole = user.role.toLowerCase();
      navigate(`/${targetRole}`);
    } catch (err) {
      setError(err.message || 'Failed to connect to workspace');
    } finally {
      setLoading(false);
    }
  };

  const roles = [
    { id: 'patient', icon: <User />, label: 'Patient' },
    { id: 'doctor', icon: <Stethoscope />, label: 'Doctor' },
    { id: 'pharmacist', icon: <Pill />, label: 'Pharmacist' },
    { id: 'supplier', icon: <Truck />, label: 'Supplier' },
    { id: 'admin', icon: <UserCog />, label: 'Admin' },
  ];

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex font-sans overflow-hidden">
      {/* Left side: Premium Branding with Mesh Effect */}
      <div className="hidden lg:flex w-7/12 bg-royal-dark relative overflow-hidden flex-col justify-center px-28 text-white">
        <div className="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
        
        {/* Living Mesh Gradients */}
        <motion.div 
          animate={{ scale: [1, 1.2, 1], x: [0, 50, 0], y: [0, -50, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-tech-turquoise/20 blur-[150px] rounded-full" 
        />
        <motion.div 
          animate={{ scale: [1.2, 1, 1.2], x: [0, -100, 0], y: [0, 50, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-30%] left-[-20%] w-[1000px] h-[1000px] bg-royal-green/20 blur-[180px] rounded-full" 
        />

        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          className="relative z-10"
        >
          <div className="flex items-center gap-4 mb-16">
            <div className="w-14 h-14 bg-tech-turquoise rounded-2xl flex items-center justify-center text-royal-dark shadow-3xl shadow-tech-turquoise/30">
              <HeartPulse size={32} className="animate-pulse" />
            </div>
            <div>
              <span className="text-3xl font-black tracking-tighter block leading-none">MEDLINK</span>
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">Medical OS v2.0</span>
            </div>
          </div>

          <div className="space-y-6 mb-12">
            <span className="text-[11px] font-black text-tech-turquoise uppercase tracking-[0.6em] block opacity-80">تسجيل الدخول الآمن</span>
            <h1 className="text-8xl font-black tracking-tighter leading-[0.85]">
              Unlock <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-tech-turquoise via-royal-green to-white">Digital Health.</span>
            </h1>
          </div>
          
          <p className="text-xl text-slate-400 font-medium max-w-lg leading-relaxed mb-12">
            The national infrastructure for clinical data exchange, secure prescribing, and pharmacist fulfillment.
          </p>

          <div className="flex items-center gap-8">
            <div className="flex -space-x-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="w-12 h-12 rounded-full border-4 border-royal-dark bg-slate-800 flex items-center justify-center text-[10px] font-black">
                  USR
                </div>
              ))}
            </div>
            <p className="text-xs font-black text-slate-500 uppercase tracking-widest">
              Join <span className="text-white">+2.4k</span> active providers
            </p>
          </div>
        </motion.div>
      </div>

      {/* Right side: Modern Login Form */}
      <div className="w-full lg:w-5/12 flex items-center justify-center p-12 md:p-24 relative bg-white">
        <div className="w-full max-w-md relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-16"
          >
            <div className="lg:hidden flex items-center gap-3 mb-10">
              <div className="w-10 h-10 bg-royal-dark text-tech-turquoise rounded-xl flex items-center justify-center">
                <HeartPulse size={24} />
              </div>
              <span className="text-2xl font-black tracking-tighter text-royal-dark">MEDLINK</span>
            </div>
            <h2 className="text-5xl font-black text-royal-dark tracking-tighter mb-4">Welcome back.</h2>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Authenticate to access your workspace hub</p>
          </motion.div>

          {/* High-Fidelity Role Switcher */}
          <div className="flex justify-between p-2 bg-slate-50 rounded-3xl border border-slate-100 mb-12 shadow-inner">
            {roles.map((r) => (
              <button
                key={r.id}
                onClick={() => setRole(r.id)}
                className={`relative p-5 rounded-[1.2rem] transition-all duration-500 group ${role === r.id ? 'text-white' : 'text-slate-400 hover:text-royal-dark'}`}
              >
                {role === r.id && (
                  <motion.div
                    layoutId="role-bg-premium"
                    className="absolute inset-0 bg-royal-dark rounded-[1.2rem] shadow-2xl shadow-royal-dark/30"
                    transition={{ type: 'spring', bounce: 0.1, duration: 0.8 }}
                  />
                )}
                <span className={`relative z-10 transition-transform group-hover:scale-110 block ${role === r.id ? 'text-tech-turquoise' : ''}`}>
                  {React.cloneElement(r.icon, { size: 24 })}
                </span>
                {/* Tooltip Label */}
                {role === r.id && (
                   <motion.span 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-[9px] font-black uppercase text-royal-dark tracking-widest whitespace-nowrap"
                   >
                    {r.label} Access
                   </motion.span>
                )}
              </button>
            ))}
          </div>

          <form onSubmit={handleLogin} className="space-y-8 mt-16">
            <div className="space-y-3">
              <label className="text-[10px] uppercase font-black text-slate-400 tracking-[0.4em] ml-4 block">Medical Identifier</label>
              <div className="relative group">
                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-tech-turquoise transition-colors" size={20} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field pl-16"
                  placeholder="doctor@pharmalink.dz"
                  required
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] uppercase font-black text-slate-400 tracking-[0.4em] ml-4 block">Security Key</label>
              <div className="relative group">
                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-tech-turquoise transition-colors" size={20} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pl-16"
                  placeholder="••••••••••••"
                  required
                />
              </div>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="p-6 bg-red-50 border border-red-100 rounded-3xl text-red-600 text-[11px] font-black uppercase tracking-widest flex items-center gap-4"
                >
                  <div className="w-2 h-2 bg-red-600 rounded-full animate-ping" />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-royal text-xl py-6"
            >
              {loading ? (
                <div className="w-8 h-8 border-4 border-white/30 border-t-tech-turquoise rounded-full animate-spin" />
              ) : (
                <>
                  Unlock Portal <ChevronRight size={24} className="group-hover:translate-x-2 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-16 text-center">
            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">
              New to the ecosystem? <Link to="/signup" className="text-royal-dark hover:text-tech-turquoise transition-colors border-b-2 border-tech-turquoise/30">Request Credentials</Link>
            </p>
          </div>
        </div>

        {/* Subtle Background Elements */}
        <div className="absolute bottom-10 right-10 flex gap-6 opacity-20">
          <Shield size={40} className="text-royal-dark" />
          <Activity size={40} className="text-royal-dark" />
        </div>
      </div>
    </div>
  );
};
