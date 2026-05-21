import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion'; // eslint-disable-line no-unused-vars
import { 
  Database, 
  Microscope, 
  Calendar, 
  Target, 
  Search, 
  ArrowLeft, 
  Filter, 
  X, 
  Stethoscope, 
  Info,
  ShieldAlert,
  HeartPulse,
  Zap,
  Check,
  FileText
} from 'lucide-react';

export function RecordsView({ scans, setActiveView }) {
  const [selectedScan, setSelectedScan] = useState(null);
  const assessmentHistory = [...scans].reverse();

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="view-container reveal-entry">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-2 mb-2 pt-1 border-b border-slate-50 pb-2">
        <div>
          <button 
            onClick={() => setActiveView('dashboard')} 
            className="flex items-center gap-2 text-violet-600 hover:text-violet-700 font-bold mb-2 transition-all text-[11px] uppercase tracking-widest group"
          >
            <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" /> 
            Back to Hub
          </button>
          <h1 className="text-display">
            Clinical <span className="text-violet-600">Records</span>
          </h1>
          <p className="mt-1 text-sm text-slate-500 font-medium">Permanent diagnostic registry and EMR synchronization hub.</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-violet-50/50 border border-violet-100">
          <div className="w-1 h-1 rounded-full bg-violet-500 animate-pulse" />
          <span className="text-[11px] font-black text-violet-700 uppercase tracking-widest">Encrypted Registry Active</span>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
        <div className="lg:col-span-12">
          <Card className="p-4 md:p-6 premium-card border-violet-100 bg-white shadow-sm min-h-[500px] flex flex-col">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-50">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-center text-violet-600 shadow-sm">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 tracking-tight uppercase">Assessment Archive</h3>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Complete Clinical Record</p>
                </div>
              </div>
              <div className="flex items-center gap-3 px-4 py-2 bg-violet-50 border border-violet-100 rounded-xl">
                <Zap className="w-4 h-4 text-violet-600" />
                <div className="text-left">
                  <p className="text-[11px] font-black text-violet-600 uppercase tracking-widest leading-none mb-0.5">Registry Load</p>
                  <p className="text-xs font-black text-slate-900 leading-none">{scans.length} Verified Entries</p>
                </div>
              </div>
            </div>

            {assessmentHistory.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
                {assessmentHistory.map((scan, i) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ delay: i * 0.05 }}
                    key={scan.id} 
                    onClick={() => setSelectedScan(scan)}
                    className="group premium-card bg-white hover:bg-violet-50/10 border-slate-100 hover:border-violet-300 p-3 transition-all duration-300 cursor-pointer shadow-sm"
                  >
                    <div className="aspect-square rounded-lg bg-slate-50 overflow-hidden border border-slate-100 mb-3 group-hover:scale-[1.02] transition-transform duration-500 relative">
                      {scan.image_url ? (
                        <img src={scan.image_url} alt="registry entry" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center"><Microscope className="w-6 h-6 text-slate-200" /></div>
                      )}
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex-1 flex flex-col justify-center">
                        <p className="text-[11px] font-black text-violet-600 uppercase tracking-widest leading-none mb-1">Diagnosed ID: {scan.id.toString().slice(-6)}</p>
                        <h3 className="text-base font-black text-slate-900 uppercase tracking-tight leading-none mb-1">{scan.prediction}</h3>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest leading-none">{scan.location} • {new Date(scan.created_at).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <div className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-widest mb-1 ${scan.is_malignant ? 'bg-rose-50 text-rose-600 border border-rose-100' : 'bg-slate-50 text-slate-500 border border-slate-100'}`}>
                          {scan.is_malignant ? 'High Priority' : 'Routine'}
                        </div>
                        <p className="text-sm font-black text-slate-900 leading-none">{scan.confidence}%</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center py-32 border-2 border-dashed border-slate-100 rounded-[40px]">
                <Database className="w-20 h-20 text-slate-100 mb-6" />
                <h4 className="text-slate-400 font-bold text-lg uppercase tracking-widest">Registry Empty</h4>
              </div>
            )}
          </Card>
        </div>
      </div>

      <AnimatePresence>
        {selectedScan && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 pointer-events-none">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/40 backdrop-blur-md pointer-events-auto"
              onClick={() => setSelectedScan(null)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-4xl bg-white rounded-[2rem] shadow-2xl relative overflow-hidden pointer-events-auto border border-white"
            >
              <div className="max-h-[90vh] overflow-y-auto scrollbar-hide">
                <button 
                   onClick={() => setSelectedScan(null)}
                   className="absolute top-6 right-6 w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition-all z-20"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="p-6 md:p-8">
                   <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pb-6 border-b border-slate-50">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${selectedScan.is_malignant ? 'bg-rose-100 text-rose-600' : 'bg-violet-100 text-violet-600'}`}>
                          {selectedScan.is_malignant ? <ShieldAlert className="w-5 h-5"/> : <Check className="w-5 h-5"/>}
                        </div>
                        <div>
                          <Badge className={`mb-1 text-[10px] font-black uppercase tracking-widest ${selectedScan.is_malignant ? 'bg-rose-50 text-rose-600' : 'bg-violet-50 text-violet-600'}`}>
                            {selectedScan.is_malignant ? 'Malignancy Confirmed' : 'Diagnostic Resolution Verified'}
                          </Badge>
                          <h2 className="text-xl font-black text-slate-950 uppercase tracking-tight leading-none">{selectedScan.prediction}</h2>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">Diagnostic Accuracy</p>
                        <div className="text-3xl font-black text-slate-900 tracking-tighter">{selectedScan.confidence}<span className="text-lg text-violet-600">%</span></div>
                      </div>
                   </div>

                   <div className="space-y-3 mb-6">
                        <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wide pb-2 border-b border-white hover:border-violet-100 transition-colors">
                          <span className="text-slate-500">Registry Reference</span>
                          <span className="text-violet-600">REF-{selectedScan.id.toString().slice(-8)}</span>
                        </div>
                        <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wide pb-2 border-b border-white hover:border-violet-100 transition-colors">
                          <span className="text-slate-500">Anatomical Localization</span>
                          <span className="text-violet-600">{selectedScan.location}</span>
                        </div>
                        <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wide">
                          <span className="text-slate-500">Clinical Timestamp</span>
                          <span className="text-violet-600">{new Date(selectedScan.created_at).toLocaleString()}</span>
                        </div>
                   </div>

                   <div className={`rounded-2xl p-6 relative overflow-hidden ${selectedScan.is_malignant ? 'bg-rose-50/40 border border-rose-100' : 'bg-violet-50/40 border border-violet-100'}`}>
                      <div className="absolute top-0 right-0 p-6 opacity-[0.03] pointer-events-none">
                         <Stethoscope className="w-32 h-32 text-slate-900" />
                      </div>
                      
                      <div className="relative z-10">
                         <div className="flex items-center gap-2 mb-4">
                            {selectedScan.is_malignant ? <ShieldAlert className="w-5 h-5 text-rose-600" /> : <HeartPulse className="w-5 h-5 text-violet-600" />}
                            <h4 className={`text-[11px] font-black uppercase tracking-[0.2em] underline underline-offset-4 ${selectedScan.is_malignant ? 'text-rose-700 decoration-rose-200' : 'text-violet-700 decoration-violet-200'}`}>
                                Registry Clinical Observations
                            </h4>
                         </div>
                         <p className="text-slate-700 text-sm leading-relaxed font-medium">
                            Historical entry for <span className="text-slate-950 font-bold uppercase">{selectedScan.location}</span>. 
                            Automated pipeline classification: <span className={`${selectedScan.is_malignant ? 'text-rose-700' : 'text-violet-700'} font-extrabold uppercase`}>{selectedScan.prediction}</span> (CI: <span className={`${selectedScan.is_malignant ? 'text-rose-700' : 'text-violet-700'} font-black`}>{selectedScan.confidence}%</span>).
                            
                            <span className="block mt-2">
                                {selectedScan.is_malignant ? (
                                    "Specimen was flagged with malignancy presentation. Clinical priority was assigned to verify diagnostic markers."
                                ) : (
                                    "Clinical findings indicate a non-malignant condition. AI cross-referenced this presentation with standard benign distributions."
                                )}
                            </span>
                         </p>
                      </div>
                   </div>

                    <div className="mt-8 flex justify-end gap-2 pt-6 border-t border-slate-50">
                       <Button variant="outline" className="h-10 px-6 rounded-lg border-slate-100 text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-violet-600 hover:border-violet-100 transition-all">
                         Sync Entry
                       </Button>
                       <Button className={`h-10 px-6 rounded-lg text-[11px] font-black uppercase tracking-widest shadow-xl transition-all ${selectedScan.is_malignant ? 'bg-slate-900 text-white' : 'bg-violet-600 text-white hover:bg-violet-700 shadow-violet-50'}`}>
                         Download PDF
                       </Button>
                    </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
