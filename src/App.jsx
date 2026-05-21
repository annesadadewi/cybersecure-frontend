import React, { useState } from 'react';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/AuthPage';
import SettingsPage from './pages/SettingsPage';
import NotificationsPage from './pages/NotificationsPage';
import ReportsPage from './pages/ReportsPage';
import MarketplacePage from './pages/MarketplacePage';
import FeaturesPage from './pages/FeaturesPage';
import DashboardPage from './pages/DashboardMenuPage';
import TotalIntegrasiPage from './pages/TotalIntegrasiPage';
import AnomaliTerdeteksiPage from './pages/AnomaliTerdeteksiPage';
import SystemIntegrityPage from './pages/SystemIntegrityPage';
import Sidebar from './components/Sidebar'; // Buat komponen sidebar terpisah
import Header from './components/Header';   // Buat komponen header terpisah
import { theme } from './Theme';

function App() {
  const [authPage, setAuthPage] = useState('landing');
  const [isLogin, setIsLogin] = useState(false);
  const [activeMenu, setActiveMenu] = useState('Dashboard');
  const [user, setUser] = useState(null);

  // Handle pindah ke dashboard
  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setIsLogin(true);
    setAuthPage('app');
  };

  // Handle pindah ke tutorial fitur (tetap di Landing Page)
  const handleLearnFeatures = () => {
    setAuthPage('features');
  };

  // Handle sign out
  const handleSignOut = () => {
    setUser(null);
    setIsLogin(false);
    setAuthPage('landing');
  };

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
    <div style={{ backgroundColor: theme.pageBg }} className="flex h-screen overflow-hidden">
      <Sidebar 
        activeMenu={activeMenu} 
        setActiveMenu={setActiveMenu} 
        theme={theme} 
        setAuthPage={setAuthPage} 
        onSignOut={handleSignOut}
        user={user}
      />
      
      <main className="flex-1 flex flex-col overflow-hidden">
        <Header activeMenu={activeMenu} user={user} />
        <div className="flex-1 overflow-y-auto px-10 pb-10 pt-8">
          {activeMenu === 'Dashboard' && <DashboardPage setActiveMenu={setActiveMenu} />}
          {activeMenu === 'Total Integrasi' && <TotalIntegrasiPage />}
          {activeMenu === 'Anomali Terdeteksi' && <AnomaliTerdeteksiPage />}
          {activeMenu === 'System Integrity' && <SystemIntegrityPage />}
          {activeMenu === 'Pelajari Fitur' && <FeaturesPage />}
          {activeMenu === 'Marketplace' && <MarketplacePage />}
          {activeMenu === 'Reports' && <ReportsPage />}
          {activeMenu === 'Notifications' && <NotificationsPage />}
          {activeMenu === 'Settings' && <SettingsPage user={user} />}
          {activeMenu !== 'Dashboard' && activeMenu !== 'Total Integrasi' && activeMenu !== 'Anomali Terdeteksi' && activeMenu !== 'System Integrity' && activeMenu !== 'Pelajari Fitur' && activeMenu !== 'Marketplace' && activeMenu !== 'Reports' && activeMenu !== 'Notifications' && activeMenu !== 'Settings' && (
            <div className="text-white opacity-50 text-center p-20">Halaman {activeMenu} dalam pengembangan</div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;