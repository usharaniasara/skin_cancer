import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '../ui/Badge';
import { Layers, TrendingUp, ChevronRight, AlertTriangle, Microscope } from 'lucide-react';

/**
 * Item card for the clinical scan history list.
 * Includes image preview and risk profile.
 */
export function ScanHistoryCard({ scan, index }) {
  const isHighRisk = scan.risk_level === 'High Risk';
  
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }} 
      animate={{ opacity: 1, scale: 1 }} 
      transition={{ delay: index * 0.1 }}
      className="group premium-card bg-slate-900/60 border-white/5 p-10 relative overflow-hidden cursor-pointer"
    >
      <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-[#10b981] to-transparent opacity-0 group-hover:opacity-10 transition-opacity" />
      
      <div className="relative aspect-square rounded-[40px] overflow-hidden mb-12 border border-white/10 shadow-3xl">
        {scan.image_url ? (
          <img 
            src={scan.image_url} 
            alt={`Analysis of ${scan.prediction}`} 
            className="w-full h-full object-cover grayscale brightness-110 group-hover:grayscale-0 group-hover:scale-125 transition-all duration-1000 ease-out" 
          />
        ) : (
          <div className="w-full h-full bg-slate-800 flex items-center justify-center text-slate-600">
            <Microscope className="w-16 h-16" />
          </div>
        )}
        <div className="absolute top-6 right-6 z-20">
          <Badge variant={isHighRisk ? 'danger' : 'success'} className="px-6 py-3 tracking-[0.4em] shadow-nebula">
            {isHighRisk ? 'Clinical Alert' : 'Stable'}
          </Badge>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-3 mb-2">
          <Layers className="w-4 h-4 text-[#10b981] opacity-60" />
          <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em]">Personal Assessment</p>
        </div>
        <h4 className="text-2xl font-black text-white truncate uppercase tracking-tighter group-hover:text-[#10b981] transition-colors leading-none">
          {scan.prediction}
        </h4>
        <div className="flex items-center justify-between pt-8 mt-6 border-t border-white/5">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-3">
            <TrendingUp className={`w-5 h-5 ${isHighRisk ? 'text-[#ec4899]' : 'text-[#10b981]'}`} /> 
            {new Date(scan.created_at).toLocaleDateString()}
          </p>
          <ChevronRight className="w-6 h-6 text-[#10b981] translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500" />
        </div>
      </div>
    </motion.div>
  );
}
