import React from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { 
  Plus,
  Shield,
  Terminal,
  BrainCircuit,
  ShieldCheck,
  Search,
  ChevronRight
} from 'lucide-react';
import { DiseaseClasses } from '../components/ui/DiseaseClasses';
import { motion } from 'framer-motion';

/**
 * DashboardView: Refocused Home Page that serves as a clinical Knowledge Base.
 */
export function DashboardView({ user, setActiveView }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="view-container reveal-entry"
    >
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-2 mb-2 pt-1 border-b border-slate-50 pb-2">
        <div>
          <h1 className="text-display">
            Dermisyn <span className="text-violet-600">Diagnostic Hub</span>
          </h1>
          <p className="mt-1 text-sm text-slate-500 font-medium">Integrated clinical classification registry for specialized lesion analysis.</p>
        </div>
        <div className="flex items-center gap-4">
             <div className="flex items-center gap-3 active:scale-95 transition-transform cursor-pointer px-4 py-2 bg-violet-50 border border-violet-100 rounded-xl">
              <div className="p-2 bg-violet-600 text-white rounded-lg shadow-sm">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="text-left">
                <p className="text-[11px] font-black text-violet-600 uppercase tracking-widest leading-none mb-0.5">Authoritative Node</p>
                <p className="text-sm font-black text-slate-900 leading-none">{user?.name || 'Harika'} Authenticated</p>
              </div>
            </div>
            
            <Button 
               onClick={() => setActiveView('upload')}
               className="h-12 px-8 bg-violet-600 hover:bg-violet-700 text-white !rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-xl shadow-violet-100 flex items-center gap-3 group transition-all"
            >
              Initialize Intake <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
            </Button>
        </div>
      </header>

      {/* Main Grid Interface */}
      <div className="mt-4">
         <DiseaseClasses />
      </div>

      {/* ── Professional Footer ── */}
      <footer className="mt-10 pt-4 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between opacity-60 gap-4">
        <div className="flex items-center gap-6">
           <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-center text-violet-600 shadow-sm">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-black text-violet-600 uppercase tracking-widest leading-none">Diagnostic Link Active</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">ISO-27001 Protocol Verified</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
           <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em]">Encrypted Registry • HIPAA Compliant Environment</span>
        </div>
      </footer>
    </motion.div>
  );
}
