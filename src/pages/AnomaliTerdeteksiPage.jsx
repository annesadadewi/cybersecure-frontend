import React from 'react';
import { theme } from '../Theme';
import { ShieldAlert, AlertTriangle, XCircle } from 'lucide-react';

const AnomaliTerdeteksiPage = () => {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="p-8 rounded-3xl shadow-xl flex items-center gap-6 border border-red-500/20" style={{ backgroundColor: theme.sidebar }}>
        <div className="p-4 bg-red-500/20 rounded-2xl">
          <ShieldAlert size={40} className="text-red-400" />
        </div>
        <div>
          <h2 className="text-3xl font-black text-white">Anomali Terdeteksi</h2>
          <p className="text-red-200 mt-1">Analisis mendalam dari 24 kasus anomali keamanan yang perlu ditinjau</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white/5 rounded-3xl p-6 border border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="text-yellow-400" />
            <h3 className="text-lg font-bold text-white">Peringatan Menengah (18 Kasus)</h3>
          </div>
          <p className="text-gray-300 text-sm mb-4">Akses login tidak biasa dari lokasi yang belum pernah dikunjungi sebelumnya.</p>
          <button className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-semibold transition-all">Tinjau Log</button>
        </div>

        <div className="bg-red-500/10 rounded-3xl p-6 border border-red-500/20">
          <div className="flex items-center gap-3 mb-4">
            <XCircle className="text-red-400" />
            <h3 className="text-lg font-bold text-white">Ancaman Kritis (6 Kasus)</h3>
          </div>
          <p className="text-gray-300 text-sm mb-4">Upaya brute-force terdeteksi pada database keuangan utama. Sistem telah memblokir IP penyerang.</p>
          <button className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-100 rounded-lg text-sm font-semibold transition-all border border-red-500/50">Tindakan Mitigasi</button>
        </div>
      </div>
    </div>
  );
};

export default AnomaliTerdeteksiPage;
