import React from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { motion } from 'framer-motion';
import { Library, AlertCircle, Sun, Activity, Droplets, ArrowLeft, ArrowRight, BookOpen, Microscope, Zap, ChevronRight } from 'lucide-react';

/**
 * EducationView: A resource center for clinicians and patients.
 * Fully transitioned to the 'Clinical Violet' identity with upscaled typography.
 */
export function EducationView({ setActiveView }) {
  const educationalTopics = [
    {
      title: "Lesion Basics",
      description: "Fundamental knowledge on surface spots, moles, and skin textures. Learn to identify typical versus irregular growth patterns.",
      icon: <AlertCircle className="w-8 h-8 text-rose-500" />,
      accentColor: "#f43f5e"
    },
    {
      title: "Photoprotection",
      description: "Understanding the impact of UV radiation on dermal health. Best practices for shielding your skin in high-intensity environments.",
      icon: <Sun className="w-8 h-8 text-amber-500" />,
      accentColor: "#f59e0b"
    },
    {
      title: "How AI Sees Skin",
      description: "A deep dive into how our neural engine analyzes color variances, asymmetrical borders, and texture patterns in your scans.",
      icon: <Activity className="w-8 h-8 text-violet-600" />,
      accentColor: "#7c3aed"
    },
    {
      title: "Hydration & Barrier",
      description: "Maintaining the health of your skin's outer layer. Recognizing the signs of dry patches and benign textural changes.",
      icon: <Droplets className="w-8 h-8 text-violet-400" />,
      accentColor: "#a78bfa"
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="view-container reveal-entry"
    >
      
      {/* Page Navigation Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8 pt-4 border-b border-slate-50 pb-6">
        <div>
           <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-center text-violet-600 shadow-sm">
                 <Library className="w-5 h-5" />
              </div>
              <div>
                 <h3 className="text-[11px] font-black text-violet-600 uppercase tracking-[0.2em]">Resource Library v5.2</h3>
              </div>
           </div>
           <h1 className="text-4xl font-black text-slate-950 uppercase tracking-tighter leading-none mb-2">
             Knowledge <span className="text-violet-600">Base</span>
           </h1>
           <p className="text-sm text-slate-500 font-medium max-w-xl leading-relaxed">
             Access our vetted collection of insights to better understand your self-assessment results and maintain optimal skin wellness.
           </p>
        </div>
        <Button 
          variant="outline" 
          onClick={() => setActiveView('dashboard')} 
          className="px-6 h-12 border-slate-200 text-slate-400 rounded-xl hover:text-violet-600 transition-all font-black uppercase tracking-widest text-[11px] group"
        >
           <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> 
           Home Terminal
        </Button>
      </header>

      <div className="space-y-4">
         {/* Featured Content Intro */}
         <Card className="p-8 premium-card border-violet-100 bg-white shadow-sm flex flex-col md:flex-row items-center gap-8 relative overflow-hidden group rounded-[2.5rem]">
            <div className="w-20 h-20 rounded-2xl bg-violet-100/50 text-violet-600 flex items-center justify-center shrink-0 border border-violet-100 transition-transform group-hover:scale-105">
               <BookOpen className="w-10 h-10" />
            </div>
            <div className="relative z-10">
               <h3 className="text-2xl font-black text-slate-900 tracking-tighter mb-1 uppercase leading-none">Diagnostic Literacy</h3>
               <p className="text-[11px] text-slate-400 leading-relaxed font-bold uppercase tracking-widest">
                 A comprehensive repository for clinician-vetted cutaneous intelligence.
               </p>
            </div>
         </Card>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {educationalTopics.map((topic, index) => (
              <Card 
               key={index} 
               className="p-8 group cursor-pointer premium-card border-slate-100 bg-white hover:border-violet-200 transition-all shadow-sm relative overflow-hidden rounded-3xl"
              >
                <div className="flex items-start gap-6 relative z-10">
                  <div className={`w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100 group-hover:border-violet-100 transition-all`}>
                    {topic.icon}
                  </div>
                  <div className="flex-1">
                     <h3 className="text-xl font-black text-slate-900 tracking-tighter uppercase group-hover:text-violet-600 transition-colors leading-none mb-2">
                       {topic.title}
                     </h3>
                     <p className="text-[11px] font-bold text-slate-400 leading-relaxed mb-6 uppercase tracking-widest opacity-80">
                       {topic.description}
                     </p>
                     <div className="flex items-center justify-between">
                        <span className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-slate-300 group-hover:text-violet-600 transition-colors">
                          Access Protocol <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                        <div 
                         className="w-2.5 h-2.5 rounded-full shadow-sm transition-all" 
                         style={{ backgroundColor: topic.accentColor }} 
                        />
                     </div>
                  </div>
                </div>
              </Card>
            ))}
         </div>

         {/* Technical Reliability Insight */}
         <Card className="p-8 bg-slate-950 border-white/5 shadow-2xl text-white flex flex-col md:flex-row items-center justify-between gap-6 relative group rounded-[2.5rem] overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
               <Microscope className="w-24 h-24 text-violet-400" />
            </div>
            <div className="relative z-10 flex items-center gap-6">
               <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-violet-400 border border-white/5 shadow-inner">
                  <Zap className="w-7 h-7 animate-pulse" />
               </div>
               <div>
                  <h3 className="text-lg font-black uppercase tracking-widest text-white mb-1">Model Accuracy & Integrity</h3>
                  <p className="text-[11px] font-bold text-slate-400 leading-relaxed uppercase tracking-[0.2em]">
                    Our current engine is trained on 70,000+ verified clinical cases to ensure high-confidence screening.
                  </p>
               </div>
            </div>
            <Button variant="white" className="h-12 px-8 !rounded-xl relative z-10">
               Audit Specs
            </Button>
         </Card>
      </div>
    </motion.div>
  );
}
