import React from 'react';
import { Search, Menu } from 'lucide-react';
import { theme } from '../Theme';

const Header = ({ activeMenu, user, onToggleSidebar }) => {
  const isFeaturesPage = activeMenu === 'Pelajari Fitur';
  const isIntegrationsPage = activeMenu === 'Manajemen Integrasi';

  return (
    <header 
      className={`${isIntegrationsPage ? 'h-24 lg:h-28' : 'h-20 lg:h-24'} px-4 sm:px-6 lg:px-10 flex justify-between items-center backdrop-blur-xl z-10 border-b border-white/10 shadow-lg shrink-0`} 
      style={{ backgroundColor: theme.headerBg }}
    >
      {/* Left Section: Hamburger Menu (Mobile Only) + Title / Search Bar */}
      <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
        {/* Toggle button for mobile sidebar */}
        <button 
          onClick={onToggleSidebar}
          className="lg:hidden text-white/80 hover:text-white p-2 hover:bg-white/5 rounded-xl transition-all cursor-pointer"
        >
          <Menu size={24} />
        </button>

        <div className="flex-1 min-w-0">
          {activeMenu === 'Dashboard' ? (
            <div 
              className="flex items-center w-full max-w-md px-4 rounded-xl shadow-inner transition-all focus-within:ring-2 focus-within:ring-white/20" 
              style={{ backgroundColor: '#26648D' }}
            >
              <Search 
                className="text-white/50 shrink-0" 
                size={18} 
                strokeWidth={2.5} 
              />
              <input 
                type="text" 
                placeholder="Search data..." 
                className="w-full bg-transparent pl-3 py-2.5 text-sm md:text-base font-semibold text-white outline-none placeholder:text-white/40" 
              />
            </div>
          ) : activeMenu === 'Notifications' ? (
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight truncate">
              Notifikasi
            </h1>
          ) : activeMenu === 'Settings' ? (
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight truncate">
              Settings
            </h1>
          ) : activeMenu === 'Manajemen Integrasi' ? (
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight truncate">
                Manajemen Integrasi
              </h1>
              <p className="text-white/75 text-xs sm:text-sm mt-2 truncate">
                Hubungkan dan kelola credential sistem digital Anda secara terputus/sambung
              </p>
            </div>
          ) : (
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight truncate">
              {activeMenu === 'Pelajari Fitur' ? 'Pusat Pembelajaran Fitur' : 
               activeMenu === 'Marketplace' ? 'Marketplace Integration' : 
               activeMenu === 'Reports' ? 'Reporting' :
               activeMenu}
            </h1>
          )}
        </div>
      </div>

      {/* Profile Section */}
      <div className="flex items-center gap-3 sm:gap-6 text-white ml-2">
        <div className="flex items-center gap-3 sm:gap-4 border-l border-white/10 pl-3 sm:pl-6">
          <div 
            className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl flex items-center justify-center text-white font-black text-lg lg:text-xl shadow-xl border border-white/10 uppercase overflow-hidden shrink-0" 
            style={{ backgroundColor: theme.accent }}
          >
            {user?.profile_photo_url ? (
              <img src={user.profile_photo_url} alt="" className="w-full h-full object-cover" />
            ) : (
              user?.name ? user.name.split(' ').map(n => n[0]).join('').substring(0, 2) : '??'
            )}
          </div>
          <div className="hidden sm:block text-left min-w-0">
            <p className="font-extrabold text-sm lg:text-base truncate max-w-[120px]">{user?.name || 'User'}</p>
            <p className="text-[10px] text-green-400 font-bold uppercase tracking-wider">Online</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;