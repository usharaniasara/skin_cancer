import React, { useState, useEffect } from 'react';
import { Card } from './Card';
import { Cpu, Activity, Database, Network } from 'lucide-react';

export function SystemStatusWidget() {
  const [latency, setLatency] = useState(14.2);

  useEffect(() => {
    const interval = setInterval(() => {
      setLatency(prev => Math.max(12, Math.min(22, prev + (Math.random() * 2 - 1))));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="p-6 h-full flex flex-col justify-between group relative overflow-hidden bg-white border border-slate-200 shadow-sm transition-all hover:shadow-md">
      {/* Subtle Medical Grid Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1.5px)] [background-size:20px_20px] opacity-30 pointer-events-none" />
      
      <div className="flex justify-between items-start relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-center text-violet-600 shadow-sm">
            <Cpu className="w-5 h-5" strokeWidth={2.5} />
          </div>
          <div>
            <h3 className="text-slate-800 font-bold text-sm tracking-wide">Diagnostic Core</h3>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-violet-500 animate-pulse shadow-[0_0_8px_rgba(124,58,237,0.3)]" />
              <span className="text-[11px] font-black text-violet-600 uppercase tracking-widest">Clinical Active</span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-black text-slate-900 tabular-nums tracking-tighter leading-none">{latency.toFixed(1)}<span className="text-xs text-violet-600 font-bold ml-1 uppercase">ms</span></p>
          <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mt-1">Inference Latency</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mt-6 relative z-10">
        <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 shadow-sm group-hover:bg-white transition-colors">
          <Activity className="w-4 h-4 text-rose-500 mb-2" />
          <p className="text-slate-800 font-black text-[13px] leading-none">99.9%</p>
          <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mt-1">Uptime</p>
        </div>
        <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 shadow-sm group-hover:bg-white transition-colors">
          <Database className="w-4 h-4 text-violet-500 mb-2" />
          <p className="text-slate-800 font-black text-[13px] leading-none">27.5M</p>
          <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mt-1">Params</p>
        </div>
        <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 shadow-sm group-hover:bg-white transition-colors">
          <Network className="w-4 h-4 text-violet-400 mb-2" />
          <p className="text-slate-800 font-black text-[13px] leading-none">8 Nodes</p>
          <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mt-1">Cluster</p>
        </div>
      </div>
    </Card>
  );
}

