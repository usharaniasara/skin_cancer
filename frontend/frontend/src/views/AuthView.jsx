import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Fingerprint, ShieldAlert, Cpu, Sparkles, Globe, User as UserIcon, ChevronRight } from 'lucide-react';

/**
 * AuthView: Handles user registration and login.
 * Transitioned to 'Clinical Violet' identity with professional light-mode aesthetic.
 */
export function AuthView({ setAuthToken }) {
  // --- UI View State ---
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- Form Input State ---
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  /**
   * Submit the authentication form to the backend API.
   */
  const handleAuthSubmit = async (event) => {
    event.preventDefault();
    if (!formData.email || !formData.password || (!isLoginMode && !formData.name)) {
      setErrorMessage('Please provide all clinical credentials.');
      return;
    }

    setErrorMessage('');
    setIsSubmitting(true);
    const endpoint = isLoginMode ? '/api/login' : '/api/register';
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      if (response.ok) {
        setAuthToken(data.token);
      } else {
        setErrorMessage(data.error || 'Authentication failed. Verify credentials.');
      }
    } catch (error) {
      setErrorMessage('Network error. Unable to connect to diagnostic registry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50 relative overflow-hidden">
      {/* Background Decor - Clinical Violet Theme */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(124,58,237,0.05),transparent_70%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(124,58,237,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(124,58,237,0.02)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20 pointer-events-none" />
      
      <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-lg relative z-10">
        
        <div className="flex justify-center mb-10">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-violet-600 flex items-center justify-center text-white shadow-premium">
              <Sparkles className="w-8 h-8" />
            </div>
            <div className="text-center">
              <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase mb-1">
                Dermisyn <span className="text-violet-600">Portal</span>
              </h1>
              <div className="flex items-center justify-center gap-2">
                <div className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest leading-none">Diagnostic Sync v5.2 Active</p>
              </div>
            </div>
          </div>
        </div>

        <Card className="p-10 premium-card border-violet-100 bg-white shadow-2xl relative rounded-[2.5rem] overflow-hidden">
          <div className="text-center mb-12">
            <h2 className="text-xl font-black text-slate-900 tracking-tighter uppercase mb-2">
              {isLoginMode ? 'Clinician Entry' : 'Clinical Registration'}
            </h2>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] px-10 leading-relaxed">
              Authorized diagnostic synchronization only.
            </p>
          </div>

          <form onSubmit={handleAuthSubmit} className="space-y-6">
            <AnimatePresence mode="wait">
              {!isLoginMode && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }} 
                  animate={{ opacity: 1, height: 'auto' }} 
                  exit={{ opacity: 0, height: 0 }}
                  className="group/field overflow-hidden"
                >
                  <label className="text-[11px] font-black uppercase tracking-widest ml-1 mb-3 block text-slate-400 group-focus-within/field:text-violet-600 transition-colors">Identification</label>
                  <div className="relative">
                    <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within/field:text-violet-600 transition-colors" />
                    <input 
                      type="text" 
                      placeholder="Practitioner Full Name"
                      className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl px-12 font-bold text-sm text-slate-900 focus:outline-none focus:border-violet-600 focus:bg-white transition-all shadow-inner"
                      value={formData.name} onChange={e => handleInputChange('name', e.target.value)}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            <div className="group/field">
              <label className="text-[11px] font-black uppercase tracking-widest ml-1 mb-3 block text-slate-400 group-focus-within/field:text-violet-600 transition-colors">Email Registry</label>
              <div className="relative">
                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within/field:text-violet-600 transition-colors" />
                <input 
                  type="email" 
                  placeholder="clinician@dermisyn.ai"
                  className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl px-12 font-bold text-sm text-slate-900 focus:outline-none focus:border-violet-600 focus:bg-white transition-all shadow-inner"
                  value={formData.email} onChange={e => handleInputChange('email', e.target.value)}
                />
              </div>
            </div>
            
            <div className="group/field">
              <label className="text-[11px] font-black uppercase tracking-widest ml-1 mb-3 block text-slate-400 group-focus-within/field:text-violet-600 transition-colors">Security Key</label>
              <div className="relative">
                <Fingerprint className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within/field:text-violet-600 transition-colors" />
                <input 
                  type="password" 
                  placeholder="••••••••"
                  className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl px-12 font-bold text-sm text-slate-900 focus:outline-none focus:border-violet-600 focus:bg-white transition-all shadow-inner"
                  value={formData.password} onChange={e => handleInputChange('password', e.target.value)}
                />
              </div>
            </div>

            {errorMessage && (
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3">
                <ShieldAlert className="w-5 h-5 text-rose-500" />
                <p className="text-[11px] font-black text-rose-600 uppercase tracking-widest">{errorMessage}</p>
              </motion.div>
            )}

            <Button 
              type="submit" 
              className="w-full h-16 mt-4 !rounded-2xl shadow-xl flex items-center justify-center gap-3 active:scale-[0.99] transition-transform" 
              isLoading={isSubmitting}
            >
              <Cpu className="w-5 h-5" />
              {isLoginMode ? 'Initialize Sync' : 'Grant Registry Access'}
            </Button>
          </form>

          <footer className="mt-10 text-center pt-8 border-t border-slate-50">
            <button 
              type="button"
              onClick={() => { setIsLoginMode(!isLoginMode); setErrorMessage(''); }} 
              className="text-[11px] font-black text-slate-400 uppercase tracking-widest hover:text-violet-600 transition-colors flex items-center justify-center gap-2 mx-auto"
            >
              {isLoginMode ? "Need Clinical Access?" : "Existing Practitioner Details"} <ChevronRight className="w-4 h-4" />
            </button>
          </footer>
        </Card>
      </motion.div>
    </div>
  );
}
