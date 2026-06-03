import React, { useEffect, useState } from 'react';
import { authService } from './api/auth';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/AuthPage';
import SettingsPage from './pages/SettingsPage';
import NotificationsPage from './pages/NotificationsPage';
import ReportsPage from './pages/ReportsPage';
import ManajemenIntegrasiPage from './pages/ManajemenIntegrasiPage';
import FeaturesPage from './pages/FeaturesPage';
import DashboardPage from './pages/DashboardMenuPage';
import TotalIntegrasiPage from './components/dashboard/TotalIntegrasiTab';
import AnomaliTerdeteksiPage from './pages/AnomaliTerdeteksiPage';
import SystemIntegrityPage from './components/dashboard/SystemIntegrityTab';
import Sidebar from './components/Sidebar'; // Buat komponen sidebar terpisah
import Header from './components/Header';   // Buat komponen header terpisah
import { theme } from './Theme';

function App() {
  const [authPage, setAuthPage] = useState('landing');
  const [isLogin, setIsLogin] = useState(false);
  const [activeMenu, setActiveMenu] = useState('Dashboard');
  const [user, setUser] = useState(null);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [booting, setBooting] = useState(true);

  useEffect(() => {
    // Migrate localStorage to version 3 (reset old default values)
    const storageVer = localStorage.getItem('cybersecure_storage_version');
    if (storageVer !== '4') {
      localStorage.removeItem('cybersecure_core_systems');
      localStorage.removeItem('cybersecure_custom_integrations');
      localStorage.setItem('cybersecure_storage_version', '4');
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setBooting(false);
      return;
    }
    authService
      .me()
      .then((data) => {
        setUser(data);
        setIsLogin(true);
        setAuthPage('app');
      })
      .catch(() => {
        localStorage.removeItem('token');
      })
      .finally(() => setBooting(false));
  }, []);

  const handleUserUpdate = (profile) => {
    setUser((prev) => ({ ...prev, ...profile }));
  };

  const handleLoginSuccess = (userData) => {
    localStorage.removeItem('cybersecure_core_systems');
    localStorage.removeItem('cybersecure_custom_integrations');
    setUser(userData);
    setIsLogin(true);
    setAuthPage('app');
  };

  // Handle pindah ke tutorial fitur (tetap di Landing Page)
  const handleLearnFeatures = () => {
    setAuthPage('features');
  };

  // Handle sign out
  const handleSignOut = async () => {
    try {
      await authService.logout();
    } catch {
      localStorage.removeItem('token');
    }
    localStorage.removeItem('cybersecure_core_systems');
    localStorage.removeItem('cybersecure_custom_integrations');
    setUser(null);
    setIsLogin(false);
    setAuthPage('landing');
  };

  if (booting) {
    return (
      <div
        style={{ backgroundColor: theme.pageBg }}
        className="flex h-screen items-center justify-center text-white/70 font-poppins"
      >
        Memuat sesi...
      </div>
    );
  }

  // Navigasi Auth
  if (!isLogin) {
    if (authPage === 'landing' || authPage === 'features') {
      return (
        <LandingPage 
          setAuthPage={setAuthPage} 
          onLearnFeatures={handleLearnFeatures} 
          isViewingFeatures={authPage === 'features'} 
        />
      );
    }
    if (authPage === 'login' || authPage === 'signup') 
      return <LoginPage mode={authPage} setAuthPage={setAuthPage} onLogin={handleLoginSuccess} />;
  }

  // Tampilan Dashboard Utama
  return (
    <div style={{ backgroundColor: theme.pageBg }} className="flex h-screen overflow-hidden relative font-poppins">
      {/* Backdrop overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden transition-all duration-300"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      <Sidebar 
        activeMenu={activeMenu} 
        setActiveMenu={(menu) => {
          setActiveMenu(menu);
          setIsSidebarOpen(false); // Close sidebar on mobile after clicking
        }} 
        theme={theme} 
        setAuthPage={setAuthPage} 
        onSignOut={handleSignOut}
        user={user}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />
      
      <main className="flex-1 flex flex-col overflow-hidden w-full">
        <Header 
          activeMenu={activeMenu} 
          user={user} 
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
        />
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 md:px-8 lg:px-10 pb-8 pt-6 lg:pb-10 lg:pt-8 text-white">
          {activeMenu === 'Dashboard' && <DashboardPage setActiveMenu={setActiveMenu} />}
          {activeMenu === 'Total Integrasi' && <TotalIntegrasiPage />}
          {activeMenu === 'Anomali Terdeteksi' && <AnomaliTerdeteksiPage />}
          {activeMenu === 'System Integrity' && <SystemIntegrityPage />}
          {activeMenu === 'Pelajari Fitur' && <FeaturesPage />}
          {activeMenu === 'Manajemen Integrasi' && <ManajemenIntegrasiPage />}
          {activeMenu === 'Reports' && <ReportsPage />}
          {activeMenu === 'Notifications' && <NotificationsPage />}
          {activeMenu === 'Settings' && (
            <SettingsPage user={user} onUserUpdate={handleUserUpdate} />
          )}
          {activeMenu !== 'Dashboard' && activeMenu !== 'Total Integrasi' && activeMenu !== 'Anomali Terdeteksi' && activeMenu !== 'System Integrity' && activeMenu !== 'Pelajari Fitur' && activeMenu !== 'Manajemen Integrasi' && activeMenu !== 'Reports' && activeMenu !== 'Notifications' && activeMenu !== 'Settings' && (
            <div className="text-white opacity-50 text-center p-20">Halaman {activeMenu} dalam pengembangan</div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;