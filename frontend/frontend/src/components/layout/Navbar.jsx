import React from 'react';
import { motion } from 'framer-motion'; // eslint-disable-line no-unused-vars
import { Database, Microscope, Calendar, Target, Search, ArrowLeft, Filter, LayoutDashboard, Upload as UploadIcon, LogOut } from 'lucide-react';
import { Button } from '../ui/Button';

/**
 * Global Navigation Bar.
 * Handles primary routing and displays the user's active context.
 */
export function Navbar({ activeView, setActiveView, onLogout, onOpenSettings, user }) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] bg-white border-b border-violet-50 backdrop-blur-md">
      <div className="max-w-screen-2xl mx-auto px-6 h-16 flex items-center justify-between">
        
        <div 
          onClick={() => setActiveView('dashboard')} 
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-lg bg-violet-600 flex items-center justify-center text-white shadow-premium transition-transform group-hover:rotate-6">
            <Microscope className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-black text-slate-900 tracking-tighter uppercase leading-none">
              DERMISYN
            </h1>
            <p className="text-[11px] font-bold text-violet-600 tracking-[0.2em] uppercase mt-0.5 leading-none">
              Clinical Hub
            </p>
          </div>
        </div>

        {/* Utilitarian Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <NavLink 
            id="nav-home" 
            active={activeView === 'dashboard'} 
            onClick={() => setActiveView('dashboard')}
            label="Home"
          />
          <NavLink 
            id="nav-records" 
            active={activeView === 'records'} 
            onClick={() => setActiveView('records')}
            label="Records"
          />
          <NavLink 
            id="nav-intake" 
            active={activeView === 'upload'} 
            onClick={() => setActiveView('upload')}
            label="Intake"
          />
          <NavLink 
            id="nav-analytics" 
            active={activeView === 'analytics'} 
            onClick={() => setActiveView('analytics')}
            label="Data"
          />
        </div>

        {/* User Node Profile */}
        <div className="flex items-center gap-4">
          <button 
            id="nav-profile" 
            onClick={onOpenSettings}
            className={`flex items-center gap-3 transition-all pr-3 pl-1 py-1 rounded-lg border border-transparent hover:border-violet-100 hover:bg-violet-50 ${activeView === 'profile' ? 'bg-violet-50 border-violet-100' : ''}`}
          >
            <div className="w-9 h-9 rounded-lg bg-violet-100 border border-violet-200 flex items-center justify-center text-violet-700 font-black text-xs">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="text-left hidden lg:block">
              <p className="text-[10px] font-bold text-violet-600 uppercase tracking-widest leading-none mb-0.5">Settings</p>
              <p className="text-sm font-black text-slate-900 leading-none truncate max-w-[90px]">{user?.name?.split(' ')[0] || 'Clinician'}</p>
            </div>
          </button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onLogout} 
            className="text-slate-400 hover:text-rose-500 h-10 w-10"
            title="Sign Out"
          >
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </nav>
  );
}

function NavLink({ id, active, onClick, label }) {
  return (
    <button
      id={id}
      onClick={onClick}
      className={`text-[11px] font-bold uppercase tracking-[0.2em] transition-all relative py-1 ${
        active 
        ? 'text-violet-700 font-black' 
        : 'text-slate-400 hover:text-violet-600'
      }`}
    >
      {label}
      {active && (
        <motion.div 
          layoutId="nav-underline" 
          className="absolute -bottom-1.5 left-0 right-0 h-0.5 bg-violet-600 rounded-full" 
        />
      )}
    </button>
  );
}
