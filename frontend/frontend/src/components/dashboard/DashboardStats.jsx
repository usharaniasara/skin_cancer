import React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Cpu, Layers } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * Displays the current status and performance of the AI analysis engine.
 * Note: This component renders a bare Card — grid placement is controlled by the parent.
 */
export function DashboardStats({ scans, inferenceLoad }) {
  const totalScans = scans.length;
  const highRiskScans = scans.filter(s => s.risk_level === 'High Risk').length;
  const stability = totalScans > 0 ? Math.round(((totalScans - highRiskScans) / totalScans) * 100) : 100;

  return (
    <Card className="p-10 h-full premium-card border-[#10b981]/20 bg-slate-950/40 relative flex flex-col justify-between overflow-hidden group">
      <div className="absolute -top-32 -right-32 w-80 h-80 bg-[#10b981] blur-[120px] opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none" />
      
      {/* Header */}
      <div className="flex items-center justify-between mb-10 relative z-10">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 bg-white/5 rounded-[22px] flex items-center justify-center text-[#10b981] border border-white/10">
            <Cpu className="w-8 h-8" />
          </div>
          <div>
            <p className="text-[11px] font-black text-[#34d399] uppercase tracking-widest leading-none mb-1">Analysis Core</p>
            <p className="text-lg font-black text-white">Nebula-Engine v5.2</p>
          </div>
        </div>
        <Badge variant="success">Online</Badge>
      </div>
      
      {/* Processing load meter */}
      <div className="flex-1 space-y-10 relative z-10">
        <div>
          <div className="flex justify-between items-end mb-4">
            <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Processing Load</p>
            <p className="text-4xl font-black text-white tabular-nums tracking-tighter">{inferenceLoad.toFixed(1)}%</p>
          </div>
          <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden border border-white/5 p-0.5">
            <motion.div
              animate={{ width: `${inferenceLoad}%` }}
              className="h-full bg-gradient-to-r from-[#10b981] via-[#8b5cf6] to-[#f59e0b] rounded-full shadow-[0_0_20px_rgba(16,185,129,0.6)]"
            />
          </div>
        </div>
        
        {/* Mini stats grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-5 rounded-3xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
            <p className="text-[10px] font-black text-[#10b981] uppercase tracking-widest mb-2">Latency</p>
            <p className="text-2xl font-black text-white">0.2ms</p>
          </div>
          <div className="p-5 rounded-3xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
            <p className="text-[10px] font-black text-[#f59e0b] uppercase tracking-widest mb-2">Stability</p>
            <p className="text-2xl font-black text-white">{stability}%</p>
          </div>
          <div className="p-5 rounded-3xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors col-span-2">
            <p className="text-[10px] font-black text-[#8b5cf6] uppercase tracking-widest mb-2">Total Assessments</p>
            <p className="text-3xl font-black text-white">{totalScans}</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-10 pt-8 border-t border-white/5 relative z-10">
        <div className="flex items-center gap-3">
          <Layers className="w-4 h-4 text-slate-500" />
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">7-Class Diagnostic Model</p>
        </div>
      </div>
    </Card>
  );
}
