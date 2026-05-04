import React, { useState } from 'react';
import { User, Shield, Bell } from 'lucide-react';
import { theme } from '../Theme';

const SettingsPage = ({ user }) => {
  const [loginAlerts, setLoginAlerts] = useState(true);
  const [emailNotif, setEmailNotif] = useState(false);

  return (
    <div className="space-y-8 animate-fadeIn max-w-6xl">
      {/* Profile Section */}
      <div className="p-10 rounded-[30px] bg-[#164E75] shadow-xl border border-white/5 space-y-8">
        <div className="flex items-center gap-4 text-white">
          <User size={32} className="text-[#B8DDF5]" />
          <h2 className="text-3xl font-bold">Profile User</h2>
        </div>
        
        <div className="space-y-6">
          <div className="space-y-3">
            <label className="text-white text-xl font-medium ml-2">Nama</label>
            <input 
              type="text" 
              defaultValue={user?.name || 'User'}
              className="w-full bg-[#B8DDF5] p-5 rounded-2xl text-[#1F5E88] text-xl font-bold outline-none placeholder:text-[#1F5E88]/50"
            />
          </div>
          <div className="space-y-3">
            <label className="text-white text-xl font-medium ml-2">Email</label>
            <input 
              type="email" 
              defaultValue={user?.email || 'user@email.com'}
              className="w-full bg-[#B8DDF5] p-5 rounded-2xl text-[#1F5E88] text-xl font-bold outline-none placeholder:text-[#1F5E88]/50"
            />
          </div>
        </div>
      </div>

      {/* Security Section */}
      <div className="p-10 rounded-[30px] bg-[#164E75] shadow-xl border border-white/5 space-y-8">
        <div className="flex items-center gap-4 text-white">
          <Shield size={32} className="text-[#B8DDF5]" />
          <h2 className="text-3xl font-bold">Keamanan</h2>
        </div>

        <div className="space-y-8">
          {/* 2FA */}
          <div className="flex justify-between items-center pb-8 border-b border-white/10">
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">Two-Factor Authentication</h3>
              <p className="text-lg text-white/50">Tambahkan lapisan keamanan ekstra</p>
            </div>
            <button className="bg-[#B8DDF5] text-[#1F5E88] px-10 py-4 rounded-xl font-black text-xl shadow-lg hover:scale-105 transition-transform active:scale-95">
              Aktifkan
            </button>
          </div>

          {/* Login Alerts */}
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">Login Alerts</h3>
              <p className="text-lg text-white/50">Dapatkan notifikasi saat login dari device baru</p>
            </div>
            <button 
              onClick={() => setLoginAlerts(!loginAlerts)}
              className={`w-20 h-10 rounded-full transition-colors relative ${loginAlerts ? 'bg-[#4AA9FF]' : 'bg-white/20'}`}
            >
              <div className={`absolute top-1 w-8 h-8 bg-white rounded-full transition-all ${loginAlerts ? 'right-1' : 'left-1 shadow-md'}`}></div>
            </button>
          </div>
        </div>
      </div>

      {/* Notifications Section */}
      <div className="p-10 rounded-[30px] bg-[#164E75] shadow-xl border border-white/5 space-y-8">
        <div className="flex items-center gap-4 text-white">
          <Bell size={32} className="text-[#B8DDF5]" />
          <h2 className="text-3xl font-bold">Notifications</h2>
        </div>

        <div className="flex justify-between items-center">
          <h3 className="text-2xl font-bold text-white">Email Notifications</h3>
          <button 
            onClick={() => setEmailNotif(!emailNotif)}
            className={`w-20 h-10 rounded-full transition-colors relative ${emailNotif ? 'bg-[#4AA9FF]' : 'bg-white/20'}`}
          >
            <div className={`absolute top-1 w-8 h-8 bg-white rounded-full transition-all ${emailNotif ? 'right-1' : 'left-1 shadow-md'}`}></div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
