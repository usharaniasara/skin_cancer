import React from 'react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { motion } from 'framer-motion';
import { User, LogOut, Shield, Mail, Calendar, Settings, Database, Microscope, Target, ArrowLeft, Lock, Sparkles, ChevronRight } from 'lucide-react';

/**
 * ProfileView: Comprehensive user dashboard for identity and assessment history.
 * Fully transitioned to the 'Clinical Violet' identity with upscaled typography.
 */
export function ProfileView({ user, scans, onLogout, onOpenSettings, setActiveView }) {
  // Sort scans by date descending for history list
  const assessmentHistory = [...scans].reverse();

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="view-container reveal-entry">
      
      {/* Header with Navigation */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-6 pt-4 border-b border-slate-50 pb-6">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-[2rem] bg-violet-600 flex items-center justify-center text-white text-3xl font-black shadow-premium">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="primary" className="px-3 py-1 text-[11px] font-black uppercase tracking-widest leading-none">Verified Clinician</Badge>
              <div className="flex items-center gap-1.5 px-3 py-1 bg-violet-50 rounded-full border border-violet-100">
                <div className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse" />
                <span className="text-[11px] font-black text-violet-600 uppercase tracking-widest leading-none">Security Active</span>
              </div>
            </div>
            <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter leading-none">{user?.name || 'Practitioner'}</h2>
            <p className="mt-2 text-sm font-medium text-slate-500 uppercase tracking-widest">Authorized Clinical Lead • Dermatology</p>
          </div>
        </div>
        <Button 
          variant="outline" 
          onClick={() => setActiveView('dashboard')} 
          className="px-6 h-12 shadow-sm group !rounded-xl text-[11px] font-black uppercase tracking-widest"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> 
          Home Terminal
        </Button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 auto-rows-min">
         
        {/* Core Identity Module */}
        <div className="lg:col-span-8">
          <Card className="p-8 h-full flex items-center gap-10 premium-card border-violet-100 bg-white shadow-sm relative group overflow-hidden rounded-[2.5rem]">
            <div className="absolute -top-32 -right-32 w-80 h-80 bg-violet-100 blur-[120px] opacity-20 group-hover:opacity-30 transition-opacity" />
            <div className="w-24 h-24 rounded-[2.5rem] bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center text-white text-4xl font-black shadow-premium relative z-10 transition-transform group-hover:scale-105">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="flex-1 relative z-10">
              <div className="flex items-center gap-2 mb-3 text-violet-600">
                <Shield className="w-5 h-5" />
                <h3 className="text-[11px] font-black uppercase tracking-[0.3em]">Verified Diagnostic Node</h3>
              </div>
              <h2 className="text-4xl font-black text-slate-950 tracking-tighter mb-4 leading-none uppercase">
                {user?.name || 'Clinician Admin'}
              </h2>
              <div className="flex flex-wrap items-center gap-3">
                <span className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                  <Mail className="w-4 h-4 text-violet-600" /> {user?.email}
                </span>
                <span className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                  <Calendar className="w-4 h-4 text-rose-400" /> Active Registry
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* Global Controls */}
        <div className="lg:col-span-4">
          <Card className="p-8 premium-card border-slate-200 bg-slate-50/20 h-full flex flex-col justify-between shadow-sm relative group rounded-[2.5rem]">
            <div className="flex items-center justify-between mb-6 relative z-10">
              <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-400">Flux Management</h3>
              <div className="w-2.5 h-2.5 rounded-full bg-violet-600 shadow-[0_0_10px_rgba(124,58,237,0.3)] animate-pulse"></div>
            </div>
            <div className="space-y-3 relative z-10">
              <Button variant="white" className="w-full justify-between h-14 !rounded-2xl group border-slate-200 text-slate-900" onClick={onOpenSettings}>
                <span className="text-[11px] font-black uppercase tracking-widest">Security Settings</span>
                <Settings className="w-5 h-5 group-hover:rotate-90 transition-transform" />
              </Button>
              <Button variant="danger" className="w-full justify-between h-14 !rounded-2xl group shadow-lg" onClick={onLogout}>
                <span className="text-[11px] font-black uppercase tracking-widest">Logout Session</span>
                <LogOut className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </Card>
        </div>

        {/* History Archive Table/List */}
        <div className="lg:col-span-12">
          <Card className="p-10 premium-card bg-white border-slate-100 flex flex-col shadow-sm rounded-[3rem]">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10 pb-8 border-b border-slate-50">
               <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center border border-violet-100 shadow-sm shrink-0">
                    <Database className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-black text-slate-950 tracking-tighter uppercase leading-none mb-1">Diagnostic History</h3>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.3em]">Authorized Registry Archive</p>
                  </div>
               </div>
              <div className="flex items-center gap-6 bg-slate-50 px-8 py-5 rounded-[2rem] border border-slate-100 shadow-inner">
                <div className="text-right">
                  <p className="text-5xl font-black text-violet-600 tracking-tighter leading-none tabular-nums">{scans.length}</p>
                  <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mt-1.5 leading-none">Scans Processed</p>
                </div>
                <div className="w-px h-10 bg-slate-200" />
                <div className="w-12 h-12 bg-white rounded-xl text-rose-500 border border-slate-100 flex items-center justify-center shadow-sm">
                  <Lock className="w-6 h-6" />
                </div>
              </div>
            </div>

            {assessmentHistory.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {assessmentHistory.map((scan, i) => (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }} 
                    animate={{ opacity: 1, scale: 1 }} 
                    transition={{ delay: i * 0.03 }}
                    key={scan.id} 
                    className="group relative premium-card bg-slate-50/50 hover:bg-white border-slate-100 hover:border-violet-200 p-5 transition-all duration-300 cursor-pointer overflow-hidden shadow-sm hover:shadow-xl rounded-3xl"
                  >
                    <div className="flex items-center gap-4 mb-5">
                      <div className="w-14 h-14 rounded-xl bg-white overflow-hidden border border-slate-100 shadow-sm shrink-0 group-hover:scale-105 transition-transform">
                        {scan.image_url ? (
                          <img src={scan.image_url} alt="registry entry" className="w-full h-full object-cover transition-all duration-500" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-slate-50"><Microscope className="w-5 h-5 text-slate-200" /></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1 opacity-70">Pathology</p>
                        <h4 className="text-[11px] font-black text-slate-900 truncate uppercase tracking-tight group-hover:text-violet-600 transition-colors leading-none">
                          {scan.prediction}
                        </h4>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-4 pt-4 border-t border-slate-100">
                      <div className="flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-violet-400"/> {new Date(scan.created_at).toLocaleDateString()}</span>
                        <span className="flex items-center gap-1.5"><Target className="w-3.5 h-3.5 text-rose-300"/> {scan.location}</span>
                      </div>
                      <Badge variant={scan.risk_level === 'High Risk' ? 'danger' : 'success'} className="w-full py-2 shadow-sm uppercase font-black tracking-[0.2em] text-[10px]">
                        {scan.risk_level === 'High Risk' ? 'Follow-up Suggested' : 'Stable Case'}
                      </Badge>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center py-20 border-2 border-dashed border-slate-100 rounded-[3rem] bg-slate-50/30">
                <Database className="w-16 h-16 text-slate-100 mb-6" />
                <h4 className="text-slate-400 font-black text-base uppercase tracking-[0.4em] mb-8">Registry Empty</h4>
                <Button onClick={() => setActiveView('upload')} className="px-10 h-14 !rounded-2xl shadow-2xl bg-violet-600 text-white text-[11px] font-black uppercase tracking-widest hover:bg-violet-700 transition-all">Initialize Analysis</Button>
              </div>
            )}
          </Card>
        </div>

      </div>
      <footer className="mt-12 pt-6 border-t border-slate-100 flex items-center justify-between opacity-50 mb-10">
        <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em]">Audit Validated Node DS-PROFILE • Registry 5.2.1</p>
        <div className="flex gap-2">
           <div className="w-1.5 h-1.5 rounded-full bg-violet-500" />
           <div className="w-1.5 h-1.5 rounded-full bg-violet-500" />
           <div className="w-1.5 h-1.5 rounded-full bg-violet-500" />
        </div>
      </footer>
    </motion.div>
  );
}
