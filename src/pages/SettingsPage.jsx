import React, { useState } from 'react';
import { User, Shield, Bell } from 'lucide-react';
import { theme } from '../Theme';

const SettingsPage = ({ user }) => {
  const [loginAlerts, setLoginAlerts] = useState(true);
  const [emailNotif, setEmailNotif] = useState(false);

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn max-w-4xl">
      {/* Profile Section */}
      <div className="p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-gradient-to-b from-[#164E75] to-[#0F3652] shadow-xl border border-white/5 space-y-6">
        <div className="flex items-center gap-3 text-white">
          <User size={24} className="text-[#B8DDF5]" />
          <h2 className="text-xl sm:text-2xl font-bold">Profile User</h2>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-white text-sm font-semibold ml-1">Nama</label>
            <input 
              type="text" 
              defaultValue={user?.name || 'User'}
              className="w-full bg-[#DEF2FF] px-4 py-3 rounded-xl text-[#1F5E88] text-base font-bold outline-none border border-white/10 placeholder:text-[#1F5E88]/50"
            />
          </div>
          <div className="space-y-2">
            <label className="text-white text-sm font-semibold ml-1">Email</label>
            <input 
              type="email" 
              defaultValue={user?.email || 'user@email.com'}
              className="w-full bg-[#DEF2FF] px-4 py-3 rounded-xl text-[#1F5E88] text-base font-bold outline-none border border-white/10 placeholder:text-[#1F5E88]/50"
            />
          </div>
        </div>
      </div>

      {/* Security Section */}
      <div className="p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-gradient-to-b from-[#164E75] to-[#0F3652] shadow-xl border border-white/5 space-y-6">
        <div className="flex items-center gap-3 text-white">
          <Shield size={24} className="text-[#B8DDF5]" />
          <h2 className="text-xl sm:text-2xl font-bold">Keamanan</h2>
        </div>

        <div className="space-y-6">
          {/* 2FA */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white mb-0.5">Two-Factor Authentication</h3>
              <p className="text-xs sm:text-sm text-white/50">Tambahkan lapisan keamanan ekstra pada akun Anda</p>
            </div>
            <button className="bg-[#B8DDF5] hover:bg-white text-[#1F5E88] px-6 py-2.5 rounded-lg font-bold text-xs sm:text-sm shadow-md hover:scale-105 transition-all active:scale-95 cursor-pointer w-full sm:w-auto">
              Aktifkan
            </button>
          </div>

          {/* Login Alerts */}
          <div className="flex justify-between items-center gap-4">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white mb-0.5">Login Alerts</h3>
              <p className="text-xs sm:text-sm text-white/50">Dapatkan notifikasi saat login dari device baru</p>
            </div>
            <button 
              onClick={() => setLoginAlerts(!loginAlerts)}
              className={`w-12 h-6.5 rounded-full transition-colors relative shrink-0 cursor-pointer ${loginAlerts ? 'bg-[#4AA9FF]' : 'bg-white/20'}`}
            >
              <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-all ${loginAlerts ? 'right-0.5' : 'left-0.5 shadow-md'}`}></div>
            </button>
          </div>
        </div>
      </div>

      {/* Notifications Section */}
      <div className="p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-gradient-to-b from-[#164E75] to-[#0F3652] shadow-xl border border-white/5 space-y-6">
        <div className="flex items-center gap-3 text-white">
          <Bell size={24} className="text-[#B8DDF5]" />
          <h2 className="text-xl sm:text-2xl font-bold">Notifications</h2>
        </div>

        <div className="flex justify-between items-center gap-4">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white mb-0.5">Email Notifications</h3>
            <p className="text-xs sm:text-sm text-white/50">Terima ringkasan transaksi mingguan via email</p>
          </div>
          <button 
            onClick={() => setEmailNotif(!emailNotif)}
            className={`w-12 h-6.5 rounded-full transition-colors relative shrink-0 cursor-pointer ${emailNotif ? 'bg-[#4AA9FF]' : 'bg-white/20'}`}
          >
            <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-all ${emailNotif ? 'right-0.5' : 'left-0.5 shadow-md'}`}></div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
