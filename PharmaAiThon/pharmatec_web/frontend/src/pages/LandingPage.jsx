import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Activity, Truck, Lock, ChevronRight, Stethoscope, Pill, LayoutDashboard, HeartPulse } from 'lucide-react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white selection:bg-tech-turquoise selection:text-royal-dark overflow-x-hidden">
      {/* Mesh Gradient Background */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-tech-turquoise/10 blur-[180px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-royal-dark/5 blur-[150px] rounded-full" />
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-royal-green/5 blur-[120px] rounded-full animate-bounce duration-[10s]" />
      </div>

      {/* Navigation */}
      <nav className="fixed w-full z-50 glass px-8 py-5 border-b border-white/10 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="w-12 h-12 bg-royal-dark rounded-2xl flex items-center justify-center text-tech-turquoise shadow-2xl shadow-tech-turquoise/20 group-hover:scale-110 transition-transform">
              <HeartPulse size={28} className="animate-pulse" />
            </div>
            <span className="text-3xl font-black tracking-tighter text-royal-dark">MED<span className="text-tech-turquoise">LINK</span></span>
          </div>
          <div className="hidden lg:flex gap-10 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
            <a href="#features" className="hover:text-royal-dark transition-colors">Infrastructure</a>
            <a href="#solutions" className="hover:text-royal-dark transition-colors">Ecosystem</a>
            <a href="#network" className="hover:text-royal-dark transition-colors">Security</a>
          </div>
          <Link to="/login" className="bg-royal-dark text-white font-black py-3 px-8 rounded-2xl flex items-center gap-2 hover:bg-royal-green transition-all shadow-2xl shadow-royal-dark/20 group">
            Network Access <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-52 pb-32 px-8 relative">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-24 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-5 py-2 bg-royal-dark text-white rounded-full text-[10px] font-black uppercase tracking-widest mb-10 shadow-xl shadow-royal-dark/10">
              <span className="w-2 h-2 bg-tech-turquoise rounded-full animate-ping" />
              Live Clinical Network
            </div>
            <h1 className="text-7xl md:text-[100px] font-black text-royal-dark leading-[0.8] tracking-tighter mb-10">
              يربط نبض <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-royal-dark via-royal-green to-tech-turquoise">الصحة في الجزائر.</span>
            </h1>
            <p className="text-2xl text-slate-500 leading-relaxed max-w-xl mb-14 font-medium italic">
              Connecting the breath of health. A unified digital terminal linking the entire Algerian medical supply chain.
            </p>
            <div className="flex flex-col sm:row gap-8">
              <Link 
                to="/signup" 
                className="btn-royal text-xl font-black px-16 py-6 rounded-3xl shadow-3xl group"
              >
                Join the Grid
                <ChevronRight size={24} />
              </Link>
              <button className="bg-white border-2 border-slate-100 text-royal-dark text-xl font-black px-16 py-6 rounded-3xl hover:border-tech-turquoise hover:shadow-turquoise transition-all flex items-center justify-center gap-3">
                <Activity size={24} /> Infrastructure Map
              </button>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="relative h-[600px] flex items-center justify-center"
          >
            {/* 3D Floating Icons Container */}
            <div className="relative w-full h-full flex items-center justify-center">
              <FloatingIcon 
                icon={<Stethoscope />} 
                label="Doctor" 
                pos="top-[0%] left-[20%]" 
                delay={0} 
                color="bg-royal-dark" 
              />
              <FloatingIcon 
                icon={<Pill />} 
                label="Pharmacy" 
                pos="top-[40%] right-[10%]" 
                delay={1} 
                color="bg-tech-turquoise text-royal-dark" 
              />
              <FloatingIcon 
                icon={<Activity />} 
                label="Patient" 
                pos="bottom-[10%] left-[30%]" 
                delay={2} 
                color="bg-royal-green" 
              />
              <div className="w-[400px] h-[400px] border-[1px] border-slate-100 rounded-full absolute animate-spin-slow opacity-50" />
              <div className="w-[300px] h-[300px] border-[1px] border-tech-turquoise/20 rounded-full absolute animate-reverse-spin-slow opacity-30" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Feature Showcase */}
      <section id="features" className="py-40 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex flex-col md:row justify-between items-end mb-24 gap-10">
            <div className="max-w-2xl">
              <span className="text-[10px] font-black text-tech-turquoise uppercase tracking-[0.4em] mb-4 block">Core Modules</span>
              <h2 className="text-5xl md:text-6xl font-black text-royal-dark tracking-tighter leading-tight">
                Enterprise-Grade <br /> Healthcare Backbone.
              </h2>
            </div>
            <p className="text-slate-500 text-xl font-medium max-w-sm mb-2 leading-relaxed">
              Proprietary AI for generic substitution, real-time Chifa billing, and end-to-end supply chain visibility.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <FeatureCard 
              icon={<Shield />} 
              title="Chifa 2.0" 
              desc="Deep integration with Algerian health insurance protocols for instant billing and coverage verification."
            />
            <FeatureCard 
              icon={<Lock />} 
              title="Zero-Trust Privacy" 
              desc="Encrypted clinical records and immutable audit logs that comply with global medical security standards."
            />
            <FeatureCard 
              icon={<LayoutDashboard />} 
              title="Predictive Ops" 
              desc="Real-time demand heatmaps that prevent drug shortages before they impact the patient."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-royal-dark py-24 px-8 text-white border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:row justify-between items-center gap-16 mb-20">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-tech-turquoise text-royal-dark rounded-2xl flex items-center justify-center">
                <HeartPulse size={36} />
              </div>
              <div>
                <span className="text-4xl font-black tracking-tighter block">MEDLINK</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Algeria National Hub</span>
              </div>
            </div>
            <div className="flex gap-12 text-sm font-bold text-slate-400 uppercase tracking-widest">
              <a href="#" className="hover:text-tech-turquoise transition-colors">Privacy</a>
              <a href="#" className="hover:text-tech-turquoise transition-colors">Terms</a>
              <a href="#" className="hover:text-tech-turquoise transition-colors">Security</a>
            </div>
          </div>
          <div className="pt-12 border-t border-white/5 flex flex-col md:row justify-between items-center gap-8">
            <p className="text-slate-500 font-medium">© 2026 MedLink Infrastructure Hub. Built for PharmaAiThon.</p>
            <div className="flex gap-4">
              {['IN', 'TW', 'FB'].map(social => (
                <div key={social} className="w-12 h-12 rounded-2xl border border-white/10 flex items-center justify-center hover:bg-tech-turquoise/20 transition-all cursor-pointer font-black text-xs">
                  {social}
                </div>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

const FloatingIcon = ({ icon, label, pos, delay, color }) => (
  <motion.div 
    initial={{ y: 0 }}
    animate={{ y: [0, -30, 0] }}
    transition={{ repeat: Infinity, duration: 4 + delay, ease: "easeInOut" }}
    className={`absolute ${pos} flex flex-col items-center gap-4 z-10 group`}
  >
    <div className={`w-24 h-24 ${color} rounded-[32px] flex items-center justify-center text-white shadow-2xl group-hover:scale-110 transition-transform cursor-pointer`}>
      {React.cloneElement(icon, { size: 40 })}
    </div>
    <div className="glass px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-royal-dark opacity-0 group-hover:opacity-100 transition-opacity">
      {label}
    </div>
  </motion.div>
);

const FeatureCard = ({ icon, title, desc }) => (
  <div className="p-12 rounded-[50px] bg-white border border-slate-100 hover:border-tech-turquoise/30 transition-all group shadow-sm hover:shadow-xl hover:shadow-tech-turquoise/5">
    <div className="w-16 h-16 bg-tech-gray rounded-3xl flex items-center justify-center text-royal-dark mb-10 group-hover:bg-royal-dark group-hover:text-tech-turquoise transition-all group-hover:rotate-6">
      {React.cloneElement(icon, { size: 32 })}
    </div>
    <h3 className="text-3xl font-black text-royal-dark mb-6 tracking-tight">{title}</h3>
    <p className="text-slate-500 font-medium leading-relaxed text-lg">{desc}</p>
  </div>
);

export default LandingPage;
