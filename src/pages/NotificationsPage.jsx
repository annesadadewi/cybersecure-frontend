import React from 'react';
import { theme } from '../Theme';
import { AlertTriangle, Info, Filter } from 'lucide-react';

const NotificationsPage = () => {
  const notifications = [
    {
      type: 'Security Alert',
      message: 'Suspicious Login from new IP',
      time: '2m ago',
      unread: true,
      icon: AlertTriangle,
      color: '#EF4444'
    },
    {
      type: 'System Update',
      message: 'Platform maintenance scheduled',
      time: '1h ago',
      unread: true,
      icon: Info,
      color: '#B8DDF5'
    },
    {
      type: 'Security Alert',
      message: 'Anomaly detected in Tokopedia',
      time: '3h ago',
      unread: false,
      icon: AlertTriangle,
      color: '#EF4444'
    },
    {
      type: 'System Update',
      message: 'New Feature: 2FA enabled',
      time: '1h ago',
      unread: false,
      icon: Info,
      color: '#B8DDF5'
    }
  ];

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight">Notification</h2>
          <div className="w-6 h-6 bg-[#EF4444] rounded-full flex items-center justify-center text-white text-xs font-black shadow-lg">
            4
          </div>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button className="flex-1 sm:flex-initial bg-[#B8DDF5]/15 text-[#B8DDF5] px-4 py-2 rounded-xl font-bold border border-[#B8DDF5]/30 hover:bg-[#B8DDF5]/25 text-xs transition-all cursor-pointer">
            Mark all read
          </button>
          <button className="flex-1 sm:flex-initial bg-[#B8DDF5] hover:bg-white text-[#1F5E88] px-4 py-2 rounded-xl font-bold flex items-center justify-center gap-1.5 shadow-lg hover:scale-105 text-xs transition-all cursor-pointer">
            <Filter size={14} />
            Filter
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3.5">
        {notifications.map((notif, i) => (
          <div 
            key={i} 
            className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 px-4 bg-white/5 hover:bg-white/10 rounded-xl sm:rounded-2xl border border-white/5 hover:border-white/10 transition-all gap-3 cursor-pointer"
          >
            <div className="flex items-center gap-4 sm:gap-6 min-w-0">
              {/* Icon */}
              <div className="w-10 h-10 sm:w-11 sm:h-11 bg-[#B8DDF5]/10 rounded-lg sm:rounded-xl flex items-center justify-center text-[#B8DDF5] shadow-inner shrink-0 border border-[#B8DDF5]/20">
                <notif.icon size={20} className={notif.type === 'Security Alert' ? 'text-red-400' : 'text-[#B8DDF5]'} />
              </div>

              {/* Content */}
              <div className="min-w-0">
                <h3 
                  className="text-sm sm:text-base font-bold mb-0.5 truncate"
                  style={{ color: notif.type === 'Security Alert' ? '#EF4444' : '#B8DDF5' }}
                >
                  {notif.type}
                </h3>
                <p className="text-xs sm:text-sm text-white/60 font-semibold truncate">{notif.message}</p>
              </div>
            </div>

            {/* Time & Badge */}
            <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 border-t border-white/5 pt-2 sm:pt-0 sm:border-0">
              <span className="text-xs text-white/40 font-bold">{notif.time}</span>
              <div className="flex items-center min-w-4 justify-center">
                {notif.unread ? (
                  <div className="w-2.5 h-2.5 bg-[#4AA9FF] rounded-full shadow-[0_0_10px_#4AA9FF]"></div>
                ) : (
                  <div className="w-2.5 h-2.5"></div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationsPage;
