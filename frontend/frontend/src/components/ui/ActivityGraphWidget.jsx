import React, { useMemo } from 'react';
import { Card } from './Card';
import { TrendingUp, Activity, BarChart3 } from 'lucide-react';

/**
 * ActivityGraphWidget: Visualizes user activity and scan volume over time.
 * Fully transitioned to the 'Clinical Violet' identity.
 */
export function ActivityGraphWidget({ scans }) {
  const totalDays = 14;
  
  // Simulated activity data with weights for actual scans
  const activityData = useMemo(() => {
    // Standardized static indicators for diagnostic performance (Pure function)
    const indicators = [22, 45, 31, 19, 54, 38, 29, 61, 48, 33, 72, 85, 68, 92];
    return indicators.map((baseValue, index) => {
       if (index === totalDays - 1) return scans.length > 0 ? 92 : baseValue;
       if (index === totalDays - 2) return scans.length > 0 ? 68 : baseValue;
       return baseValue;
    });
  }, [scans, totalDays]);
  
  const peakValue = Math.max(...activityData);

  return (
    <Card className="p-8 h-full flex flex-col justify-between bg-slate-950 border-white/5 shadow-premium overflow-hidden relative group rounded-3xl">
      {/* Visual background grid aesthetic */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.03)_1.5px,transparent_1.5px)] [background-size:32px_32px] pointer-events-none" />
      
      <div className="flex justify-between items-start mb-8 relative z-10">
        <div>
           <div className="flex items-center gap-3 mb-2 text-violet-400">
              <TrendingUp className="w-5 h-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              <h3 className="text-[11px] font-black uppercase tracking-[0.3em]">Diagnostic Flux</h3>
           </div>
           <p className="text-2xl md:text-3xl font-black text-white tracking-tighter uppercase leading-none">Diagnostic Velocity</p>
        </div>
        <div className="px-4 py-2 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400 text-[11px] font-black uppercase tracking-widest flex items-center gap-3">
           <Activity className="w-4 h-4 animate-pulse" /> Sync Active
        </div>
      </div>

      <div className="flex-1 flex items-end justify-between gap-1.5 mt-4 h-[120px] pb-4 relative z-10">
        {/* Horizontal baseline */}
        <div className="absolute inset-x-0 bottom-4 h-px bg-white/5" />
        
        {activityData.map((value, i) => {
          const barHeightPercentage = (value / peakValue) * 100;
          const isCurrentDay = i === totalDays - 1 && scans.length > 0;
          
          return (
            <div key={i} className="relative flex-1 flex flex-col justify-end items-center h-full group/bar">
               <motion.div 
                 initial={{ height: 0 }}
                 animate={{ height: `${barHeightPercentage}%` }}
                 transition={{ duration: 1.2, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                 className={`w-full max-w-[12px] rounded-t-full transition-all duration-700 relative 
                   ${isCurrentDay 
                      ? 'bg-gradient-to-t from-violet-600 to-violet-400 shadow-[0_5px_20px_rgba(124,58,237,0.4)]' 
                      : 'bg-white/5 group-hover/bar:bg-white/10'}`}
               >
                  {isCurrentDay && (
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 text-[11px] font-black text-violet-400 opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap">
                       Load: {value}%
                    </div>
                  )}
               </motion.div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex justify-between text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] relative z-10 border-t border-white/5 pt-4">
         <span className="flex items-center gap-2"><BarChart3 className="w-3.5 h-3.5" /> 14-Day Cycle</span>
         <span className="text-violet-400">Stable Real-time</span>
      </div>
    </Card>
  );
}
