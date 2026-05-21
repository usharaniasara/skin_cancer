import React from 'react';
import { motion } from 'framer-motion'; // eslint-disable-line no-unused-vars
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  Shield, 
  Zap, 
  Search, 
  BrainCircuit, 
  ArrowRight,
  ClipboardCheck,
  Stethoscope,
  ChevronRight
} from 'lucide-react';
import { Card } from './Card';
import { Badge } from './Badge';
import { Button } from './Button';

const CLASSES = [
  {
    id: 'melanoma',
    name: 'Melanoma / Nevi',
    description: 'Malignant tumor of melanocytes, representing the most lethal form of skin cancer.',
    presentation: 'Irregular borders, multi-colored pigmentation, and asymmetrical growth.',
    criteria: 'ABCDE Rule: Asymmetry, Border irregularity, Color variegation, Diameter >6mm, Evolving.',
    risk: 'Critical / High Risk',
    color: '#ef4444',
    icon: <AlertTriangle className="w-5 h-5" />,
    is_malignant: true
  },
  {
    id: 'bcc',
    name: 'AK / BCC',
    description: 'Basal Cell Carcinoma and Actinic Keratosis. Sun-induced malignant lesions.',
    presentation: 'AK: Scaly patches. BCC: Pearly nodules with visible telangiectasias.',
    criteria: 'Pearly sheen, non-healing "rodent ulcers", and central crusting.',
    risk: 'High / Precancerous',
    color: '#f97316',
    icon: <Search className="w-5 h-5" />,
    is_malignant: true
  },
  {
    id: 'psoriasis',
    name: 'Psoriasis / Lichen',
    description: 'Immune-mediated inflammatory disorders affecting skin and systemic health.',
    presentation: 'Well-demarcated silvery-scaled plaques on extensor surfaces.',
    criteria: 'Auspitz sign (pinpoint bleeding after scale removal) in Psoriasis.',
    risk: 'Benign / Chronic',
    color: '#06b6d4',
    icon: <Activity className="w-5 h-5" />,
    is_malignant: false
  },
  {
    id: 'seborrheic',
    name: 'Seborrheic Keratosis',
    description: 'Acquired benign epithelial tumors. Highly prevalent in aging populations.',
    presentation: 'Waxy, "stuck-on" appearance. Texture ranges from smooth to verrucous.',
    criteria: 'Sharp demarcation, horn cysts, and absence of malignant network.',
    risk: 'Benign',
    color: '#10b981',
    icon: <CheckCircle className="w-5 h-5" />,
    is_malignant: false
  },
  {
    id: 'eczema',
    name: 'Eczema (Atopic)',
    description: 'Chronic inflammatory skin disease with intense pruritus and dry skin.',
    presentation: 'Erythematous, ill-defined patches with weeping or crusting.',
    criteria: '"The Itch that Rashes". Associated with Asthma and Allergic Rhinitis.',
    risk: 'Inflammatory',
    color: '#7c3aed',
    icon: <Info className="w-5 h-5" />,
    is_malignant: false
  },
  {
    id: 'vascular',
    name: 'Vascular Tumors',
    description: 'Spectrum of lesions derived from blood vessels like angiomas.',
    presentation: 'Bright red to violaceous papules. Often bleeding friable nodules.',
    criteria: 'Diapsopy (blanching under pressure). Absence of pigment network.',
    risk: 'Benign / Reactive',
    color: '#ec4899',
    icon: <Shield className="w-5 h-5" />,
    is_malignant: false
  },
  {
    id: 'urticaria',
    name: 'Urticaria (Hives)',
    description: 'Transient skin reaction involving mast cell degranulation and histamine.',
    presentation: 'Migratory, edematous wheals with surrounding erythema (flare).',
    criteria: 'Lesions typically resolve <24h. Dermographism is often a hallmark.',
    risk: 'Reactive / Acute',
    color: '#3b82f6',
    icon: <Zap className="w-5 h-5" />,
    is_malignant: false
  }
];

export function DiseaseClasses() {
  return (
    <div className="reveal-entry pt-4">
      {/* Search/Filter Bar - High Density UI */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-2 border-b border-slate-50 pb-2">
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-10 h-10 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-center text-violet-600 shadow-sm">
            <BrainCircuit className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900 tracking-tight uppercase leading-none">Diagnostic Hub</h3>
            <p className="text-[11px] font-black text-violet-600 uppercase tracking-widest mt-0.5">Verified Clinical Registry</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-100 shadow-inner">
          <Search className="w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search Pathology Matrix..." 
            className="bg-transparent text-[11px] font-bold text-slate-900 outline-none w-48 placeholder:text-slate-300" 
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
        {CLASSES.map((cls, idx) => (
          <motion.div 
            key={cls.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
          >
            <Card className="h-full premium-card hover:border-violet-500/30 transition-all duration-500 group overflow-hidden bg-white shadow-sm hover:shadow-xl border-slate-100 p-0 flex flex-col">
               {/* Simplified Classification Header */}
               <div className="p-3 border-b border-slate-50">
                  <div className="flex justify-between items-start mb-1.5">
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded tracking-widest uppercase ${cls.risk.includes('High') || cls.risk.includes('Critical') ? 'text-rose-600 bg-rose-50' : 'text-violet-600 bg-violet-50'}`}>
                       {cls.risk}
                    </span>
                    <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                       REF-{cls.id.slice(0, 4)}
                    </span>
                  </div>
                  <h3 className="text-sm font-black text-slate-900 tracking-tight group-hover:text-violet-600 transition-colors uppercase leading-tight">
                    {cls.name}
                  </h3>
               </div>

               {/* Informational Core - High Density */}
               <div className="p-3 flex-1 flex flex-col gap-3">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5 opacity-60">Clinical Profile</p>
                    <p className="text-[11px] text-slate-600 leading-tight font-medium line-clamp-2">
                       {cls.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-1.5">
                    <div className="p-1.5 rounded-lg bg-slate-50 border border-slate-100">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5 opacity-60">Presentation</p>
                      <p className="text-[11px] font-bold text-slate-700 leading-tight">{cls.presentation}</p>
                    </div>
                    <div className="p-1.5 rounded-lg bg-violet-50/50 border border-violet-100/50">
                      <p className="text-[10px] font-black text-violet-600 uppercase tracking-widest mb-0.5 opacity-60">Key Criteria</p>
                       <p className="text-[11px] font-bold text-slate-500 leading-tight line-clamp-2">{cls.criteria}</p>
                    </div>
                  </div>
               </div>
               
               <div className="p-3 mt-auto border-t border-slate-50 flex items-center justify-between">
                  <span className="text-[10px] font-black text-violet-600 uppercase tracking-[0.2em] flex items-center gap-1 group/btn cursor-pointer">
                     Reference Specs <ChevronRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                  </span>
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-violet-300" />
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                  </div>
               </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Standards Bar */}
      <Card className="p-4 bg-white border-slate-100 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm border-dashed transition-all hover:bg-violet-50/10">
         <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-center text-violet-600 shadow-sm">
               <Info className="w-5 h-5" />
            </div>
            <div>
               <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-widest mb-0.5">Clinical Standards Matrix</h4>
               <p className="text-[10px] text-slate-500 font-medium leading-none">All benchmarks verified against international ISIC dermatological standards.</p>
            </div>
         </div>
         <Button 
           variant="outline" 
           className="h-10 px-6 rounded-xl text-[11px] font-black uppercase tracking-widest border-slate-200 bg-white text-slate-400 hover:text-violet-600 hover:border-violet-200 transition-all font-black"
           onClick={() => window.open('https://www.isic-archive.com/', '_blank')}
         >
           Access ISIC Data Repository
         </Button>
      </Card>
    </div>
  );
}
