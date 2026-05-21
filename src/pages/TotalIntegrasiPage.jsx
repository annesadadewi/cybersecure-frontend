import React from 'react';
import { theme } from '../Theme';
import { Activity, Shield, Laptop, Smartphone, Mail, Database } from 'lucide-react';

const TotalIntegrasiPage = () => {
  const integrations = [
    { name: 'Email Server Utama', status: 'Aktif', type: 'Mail', icon: Mail },
    { name: 'Database Keuangan', status: 'Aktif', type: 'Database', icon: Database },
    { name: 'Sistem Pembayaran', status: 'Aktif', type: 'Payment', icon: Shield },
    { name: 'Aplikasi Mobile', status: 'Aktif', type: 'Mobile', icon: Smartphone },
    { name: 'Web Portal', status: 'Peringatan', type: 'Web', icon: Laptop },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="p-8 rounded-3xl shadow-xl flex items-center gap-6 border border-white/10" style={{ backgroundColor: theme.sidebar }}>
        <div className="p-4 bg-white/10 rounded-2xl">
          <Activity size={40} className="text-[#B8DDF5]" />
        </div>
        <div>
          <h2 className="text-3xl font-black text-white">Total Integrasi</h2>
          <p className="text-[#B8DDF5] mt-1">Detail 12 akun dan sistem yang terhubung dengan pengawasan CyberSecure</p>
        </div>
      </div>
      
      <div className="bg-white/5 rounded-3xl p-6 border border-white/10">
        <h3 className="text-xl font-bold text-white mb-6">Daftar Sistem Terintegrasi</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {integrations.map((item, i) => (
            <div key={i} className="bg-white/10 p-5 rounded-2xl border border-white/5 hover:bg-white/20 transition-all flex items-center gap-4 cursor-pointer">
              <div className="p-3 bg-white/10 rounded-xl">
                <item.icon size={24} className="text-white" />
              </div>
              <div>
                <h4 className="font-bold text-white">{item.name}</h4>
                <p className={`text-sm font-medium ${item.status === 'Aktif' ? 'text-green-400' : 'text-yellow-400'}`}>Status: {item.status}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TotalIntegrasiPage;
