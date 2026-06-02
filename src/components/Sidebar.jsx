import React from 'react';
import { 
  Shield, 
  LayoutDashboard, 
  BookOpen, 
  Activity, 
  FileText, 
  Bell, 
  Settings,
  X,
  Plug
} from 'lucide-react';

const Sidebar = ({ theme, activeMenu, setActiveMenu, onSignOut, user, isOpen, setIsOpen }) => {
  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard },
    { name: 'Manajemen Integrasi', icon: Plug },
    { name: 'Reports', icon: FileText },
    { name: 'Notifications', icon: Bell },
    { name: 'Settings', icon: Settings },
  ];

  return (
    <aside 
      style={{ backgroundColor: theme.sidebar }} 
      className={`fixed lg:sticky top-0 left-0 h-screen z-40 flex flex-col p-5 border-r border-white/10 shrink-0 font-poppins transition-transform duration-300 w-[260px] shadow-2xl bg-gradient-to-b from-[#1F5E88] to-[#123A57] ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}
    >
      <div className="flex flex-col h-full justify-between">
        <div className="space-y-8">
          {/* Logo Section & Close Button for Mobile */}
          <div className="flex items-center justify-between px-2 py-1">
            <div className="flex items-center gap-3 text-white">
              <Shield size={28} fill="white" className="shrink-0 drop-shadow-[0_2px_8px_rgba(255,255,255,0.2)]" />
              <span className="text-xl font-extrabold tracking-tight bg-clip-text bg-gradient-to-r from-white to-blue-200">CyberSecure</span>
            </div>
            {/* Close button for mobile screen size */}
            <button 
              onClick={() => setIsOpen(false)}
              className="lg:hidden text-white/60 hover:text-white p-1 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation Section */}
          <nav className="space-y-2">
            {menuItems.map((item) => {
              const isActive = activeMenu === item.name;
              return (
                <div 
                  key={item.name}
                  onClick={() => setActiveMenu(item.name)}
                  className={`flex items-center gap-3 p-3.5 rounded-xl cursor-pointer transition-all duration-200 group border border-transparent ${
                    isActive 
                      ? 'bg-white/15 text-white shadow-lg border-white/10 backdrop-blur-md' 
                      : 'text-white/60 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <item.icon 
                    size={20} 
                    strokeWidth={isActive ? 2.5 : 2} 
                    className="shrink-0 transition-transform group-hover:scale-110" 
                    stroke={isActive ? "#B8DDF5" : "#69C3FF"}
                  />
                  <span className={`text-[15px] ${isActive ? 'font-bold' : 'font-medium'}`}>
                    {item.name}
                  </span>
                </div>
              );
            })}
          </nav>
        </div>

        {/* User profile & Logout footer */}
        <div className="pt-4 border-t border-white/10">
          <div 
            onClick={onSignOut}
            className="flex items-center gap-4 px-2 py-1 text-white/60 hover:text-white transition-colors cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-[#EF4444]/20 overflow-hidden transition-all border border-white/10 shrink-0 shadow-lg">
              {user?.profile_photo_url ? (
                <img
                  src={user.profile_photo_url}
                  alt=""
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-sm font-bold uppercase">
                  {user?.name ? user.name.split(' ').map((n) => n[0]).join('').substring(0, 2) : '??'}
                </span>
              )}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-bold truncate max-w-[140px] text-white tracking-wide">{user?.name || 'User'}</span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#69C3FF] group-hover:text-red-400 transition-colors mt-0.5">Sign Out</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;