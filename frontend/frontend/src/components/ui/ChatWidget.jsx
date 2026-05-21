import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, User, Sparkles, Zap, Shield, Microscope, Stethoscope } from 'lucide-react';
import { Button } from './Button';

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, role: 'assistant', content: "Dermisyn Clinical Assistant active. How can I assist with specimen classification or protocol verification?", timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
  ]);

  const handleSend = () => {
    if (!input.trim()) return;
    
    const userMsg = { id: Date.now(), role: 'user', content: input, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    // Simulated AI Response
    setTimeout(() => {
      const aiMsg = { id: Date.now() + 1, role: 'assistant', content: "Query acknowledged. Localizing clinical markers to ISIC standards... The requested protocol is currently being synchronized with the registry.", timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
      setMessages(prev => [...prev, aiMsg]);
    }, 1000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      <AnimatePresence>
        {!isOpen ? (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="w-14 h-14 rounded-2xl bg-violet-600 text-white shadow-premium flex items-center justify-center relative group overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-violet-400 to-violet-600 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10 flex flex-col items-center">
              <MessageSquare className="w-6 h-6 mb-0.5" />
              <span className="text-[10px] font-black uppercase tracking-tighter">AI Assistant</span>
            </div>
          </motion.button>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 40 }}
            className="w-[380px] h-[580px] bg-white rounded-[2rem] shadow-2xl border border-violet-100 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 bg-violet-600 text-white flex items-center justify-between shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Microscope className="w-16 h-16" />
              </div>
              <div className="flex items-center gap-3 relative z-10">
                <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-black uppercase tracking-tight leading-none mb-1">Dermisyn Assistant</h3>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-violet-300 animate-pulse" />
                    <span className="text-[11px] font-bold text-violet-100 uppercase tracking-widest leading-none">Diagnostic Link Active</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center transition-colors relative z-10">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide bg-slate-50/50">
              {messages.map((msg) => (
                <div key={msg.id} className="flex flex-col">
                  <div className={`p-3 rounded-2xl max-w-[85%] text-sm font-medium shadow-sm transition-all ${
                    msg.role === 'user' 
                    ? 'bg-violet-600 text-white ml-auto rounded-tr-none' 
                    : 'bg-white text-slate-800 mr-auto rounded-tl-none border border-violet-100'
                  }`}>
                    <p className="leading-relaxed">{msg.content}</p>
                  </div>
                  <p className={`text-[10px] font-black uppercase tracking-widest text-slate-300 mt-1.5 ${msg.role === 'user' ? 'text-right mr-1' : 'ml-1'}`}>
                    {msg.role === 'user' ? 'Clinician' : 'Dermisyn AI'} • {msg.timestamp}
                  </p>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t border-slate-50">
               <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center gap-2">
                     <Zap className="w-3.5 h-3.5 text-violet-600" />
                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Secure Link Active</span>
                  </div>
                  <div className="w-px h-2.5 bg-slate-200" />
                  <div className="flex items-center gap-2 text-slate-400">
                     <Shield className="w-3.5 h-3.5 text-violet-400" />
                     <span className="text-[10px] font-black uppercase tracking-widest">End-to-End Encryption</span>
                  </div>
               </div>
               <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Protocol query..."
                  className="flex-1 h-12 bg-slate-50 border border-slate-100 rounded-xl px-4 text-sm font-medium focus:outline-none focus:border-violet-600 transition-all"
                  onKeyDown={e => e.key === 'Enter' && handleSend()}
                />
                <button 
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className="w-12 h-12 bg-violet-600 hover:bg-violet-700 disabled:bg-slate-200 text-white rounded-xl flex items-center justify-center shadow-premium transition-all active:scale-95"
                >
                  <Send className="w-5 h-5" />
                </button>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
