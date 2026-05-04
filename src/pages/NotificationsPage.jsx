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
    <div className="space-y-10 animate-fadeIn">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h2 className="text-5xl font-bold text-white tracking-tight">Notification</h2>
          <div className="w-10 h-10 bg-[#EF4444] rounded-full flex items-center justify-center text-white text-2xl font-black shadow-lg">
            4
          </div>
        </div>
        <div className="flex gap-4">
          <button className="bg-[#B8DDF5]/20 text-[#B8DDF5] px-6 py-3 rounded-xl font-bold border border-[#B8DDF5]/30 hover:bg-[#B8DDF5]/30 transition-all">
            Mark all read
          </button>
          <button className="bg-[#B8DDF5] text-[#1F5E88] px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg hover:scale-105 transition-all">
            <Filter size={20} />
            Filter
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-6">
        {notifications.map((notif, i) => (
          <div 
            key={i} 
            className="flex items-center justify-between group cursor-pointer"
          >
            <div className="flex items-center gap-8">
              {/* Icon */}
              <div className="w-16 h-16 bg-[#B8DDF5] rounded-xl flex items-center justify-center text-[#1F5E88] shadow-inner shrink-0">
                <notif.icon size={32} />
              </div>

              {/* Content */}
              <div>
                <h3 
                  className="text-2xl font-bold mb-1"
                  style={{ color: notif.type === 'Security Alert' ? '#EF4444' : '#B8DDF5' }}
                >
                  {notif.type}
                </h3>
                <p className="text-xl text-white/60 font-medium">{notif.message}</p>
              </div>
            </div>

            {/* Time & Badge */}
            <div className="flex items-center gap-6">
              <span className="text-lg text-white/40 font-bold">{notif.time}</span>
              {notif.unread && (
                <div className="w-3.5 h-3.5 bg-[#4AA9FF] rounded-full shadow-[0_0_10px_#4AA9FF]"></div>
              )}
              {!notif.unread && <div className="w-3.5 h-3.5"></div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationsPage;
