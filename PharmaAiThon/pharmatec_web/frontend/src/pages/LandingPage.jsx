import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  Shield, Activity, Truck, Lock, ChevronRight, Stethoscope, 
  Pill, LayoutDashboard, HeartPulse, ArrowRight, CheckCircle2, 
  Users, Globe, Zap, BarChart3, Fingerprint, Microscope
} from 'lucide-react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const y2 = useTransform(scrollY, [0, 500], [0, -150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-royal-dark transition-colors duration-700 selection:bg-tech-turquoise selection:text-royal-dark overflow-x-hidden">
      {/* 🌌 Dynamic Mesh Background */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-tech-turquoise/10 dark:bg-tech-turquoise/5 blur-[180px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-royal-green/10 dark:bg-royal-green/5 blur-[150px] rounded-full" />
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-royal-dark/5 dark:bg-white/5 blur-[120px] rounded-full" />
      </div>

      {/* 🧭 Navigation */}
      <nav className="fixed w-full z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto bg-white/90 dark:bg-royal-green/95 backdrop-blur-2xl border border-slate-200 dark:border-royal-green/50 px-8 py-4 rounded-[2rem] flex justify-between items-center shadow-xl dark:shadow-2xl">
          <div className="flex items-center gap-3 group cursor-pointer">
            <motion.div 
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.8, type: "spring" }}
              className="w-10 h-10 bg-royal-dark dark:bg-tech-turquoise rounded-xl flex items-center justify-center text-tech-turquoise dark:text-royal-dark shadow-xl"
            >
              <HeartPulse size={24} className="animate-pulse" />
            </motion.div>
            <span className="text-2xl font-black tracking-tighter text-royal-dark dark:text-white uppercase">
              MED<span className="text-tech-turquoise dark:text-pale-gold">LINK</span>
            </span>
          </div>
          
          <div className="hidden lg:flex gap-10 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 dark:text-white/70">
            <a href="#ecosystem" className="hover:text-tech-turquoise dark:hover:text-white transition-colors">Ecosystem</a>
            <a href="#infrastructure" className="hover:text-tech-turquoise dark:hover:text-white transition-colors">Infrastructure</a>
            <a href="#security" className="hover:text-tech-turquoise dark:hover:text-white transition-colors">Security</a>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/login" className="hidden sm:block text-[10px] font-black uppercase tracking-widest text-royal-dark dark:text-white hover:text-tech-turquoise dark:hover:text-pale-gold transition-colors mr-4">
              Access Terminal
            </Link>
            <Link to="/signup" className="btn-royal text-xs px-6 py-3 dark:border-white/20 dark:shadow-xl dark:shadow-black/20">
              Join Network <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </nav>

      {/* 🚀 Hero Section */}
      <section className="relative pt-40 pb-20 px-8">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-royal-green/10 dark:bg-white/5 border border-royal-green/20 dark:border-white/10 rounded-full text-[10px] font-black text-royal-green dark:text-tech-turquoise uppercase tracking-widest mb-8">
              <Zap size={14} /> Unified Healthcare Architecture
            </div>
            <h1 className="text-6xl md:text-[90px] font-black text-royal-dark dark:text-white leading-[0.9] tracking-tighter mb-8">
              Digitalizing the <br />
              <span className="gradient-text">Algerian Pulse.</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-500 dark:text-slate-400 leading-relaxed max-w-xl mb-12 font-medium">
              A sovereign, cloud-native medical ecosystem connecting doctors, pharmacists, and patients across the nation.
            </p>
            <div className="flex flex-col sm:flex-row gap-6">
              <Link to="/signup" className="btn-royal text-lg px-12 py-5 shadow-2xl shadow-tech-turquoise/20">
                Register as Provider <ChevronRight size={20} />
              </Link>
              <button className="glass dark:bg-white/5 border-slate-200 dark:border-white/10 text-royal-dark dark:text-white text-lg font-black px-12 py-5 rounded-2xl hover:bg-slate-100 dark:hover:bg-white/10 transition-all flex items-center justify-center gap-3">
                Watch System Demo
              </button>
            </div>

            {/* Live Stats */}
            <div className="grid grid-cols-3 gap-8 mt-20 pt-12 border-t border-slate-200 dark:border-white/5">
              {[
                { label: 'Clinics', val: '1.2k+' },
                { label: 'Pharmacies', val: '850+' },
                { label: 'Uptime', val: '99.9%' }
              ].map((stat, i) => (
                <div key={i}>
                  <p className="text-2xl font-black text-royal-dark dark:text-white">{stat.val}</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <div className="relative hidden lg:flex items-center justify-center h-[700px]">
            {/* Visual Centerpiece: Interactive Hub */}
            <motion.div 
              style={{ y: y1 }}
              className="absolute w-[500px] h-[500px] bg-gradient-to-br from-royal-green/10 to-tech-turquoise/10 rounded-full blur-3xl" 
            />
            
            <div className="relative z-10 grid grid-cols-2 gap-6 w-full">
              <RoleCard 
                icon={<Stethoscope />} 
                role="Doctor" 
                desc="Smart AI-Prescribing"
                pos="translate-y-12"
                color="text-royal-green"
              />
              <RoleCard 
                icon={<Pill />} 
                role="Pharmacist" 
                desc="Instant Chifa Billing"
                pos="-translate-y-8"
                color="text-tech-turquoise"
              />
              <RoleCard 
                icon={<Activity />} 
                role="Patient" 
                desc="Unified Health ID"
                pos="translate-y-8"
                color="text-royal-dark"
              />
              <RoleCard 
                icon={<Truck />} 
                role="Supplier" 
                desc="Predictive Inventory"
                pos="-translate-y-12"
                color="text-slate-400"
              />
            </div>

            {/* Floating Decorative Elements */}
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
              className="absolute w-full h-full border-[1px] border-dashed border-slate-300 dark:border-white/10 rounded-full opacity-30" 
            />
          </div>
        </div>
      </section>

      {/* 🏥 Ecosystem Role Segments */}
      <section id="ecosystem" className="py-32 px-8 bg-white dark:bg-royal-dark/50 transition-colors">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <span className="text-[10px] font-black text-tech-turquoise uppercase tracking-[0.5em] mb-6 block">Unified Workflow</span>
            <h2 className="text-5xl md:text-6xl font-black text-royal-dark dark:text-white tracking-tighter mb-8">
              Built for every <span className="gradient-text">stakeholder.</span>
            </h2>
            <p className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-medium">
              MedLink bridges the gap between clinical intent and operational execution.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <RoleDetail 
              title="Doctors"
              items={[
                "AI-Powered Smart Prescriber",
                "Instant Patient Clinical Timeline",
                "Direct Lab Result Integration"
              ]}
              icon={<Microscope />}
            />
            <RoleDetail 
              title="Pharmacists"
              items={[
                "Real-time Chifa Validation",
                "Automated Inventory Thresholds",
                "Supply Chain Shortage Alerts"
              ]}
              icon={<Zap />}
              active={true}
            />
            <RoleDetail 
              title="Patients"
              items={[
                "Digital Prescription Wallet",
                "National Health Passport",
                "Smart Refill Reminders"
              ]}
              icon={<Fingerprint />}
            />
          </div>
        </div>
      </section>

      {/* 🛡️ Infrastructure Section */}
      <section id="infrastructure" className="py-40 px-8 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            <div className="order-2 lg:order-1">
              <div className="grid grid-cols-2 gap-6">
                <StatCard icon={<Shield />} title="99.9% SLI" desc="Institutional Uptime" />
                <StatCard icon={<Lock />} title="AES-256" desc="Encryption Standard" />
                <StatCard icon={<Users />} title="1.2M+" desc="Connected Records" />
                <StatCard icon={<Globe />} title="Local" desc="Algerian Data Centers" />
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <span className="text-[10px] font-black text-tech-turquoise uppercase tracking-[0.5em] mb-6 block">National Grid</span>
              <h2 className="text-5xl md:text-6xl font-black text-royal-dark dark:text-white tracking-tighter mb-8">
                Securing the <br /> <span className="gradient-text">Future of Care.</span>
              </h2>
              <p className="text-xl text-slate-500 dark:text-slate-400 leading-relaxed mb-10 font-medium">
                Our infrastructure is built to survive. We combine high-availability cloud nodes with local data sovereignty, ensuring Algerian medical data remains secure and accessible.
              </p>
              <button className="btn-royal px-10 py-5 text-lg">
                View Infrastructure Audit <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 📜 Trust Section */}
      <section className="py-32 px-8 border-t border-slate-100 dark:border-white/5">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-16">Endorsed by Institutional Leaders</p>
          <div className="flex flex-wrap justify-center gap-20 opacity-50 grayscale hover:grayscale-0 transition-all duration-700">
            {/* Placeholder Logos */}
            <div className="text-2xl font-black text-royal-dark dark:text-white flex items-center gap-2 italic">MINISTRY OF HEALTH</div>
            <div className="text-2xl font-black text-royal-dark dark:text-white flex items-center gap-2 italic">PHARMA-UNION</div>
            <div className="text-2xl font-black text-royal-dark dark:text-white flex items-center gap-2 italic">CHIFA-GOV</div>
            <div className="text-2xl font-black text-royal-dark dark:text-white flex items-center gap-2 italic">ALGERIA CLINIC</div>
          </div>
        </div>
      </section>

      {/* 🏁 Final CTA */}
      <section className="py-40 px-8 relative">
        <div className="max-w-5xl mx-auto glass dark:bg-white/5 rounded-[4rem] p-16 md:p-32 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-tech-turquoise/20 blur-[150px] -z-10" />
          <h2 className="text-5xl md:text-7xl font-black text-royal-dark dark:text-white tracking-tighter mb-10 leading-none">
            Ready to link your <br /> <span className="gradient-text">clinical mission?</span>
          </h2>
          <p className="text-xl md:text-2xl text-slate-500 dark:text-slate-400 mb-16 font-medium">
            Join thousands of Algerian medical providers in the digital transformation.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link to="/signup" className="btn-royal text-xl px-16 py-6">
              Create Provider Account
            </Link>
            <button className="text-lg font-black text-royal-dark dark:text-white hover:text-tech-turquoise transition-colors flex items-center justify-center gap-3">
              Talk to Deployment Expert <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </section>

      {/* 🌑 Footer */}
      <footer className="bg-royal-dark py-32 px-8 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-16 mb-24">
            <div className="col-span-2">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 bg-tech-turquoise text-royal-dark rounded-2xl flex items-center justify-center">
                  <HeartPulse size={36} />
                </div>
                <div>
                  <span className="text-4xl font-black tracking-tighter block">MEDLINK</span>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">National Medical Backbone</span>
                </div>
              </div>
              <p className="text-slate-400 text-lg max-w-sm leading-relaxed">
                The most advanced healthcare operating system built for the specific needs of the Algerian medical supply chain.
              </p>
            </div>
            <div>
              <h4 className="text-xs font-black uppercase tracking-[0.3em] text-white mb-10">Ecosystem</h4>
              <ul className="space-y-6 text-slate-400 font-bold">
                <li><Link to="/login" className="hover:text-tech-turquoise transition-colors">Clinical Terminal</Link></li>
                <li><Link to="/login" className="hover:text-tech-turquoise transition-colors">Pharmacy Hub</Link></li>
                <li><Link to="/login" className="hover:text-tech-turquoise transition-colors">Supply Tracking</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-black uppercase tracking-[0.3em] text-white mb-10">Legal</h4>
              <ul className="space-y-6 text-slate-400 font-bold">
                <li><a href="#" className="hover:text-tech-turquoise transition-colors">Data Privacy</a></li>
                <li><a href="#" className="hover:text-tech-turquoise transition-colors">MD-Compliance</a></li>
                <li><a href="#" className="hover:text-tech-turquoise transition-colors">Infrastructure</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-12 border-t border-white/5 flex flex-col md:row justify-between items-center gap-8">
            <p className="text-slate-500 font-medium">© 2026 MedLink Infrastructure. Digital Sovereignty Guaranteed.</p>
            <div className="flex gap-4">
              {['LN', 'X', 'IG'].map(social => (
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

const RoleCard = ({ icon, role, desc, pos, color }) => (
  <motion.div 
    whileHover={{ y: -10, scale: 1.02 }}
    className={`card-premium p-8 ${pos} group cursor-pointer`}
  >
    <div className={`w-14 h-14 rounded-2xl bg-tech-gray dark:bg-white/5 flex items-center justify-center ${color} mb-6 transition-all group-hover:scale-110 shadow-xl`}>
      {React.cloneElement(icon, { size: 30 })}
    </div>
    <h3 className="text-2xl font-black text-royal-dark dark:text-white mb-2">{role}</h3>
    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{desc}</p>
  </motion.div>
);

const RoleDetail = ({ title, items, icon, active = false }) => (
  <div className={`p-10 rounded-[2.5rem] transition-all duration-500 ${active ? 'bg-royal-dark text-white shadow-3xl' : 'bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 hover:border-tech-turquoise/30'}`}>
    <div className={`w-16 h-16 rounded-3xl flex items-center justify-center mb-10 ${active ? 'bg-tech-turquoise text-royal-dark' : 'bg-tech-gray dark:bg-white/5 text-royal-dark dark:text-tech-turquoise'}`}>
      {React.cloneElement(icon, { size: 32 })}
    </div>
    <h3 className="text-3xl font-black mb-8 tracking-tighter">{title}</h3>
    <ul className="space-y-6">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-4 text-lg font-medium">
          <CheckCircle2 size={24} className={active ? 'text-tech-turquoise' : 'text-royal-green'} />
          <span className={active ? 'text-slate-300' : 'text-slate-500 dark:text-slate-400'}>{item}</span>
        </li>
      ))}
    </ul>
  </div>
);

const StatCard = ({ icon, title, desc }) => (
  <div className="glass dark:bg-white/5 p-8 border-slate-100 dark:border-white/10 hover:border-tech-turquoise transition-all">
    <div className="text-tech-turquoise mb-4">
      {React.cloneElement(icon, { size: 28 })}
    </div>
    <h4 className="text-2xl font-black text-royal-dark dark:text-white mb-1 tracking-tight">{title}</h4>
    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{desc}</p>
  </div>
);

export default LandingPage;
