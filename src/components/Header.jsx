import React from 'react';
import { Search } from 'lucide-react';
import { theme } from '../Theme';

const Header = ({ activeMenu, user }) => {
  const isFeaturesPage = activeMenu === 'Pelajari Fitur';

  return (
    <header 
      className="h-28 px-10 flex justify-between items-center backdrop-blur-xl z-10 border-b-2 border-white/20 shadow-lg" 
      style={{ backgroundColor: theme.headerBg }}
    >
      {/* Left Section: Search Bar (Dashboard Only) OR Page Title */}
      <div className="flex-1">
        {activeMenu === 'Dashboard' ? (
          <div 
            className="flex items-center w-full max-w-xl px-6 rounded-2xl shadow-inner transition-all focus-within:ring-2 focus-within:ring-white/20" 
            style={{ backgroundColor: '#26648D' }}
          >
            <Search 
              className="text-white/60 shrink-0" 
              size={22} 
              strokeWidth={2.5} 
            />
            <input 
              type="text" 
              placeholder="Search data..." 
              className="w-full bg-transparent pl-4 py-4 text-lg font-semibold text-white outline-none placeholder:text-white/40" 
            />
          </div>
        ) : activeMenu === 'Notifications' ? (
          <h1 className="text-4xl font-black text-white tracking-tight">
            Notifikasi
          </h1>
        ) : activeMenu === 'Settings' ? (
          <h1 className="text-4xl font-black text-white tracking-tight">
            Settings
          </h1>
        ) : (
          <h1 className="text-4xl font-black text-white tracking-tight">
            {activeMenu === 'Pelajari Fitur' ? 'Pusat Pembelajaran Fitur' : 
             activeMenu === 'Marketplace' ? 'Marketplace Integration' : 
             activeMenu === 'Reports' ? 'Reporting' :
             activeMenu}
          </h1>
        )}
      </div>

      {/* Profile Section */}
      <div className="flex items-center gap-10 text-white">
        <div className="flex items-center gap-5 border-l-2 border-white/10 pl-10">
          <div 
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-xl border-2 border-white/20 uppercase" 
            style={{ backgroundColor: theme.accent }}
          >
            {user?.name ? user.name.split(' ').map(n => n[0]).join('').substring(0, 2) : '??'}
          </div>
          <div className="hidden lg:block text-left">
            <p className="font-extrabold text-lg truncate max-w-[150px]">{user?.name || 'User'}</p>
            <p className="text-xs text-green-400 font-black uppercase tracking-widest">Online Now</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;