import React from 'react';
import { 
  Shield, 
  LayoutDashboard, 
  BookOpen, 
  Activity, 
  FileText, 
  Bell, 
  Settings 
} from 'lucide-react';

const Sidebar = ({ theme, activeMenu, setActiveMenu, onSignOut, user }) => {
  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard },
    { name: 'Marketplace', icon: Activity },
    { name: 'Reports', icon: FileText },
    { name: 'Notifications', icon: Bell },
    { name: 'Settings', icon: Settings },
  ];

  return (
    <aside 
      style={{ backgroundColor: theme.sidebar }} 
      className="w-[280px] h-screen sticky top-0 flex flex-col p-6 border-r border-white/10 z-20 shrink-0 font-poppins"
    >
      <div className="space-y-10">
        {/* Logo Section */}
        <div className="flex items-center gap-4 text-white px-2">
          <Shield size={36} fill="white" className="shrink-0" />
          <span className="text-2xl font-extrabold tracking-tight">CyberSecure</span>
        </div>

        {/* Navigation Section */}
        <nav className="space-y-3">
          {menuItems.map((item) => {
            const isActive = activeMenu === item.name;
            return (
              <div 
                key={item.name}
                onClick={() => setActiveMenu(item.name)}
                className={`flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all duration-200 group ${
                  isActive 
                    ? 'bg-white/20 text-white shadow-lg border border-white/10' 
                    : 'text-white/60 hover:bg-white/5 hover:text-white'
                }`}
              >
                <item.icon 
                  size={24} 
                  strokeWidth={isActive ? 2.5 : 2} 
                  className="shrink-0" 
                  stroke="#69C3FF"
                />
                <span className={`text-lg ${isActive ? 'font-bold' : 'font-medium'}`}>
                  {item.name}
                </span>
              </div>
            );
          })}
        </nav>
      </div>

      {/* Optional: Logout or Footer */}
      <div className="mt-auto pt-6 border-t border-white/10">
        <div 
          onClick={onSignOut}
          className="flex items-center gap-3 px-2 text-white/40 hover:text-white transition-colors cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-all">
            <span className="text-xs font-bold uppercase">
              {user?.name ? user.name.split(' ').map(n => n[0]).join('').substring(0, 2) : '??'}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold truncate max-w-[140px]">{user?.name || 'User'}</span>
            <span className="text-[10px] uppercase tracking-widest opacity-60">Sign Out</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;