import React, { useEffect, useState } from 'react';
import { ShieldAlert, AlertTriangle, XCircle, Shield, RefreshCw } from 'lucide-react';
import { theme } from '../Theme';
import { anomalyService } from '../api/anomalies';
import SuspiciousActivityModal from '../components/anomaly/SuspiciousActivityModal';

const AnomaliTerdeteksiPage = () => {
  const [showLogModal, setShowLogModal] = useState(false);
  const [showMitigationModal, setShowMitigationModal] = useState(false);
  const [metrics, setMetrics] = useState({ high_risk: 0, medium_risk: 0, low_risk: 0, total: 0 });

  useEffect(() => {
    anomalyService.getMetrics().then(setMetrics).catch(console.error);
  }, []);

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="p-8 rounded-3xl shadow-xl flex items-center gap-6 border border-red-500/20" style={{ backgroundColor: theme.sidebar }}>
        <div className="p-4 bg-red-500/20 rounded-2xl shrink-0">
          <ShieldAlert size={40} className="text-red-400" />
        </div>
        <div>
          <h2 className="text-3xl font-black text-white">Anomali Terdeteksi</h2>
          <p className="text-red-200 mt-1">
            {metrics.total} kasus ancaman — {metrics.high_risk} High Risk, {metrics.medium_risk} Medium Risk,{' '}
            {metrics.low_risk} Low Risk
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'High Risk', val: metrics.high_risk, color: 'text-red-400 border-red-500/30 bg-red-500/10' },
          { label: 'Medium Risk', val: metrics.medium_risk, color: 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10' },
          { label: 'Low Risk', val: metrics.low_risk, color: 'text-blue-300 border-blue-500/30 bg-blue-500/10' },
        ].map((m) => (
          <div key={m.label} className={`rounded-2xl p-5 border ${m.color}`}>
            <p className="text-xs uppercase font-bold opacity-80">{m.label}</p>
            <p className="text-3xl font-black mt-1">{m.val}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white/5 rounded-3xl p-6 border border-white/10 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="text-yellow-400" />
              <h3 className="text-lg font-bold text-white">Peringatan Menengah ({metrics.medium_risk} Kasus)</h3>
            </div>
            <p className="text-gray-300 text-sm mb-6 leading-relaxed">
              Akses login tidak biasa, anomali geografis, dan pola akses API mencurigakan dari berbagai wilayah.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowLogModal(true)}
            className="w-fit px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-sm font-semibold transition-all cursor-pointer"
          >
            Tinjau Log Aktivitas
          </button>
        </div>

        <div className="bg-red-500/10 rounded-3xl p-6 border border-red-500/20 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <XCircle className="text-red-400" />
              <h3 className="text-lg font-bold text-white">Ancaman Kritis ({metrics.high_risk} Kasus)</h3>
            </div>
            <p className="text-gray-300 text-sm mb-6 leading-relaxed">
              Brute-force, retur bermasalah, dan indikasi dobel refund memerlukan tindakan segera.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowMitigationModal(true)}
            className="w-fit px-5 py-2.5 bg-red-500/20 hover:bg-red-500/30 text-red-100 rounded-xl text-sm font-semibold border border-red-500/50 cursor-pointer"
          >
            Tindakan Mitigasi
          </button>
        </div>
      </div>

      <SuspiciousActivityModal open={showLogModal} onClose={() => setShowLogModal(false)} />

      {showMitigationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#112D42] border border-white/10 rounded-2xl w-full max-w-lg p-8 shadow-2xl text-white">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="text-red-400" size={24} />
              <h3 className="text-xl font-bold">Tindakan Mitigasi Cepat</h3>
            </div>
            <p className="text-sm text-white/70 mb-6">
              Buka log aktivitas untuk memilih insiden spesifik, lalu jalankan blokir IP, review, atau abaikan.
            </p>
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => setShowMitigationModal(false)}
                className="px-4 py-2 rounded-xl bg-white/10 text-sm font-bold cursor-pointer"
              >
                Tutup
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowMitigationModal(false);
                  setShowLogModal(true);
                }}
                className="px-4 py-2 rounded-xl bg-[#4C92C3] text-sm font-bold flex items-center gap-2 cursor-pointer"
              >
                <RefreshCw size={14} />
                Buka Log
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnomaliTerdeteksiPage;











