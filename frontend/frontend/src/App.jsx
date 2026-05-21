import React, { useState, useEffect, useCallback } from 'react';
import { AuthView } from './views/AuthView';
import { DashboardView } from './views/DashboardView';
import { UploadView } from './views/UploadView';
import { ProfileView } from './views/ProfileView';
import { EducationView } from './views/EducationView';
import { AnalyticsView } from './views/AnalyticsView';
import { RecordsView } from './views/RecordsView';
import { Navbar } from './components/layout/Navbar';
import { ChatWidget } from './components/ui/ChatWidget';
import { SettingsModal } from './components/ui/SettingsModal';
import { LegalModal } from './components/ui/LegalModal';
import { AnimatePresence, motion } from 'framer-motion'; // eslint-disable-line no-unused-vars

/**
 * Main Application Controller
 * Handles authentication state, global data fetching, and view routing.
 */
function App() {
  // --- Authentication State ---
  const [authToken, setAuthToken] = useState(localStorage.getItem('nebula_token'));
  const [user, setUser] = useState(null);

  // --- Core Data State ---
  const [scans, setScans] = useState([]);
  const [isLoadingScans, setIsLoadingScans] = useState(false);
  const [activeView, setActiveView] = useState('dashboard');

  // --- UI Toggle State ---
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLegalOpen, setIsLegalOpen] = useState(false);

  // Sync token to local storage
  useEffect(() => {
    if (authToken) {
      localStorage.setItem('nebula_token', authToken);
    } else {
      localStorage.removeItem('nebula_token');
    }
  }, [authToken]);

  /**
   * Fetch user profile data once authenticated
   */
  const fetchUserProfile = useCallback(async () => {
    if (!authToken) return;
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data);
      } else if (response.status === 401) {
        setAuthToken(null); // Session expired
      }
    } catch (error) {
      console.error('Failed to sync user profile:', error);
    }
  }, [authToken]);

  /**
   * Fetch all scan history for the current user
   */
  const fetchScanHistory = useCallback(async () => {
    if (!authToken) return;
    setIsLoadingScans(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/scans`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      if (response.ok) {
        const data = await response.json();
        setScans(data || []);
      }
    } catch (error) {
      console.error('Failed to load scan history:', error);
    } finally {
      setIsLoadingScans(false);
    }
  }, [authToken]);

  // Initial Data Sync
  useEffect(() => {
    if (authToken) {
      fetchUserProfile();
      fetchScanHistory();
    }
  }, [authToken, fetchUserProfile, fetchScanHistory]);

  const handleLogout = () => {
    setAuthToken(null);
    setUser(null);
    setScans([]);
    setActiveView('dashboard');
  };

  const handleUpdateProfile = useCallback(async (updatedData) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user`, {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedData)
      });
      if (response.ok) {
        const { user: updatedUser } = await response.json();
        setUser(updatedUser);
      } else {
        const err = await response.json();
        throw new Error(err.error || "Update Failure");
      }
    } catch (e) {
      console.error("Clinical Sync Error:", e);
      throw e;
    }
  }, [authToken]);

  // --- View Router ---
  const renderActiveView = () => {
    const viewProps = {
      user,
      scans,
      loading: isLoadingScans,
      setActiveView,
      authToken,
      onScanComplete: fetchScanHistory,
      onLogout: handleLogout,
      onOpenSettings: () => setIsSettingsOpen(true),
      onUpdateUser: handleUpdateProfile,
      setShowLegal: setIsLegalOpen
    };

    switch (activeView) {
      case 'dashboard': return <DashboardView {...viewProps} />;
      case 'upload': return <UploadView {...viewProps} />;
      case 'profile': return <ProfileView {...viewProps} />;
      case 'records': return <RecordsView {...viewProps} />;
      case 'education': return <EducationView {...viewProps} />;
      case 'analytics': return <AnalyticsView {...viewProps} />;
      default: return <DashboardView {...viewProps} />;
    }
  };

  if (!authToken) {
    return <AuthView setAuthToken={setAuthToken} />;
  }

  return (
    <div className="min-h-screen relative">
      <Navbar
        activeView={activeView}
        setActiveView={setActiveView}
        onLogout={handleLogout}
        onOpenSettings={() => setIsSettingsOpen(true)}
        user={user}
      />

      <main className="pt-18 min-h-[calc(100vh-64px)]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeView}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            {renderActiveView()}
          </motion.div>
        </AnimatePresence>
      </main>

      <ChatWidget />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        user={user}
        onUpdateUser={async (data) => {
          // Access the handler from the viewProps logic if needed, 
          // but better to just re-implement or pass it directly here.
          // In App.jsx line 109 I defined it in renderActiveView. 
          // Let's make it a top-level function in App for clarity.
          await handleUpdateProfile(data);
        }}
      />

      <LegalModal
        isOpen={isLegalOpen}
        onClose={() => setIsLegalOpen(false)}
      />
    </div>
  );
}

export default App;
