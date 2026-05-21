import React from 'react';
import { Card } from '../ui/Card';
import { Terminal } from 'lucide-react';

/**
 * Standard logs used to display real-time background system activity.
 */
export function SystemLogs({ logs }) {
  return (
    <Card className="p-10 h-full premium-card border-white/5 bg-slate-950/20 shadow-premium relative group">
      <div className="flex items-center justify-between mb-10 relative z-10">
        <div className="flex items-center gap-4">
          <Terminal className="w-5 h-5 text-[#8b5cf6]" />
          <h3 className="text-[12px] font-black uppercase tracking-widest text-slate-500">Flux Output</h3>
        </div>
        <div className="w-2.5 h-2.5 rounded-full bg-[#8b5cf6] animate-pulse shadow-[0_0_10px_#8b5cf6]" />
      </div>
      <div className="space-y-6 relative z-10">
        {logs.map(log => (
          <div key={log.id} className="flex items-center justify-between text-[12px] font-bold border-b border-white/5 pb-4">
            <div className="flex items-center gap-4 text-slate-300">
              <div className={`w-2 h-2 rounded-full ${log.type === 'warning' ? 'bg-[#f59e0b]' : 'bg-[#10b981]'}`} />
              {log.msg}
            </div>
            <span className="text-slate-500 text-[11px] font-medium">{log.time}</span>
          </div>
        ))}
      </div>
      <div className="absolute bottom-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-[#8b5cf6]/20 to-transparent" />
    </Card>
  );
}
