import React from 'react';
import { Card } from './Card';
import { Button } from './Button';
import { X, ShieldAlert, FileText, Scale } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * LegalModal: Displays standardized medical disclaimers and terms of service.
 * Ensures users understand the AI assessment is NOT a medical diagnosis.
 */
export function LegalModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[120] flex items-center justify-center p-8">
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="absolute inset-0 bg-slate-950/60 backdrop-blur-3xl" onClick={onClose} 
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 30 }} 
          animate={{ opacity: 1, scale: 1, y: 0 }} 
          exit={{ opacity: 0, scale: 0.95, y: 30 }}
          className="w-full max-w-3xl relative z-20"
        >
          <Card className="p-16 premium-card border-white/10 bg-slate-950/40 shadow-3xl overflow-hidden iridescent-border">
            <div className="flex items-center justify-between mb-16">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-[28px] bg-gradient-to-br from-[#8b5cf6] to-[#ec4899] flex items-center justify-center text-white">
                  <Scale className="w-9 h-9" />
                </div>
                <div>
                  <h3 className="text-4xl font-black text-white tracking-tighter uppercase leading-none mb-2">Legal Protocol</h3>
                  <p className="text-label text-slate-500">Regulatory standards & usage disclosure</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose} className="rounded-2xl hover:bg-white/5"><X className="w-8 h-8" /></Button>
            </div>

            <div className="space-y-12 max-h-[400px] overflow-y-auto pr-8 scrollbar-hide">
               <LegalSection 
                  icon={ShieldAlert} 
                  title="Medical Disclaimer" 
                  content="The Dermisyn-Patient AI engine provides preliminary skin assessments and informational feedback based on visual patterns. This service does NOT constitute a formal medical diagnosis, prognosis, or treatment plan. Always seek the advice of a board-certified dermatologist for clinical confirmation." 
               />
               <LegalSection 
                  icon={FileText} 
                  title="Data Privacy & Processing" 
                  content="Your images are processed securely using a clinical-grade neural matrix. Metadata is localized to your personal node. We do not sell or share personal identifiers with third-party advertising entities." 
               />
               <LegalSection 
                  icon={Scale} 
                  title="Usage Agreement" 
                  content="By utilizing this platform, you acknowledge the limitations of AI-assisted screening. The system is designed for high-confidence identification but is subject to visual variance and technical constraints." 
               />
            </div>

            <div className="mt-20 pt-10 border-t border-white/5 flex flex-col md:flex-row gap-8 items-center justify-between">
               <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest text-center md:text-left">
                  Last Updated: Q3 2024 • Dermisyn Regulatory Team
               </p>
               <Button variant="primary" size="lg" onClick={onClose} className="px-16 h-20 !rounded-[32px] shadow-premium uppercase font-black text-sm">
                  I Acknowledge
               </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

function LegalSection({ icon: Icon, title, content }) {
  return (
    <div className="space-y-6">
       <div className="flex items-center gap-4 text-[#ec4899]">
          <Icon className="w-6 h-6" />
          <h4 className="text-lg font-black uppercase tracking-widest leading-none">{title}</h4>
       </div>
       <p className="text-sm font-bold text-slate-400 leading-relaxed uppercase tracking-widest leading-loose">
          {content}
       </p>
    </div>
  );
}
