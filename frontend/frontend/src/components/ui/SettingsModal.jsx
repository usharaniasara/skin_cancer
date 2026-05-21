import React, { useState, useEffect } from 'react';
import { Card } from './Card';
import { Button } from './Button';
import { X, Shield, Lock, Bell, User as UserIcon, Settings as SettingsIcon, Check, Loader2 } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

/**
 * SettingsModal: User configuration interface for personal profile and security.
 * Transitioned to 'Clinical Violet' palette with upscaled typography.
 */
export function SettingsModal({ isOpen, onClose, user, onUpdateUser }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-2 md:p-4">
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-slate-950/20 backdrop-blur-md" 
          onClick={onClose} 
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.98, y: 15 }} 
          animate={{ opacity: 1, scale: 1, y: 0 }} 
          exit={{ opacity: 0, scale: 0.98, y: 15 }}
          className="w-full max-w-xl relative p-4"
        >
          <SettingsForm user={user} onClose={onClose} onUpdateUser={onUpdateUser} />
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

function SettingsForm({ user, onClose, onUpdateUser }) {
  const [formData, setFormData] = useState({ 
    name: user?.name || '', 
    email: user?.email || '' 
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [syncError, setSyncError] = useState(null);

  const [protocols, setProtocols] = useState({
    privacy: true,
    notifications: true,
    security: false
  });

  const toggleProtocol = (key) => {
    setProtocols(prev => ({ ...prev, [key]: !prev[key] }));
  };

  useEffect(() => {
    if (user) {
        setFormData({ name: user.name || '', email: user.email || '' });
    }
  }, [user]);

  const handleSave = async () => {
    setIsSaving(true);
    setSyncError(null);
    try {
        await onUpdateUser(formData);
        setIsEditing(false);
    } catch (e) {
        setSyncError(e.message || "Failed to update profile");
    } finally {
        setIsSaving(false);
    }
  };

  return (
    <Card className="p-6 md:p-8 premium-card border-violet-100 bg-white shadow-3xl overflow-hidden relative rounded-[2.5rem]">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-violet-600 flex items-center justify-center text-white shadow-premium">
            <SettingsIcon className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tighter uppercase leading-none mb-1">Clinic Settings</h3>
            <p className="text-[11px] font-black text-violet-600 uppercase tracking-widest leading-none">Diagnostic Link Registry v5.2</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="rounded-xl hover:bg-slate-50 transition-all">
          <X className="w-6 h-6" />
        </Button>
      </div>

      <div className="space-y-6">
         {/* Profile Identity */}
         <div className={`p-6 bg-slate-50 border border-slate-100 rounded-3xl transition-all ${isEditing ? 'ring-2 ring-violet-500/20 shadow-inner bg-white' : ''}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 w-full">
                 <div className="w-14 h-14 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-violet-600 shadow-sm flex-shrink-0">
                    <UserIcon className="w-7 h-7" />
                 </div>
                 {!isEditing ? (
                   <div className="overflow-hidden">
                      <p className="text-base font-black text-slate-900 uppercase tracking-widest leading-none mb-1 truncate">{user?.name || 'Authorized Practitioner'}</p>
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest leading-none truncate">{user?.email || 'authenticated.node@dermisyn.com'}</p>
                   </div>
                 ) : (
                   <div className="space-y-2 w-full animate-in fade-in slide-in-from-left-1 transition-all">
                      <input 
                        className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm font-bold text-slate-900 w-full focus:outline-none focus:border-violet-500 shadow-inner" 
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Clinical ID Name"
                      />
                      <input 
                        className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm font-bold text-slate-900 w-full focus:outline-none focus:border-violet-500 shadow-inner" 
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        placeholder="Secure Email Registry"
                      />
                      {syncError && <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest px-2">{syncError}</p>}
                   </div>
                 )}
              </div>
              <div className="ml-4">
                {isEditing ? (
                  <Button onClick={handleSave} disabled={isSaving} className="!rounded-xl w-12 h-12 bg-violet-600 text-white hover:bg-violet-700 flex items-center justify-center p-0 shadow-xl">
                    {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-6 h-6" />}
                  </Button>
                ) : (
                  <Button onClick={() => setIsEditing(true)} variant="outline" className="!rounded-xl h-11 px-6 border-slate-200 text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-violet-600 transition-all">Modify</Button>
                )}
              </div>
            </div>
         </div>

         {/* Clinical Protocols */}
         <div className="space-y-3">
            <SettingsItem 
              icon={Shield} 
              label="Privacy Protocols" 
              desc="Localized health data storage (HIPAA Ready)." 
              active={protocols.privacy}
              onClick={() => toggleProtocol('privacy')}
            />
            <SettingsItem 
              icon={Bell} 
              label="Hub Notifications" 
              desc="High-priority diagnostic alert streams." 
              active={protocols.notifications}
              onClick={() => toggleProtocol('notifications')}
            />
            <SettingsItem 
              icon={Lock} 
              label="Security Core" 
              desc="Biometric synchronization for diagnostic sync." 
              active={protocols.security}
              onClick={() => toggleProtocol('security')}
            />
         </div>
      </div>

      <div className="mt-12 pt-8 border-t border-slate-100 flex items-center justify-between">
         <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Audit Registry v5.2 • Encrypted</p>
         <Button variant="primary" onClick={onClose} className="px-10 h-14 !rounded-2xl bg-slate-900 text-white hover:bg-black shadow-2xl uppercase font-black tracking-widest text-xs transition-all active:scale-95">
            Verify & Exit
         </Button>
      </div>
    </Card>
  );
}

function SettingsItem({ icon: IconComponent, label, desc, active, onClick }) {
  return (
    <div 
        onClick={onClick}
        className={`flex items-center justify-between p-4 rounded-2xl transition-all cursor-pointer group border ${active ? 'bg-violet-50/50 border-violet-100 shadow-inner' : 'bg-white border-slate-50 hover:bg-slate-50'}`}
    >
       <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${active ? 'bg-white text-violet-600 shadow-sm' : 'bg-slate-50 text-slate-400'}`}>
             {IconComponent && <IconComponent className={`w-6 h-6 transition-transform ${active ? 'scale-110' : 'group-hover:scale-110'}`} />}
          </div>
          <div>
            <p className={`text-[11px] font-black uppercase tracking-widest leading-none mb-1 ${active ? 'text-violet-800' : 'text-slate-900'}`}>{label}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest opacity-70">{desc}</p>
          </div>
       </div>
       <div className={`w-12 h-6 rounded-full transition-all relative p-1 ${active ? 'bg-violet-600' : 'bg-slate-200 shadow-inner'}`}>
          <motion.div 
            animate={{ x: active ? 24 : 0 }}
            className="w-4 h-4 bg-white rounded-full shadow-md"
          />
       </div>
    </div>
  );
}
