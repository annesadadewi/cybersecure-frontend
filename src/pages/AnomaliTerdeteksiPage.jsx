import React, { useState } from 'react';
import { theme } from '../Theme';
import { ShieldAlert, AlertTriangle, XCircle, X, Shield, Check, RefreshCw, FileText, ExternalLink } from 'lucide-react';

const AnomaliTerdeteksiPage = () => {
  const [showLogModal, setShowLogModal] = useState(false);
  const [showMitigationModal, setShowMitigationModal] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState(0);
  const [incidentStatus, setIncidentStatus] = useState('Open');
  const [mitigationLogs, setMitigationLogs] = useState([]);
  
  // Mitigasi state
  const [blockIp, setBlockIp] = useState(true);
  const [forceLogout, setForceLogout] = useState(false);
  const [twoFactor, setTwoFactor] = useState(true);
  const [mitigating, setMitigating] = useState(false);
  const [mitigationSuccess, setMitigationSuccess] = useState(false);

  const handleApplyMitigation = () => {
    setMitigating(true);
    setTimeout(() => {
      setMitigating(false);
      setMitigationSuccess(true);
      const enabledActions = [
        blockIp && 'Blokir IP Penyerang Otomatis',
        forceLogout && 'Paksa Log Out Semua Perangkat',
        twoFactor && 'Batasi Akses Endpoint Sensitif',
      ].filter(Boolean);

      setIncidentStatus('Mitigasi Diterapkan');
      setMitigationLogs((prev) => [
        {
          id: Date.now(),
          time: new Date().toLocaleTimeString('id-ID', { hour12: false }),
          actor: 'Admin',
          actions: enabledActions.length ? enabledActions.join(', ') : 'Tidak ada aksi dipilih',
          result: 'Berhasil',
        },
        ...prev,
      ]);

      setTimeout(() => {
        setMitigationSuccess(false);
        setShowMitigationModal(false);
      }, 2000);
    }, 1500);
  };

  const logs = [
    { time: '10:24:15 WIB', activity: 'Brute-Force Login', location: '182.253.42.9 (Jakarta)', rec: 'Saran AI: Segera blokir IP permanen dan reset kata sandi akun terkait.' },
    { time: '09:15:30 WIB', activity: 'Deteksi Anomali Geografis', location: '103.14.22.18 (Singapura)', rec: 'Saran AI: Paksa logout sesi aktif dan minta verifikasi ulang saat login.' },
    { time: '07:05:12 WIB', activity: 'Upaya Akses API Tidak Sah', location: '202.89.24.102 (Rusia)', rec: 'Saran AI: Cabut akses token sementara dan lakukan rotasi Secret Key API.' },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="p-8 rounded-3xl shadow-xl flex items-center gap-6 border border-red-500/20" style={{ backgroundColor: theme.sidebar }}>
        <div className="p-4 bg-red-500/20 rounded-2xl shrink-0">
          <ShieldAlert size={40} className="text-red-400" />
        </div>
        <div>
          <h2 className="text-3xl font-black text-white">Anomali Terdeteksi</h2>
          <p className="text-red-200 mt-1">Analisis mendalam dari 24 kasus anomali keamanan yang perlu ditinjau</p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Peringatan Menengah */}
        <div className="bg-white/5 rounded-3xl p-6 border border-white/10 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="text-yellow-400" />
              <h3 className="text-lg font-bold text-white">Peringatan Menengah (18 Kasus)</h3>
            </div>
            <p className="text-gray-300 text-sm mb-6 leading-relaxed">
              Akses login tidak biasa terdeteksi dari perangkat baru atau lokasi geografis yang tidak biasa digunakan oleh pengguna.
            </p>
          </div>
          <button 
            onClick={() => setShowLogModal(true)}
            className="w-fit px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-sm font-semibold transition-all shadow-md active:scale-95"
          >
            Tinjau Log
          </button>
        </div>

        {/* Card 2: Ancaman Kritis */}
        <div className="bg-red-500/10 rounded-3xl p-6 border border-red-500/20 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <XCircle className="text-red-400" />
              <h3 className="text-lg font-bold text-white">Ancaman Kritis (6 Kasus)</h3>
            </div>
            <p className="text-gray-300 text-sm mb-6 leading-relaxed">
              Upaya brute-force intensif terdeteksi pada database keuangan utama. Sistem mendeteksi lonjakan kegagalan otentikasi.
            </p>
          </div>
          <button 
            onClick={() => setShowMitigationModal(true)}
            className="w-fit px-5 py-2.5 bg-red-500/20 hover:bg-red-500/30 text-red-100 rounded-xl text-sm font-semibold transition-all border border-red-500/50 shadow-md active:scale-95"
          >
            Tindakan Mitigasi
          </button>
        </div>
      </div>

      {/* Modal 1: TINJAU LOG */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#112D42] border border-white/10 rounded-2xl w-full max-w-4xl p-7 md:p-8 shadow-2xl relative animate-scaleUp">
            {/* Header */}
            <div className="flex justify-between items-center mb-7 pb-5 border-b border-white/10">
              <div className="flex items-center gap-3">
                <AlertTriangle className="text-yellow-400" size={24} />
                <div>
                  <h3 className="text-xl font-bold text-white">Log Aktivitas Mencurigakan</h3>
                  <p className="text-xs text-white/60 mt-1">Alur cepat: cek insiden, jalankan mitigasi, lalu update status insiden.</p>
                </div>
              </div>
              <button 
                onClick={() => setShowLogModal(false)}
                className="text-white/60 hover:text-white bg-white/5 hover:bg-white/10 p-1.5 rounded-lg transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Content Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-white/60 text-xs uppercase font-semibold">
                    <th className="py-3.5 px-3">Waktu</th>
                    <th className="py-3.5 px-3">Aktivitas</th>
                    <th className="py-3.5 px-3">Lokasi / IP</th>
                    <th className="py-3.5 px-3">Rekomendasi AI</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-sm text-gray-200">
                  {logs.map((log, index) => (
                    <tr
                      key={index}
                      onClick={() => setSelectedIncident(index)}
                      className={`hover:bg-white/5 transition-colors cursor-pointer ${selectedIncident === index ? 'bg-white/5' : ''}`}
                    >
                      <td className="py-4 px-3 font-mono text-xs text-blue-300">{log.time}</td>
                      <td className="py-4 px-3 font-bold text-red-300">{log.activity}</td>
                      <td className="py-4 px-3 font-mono text-xs">{log.location}</td>
                      <td className="py-4 px-3 text-xs italic text-yellow-200/90 leading-relaxed">{log.rec}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 p-4 bg-white/5 border border-white/10 rounded-xl text-xs text-gray-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-white/70">Insiden dipilih:</span>
                <span className="font-semibold text-white">{logs[selectedIncident].activity}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/70">Status insiden:</span>
                <span className="font-semibold text-blue-300">{incidentStatus}</span>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-7 flex flex-wrap justify-end gap-3 pt-5 border-t border-white/10">
              <button
                onClick={() => setIncidentStatus('False Positive')}
                className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl text-xs transition-all flex items-center gap-2"
              >
                <FileText size={14} />
                Tandai False Positive
              </button>
              <button
                onClick={() => {
                  setIncidentStatus('In Progress');
                  setShowLogModal(false);
                  setShowMitigationModal(true);
                }}
                className="px-4 py-2.5 bg-[#4C92C3] hover:bg-[#3d7ea9] text-white font-semibold rounded-xl text-xs transition-all flex items-center gap-2"
              >
                <ExternalLink size={14} />
                Buka Tindakan Mitigasi
              </button>
              <button 
                onClick={() => setShowLogModal(false)}
                className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl text-sm transition-all"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: TINDAKAN MITIGASI */}
      {showMitigationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#112D42] border border-white/10 rounded-2xl w-full max-w-2xl p-7 md:p-8 shadow-2xl relative animate-scaleUp">
            {/* Header */}
            <div className="flex justify-between items-center mb-7 pb-5 border-b border-white/10">
              <div className="flex items-center gap-3">
                <Shield className="text-red-400" size={24} />
                <div>
                  <h3 className="text-xl font-bold text-white">Tindakan Mitigasi Cepat</h3>
                  <p className="text-xs text-white/60 mt-1">Setelah diterapkan, hasil aksi akan tercatat di Log Mitigasi.</p>
                </div>
              </div>
              <button 
                onClick={() => setShowMitigationModal(false)}
                className="text-white/60 hover:text-white bg-white/5 hover:bg-white/10 p-1.5 rounded-lg transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Content Form */}
            {mitigationSuccess ? (
              <div className="flex flex-col items-center justify-center py-8 text-center animate-fadeIn">
                <div className="w-16 h-16 rounded-full bg-green-500/20 border border-green-500/50 flex items-center justify-center mb-4">
                  <Check className="text-green-400" size={32} />
                </div>
                <h4 className="text-lg font-bold text-white mb-2">Mitigasi Berhasil Diterapkan</h4>
                <p className="text-xs text-gray-400">Aturan firewall diperbarui & sesi pengguna telah diamankan.</p>
              </div>
            ) : (
              <div className="space-y-6">
                <p className="text-xs text-gray-300 leading-relaxed">
                  Pilih aksi penangkalan cepat di bawah ini untuk mengamankan infrastruktur server secara realtime.
                </p>

                {/* Toggle 1 */}
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                  <div>
                    <h4 className="text-sm font-bold text-white">Blokir IP Penyerang Otomatis</h4>
                    <p className="text-[10px] text-gray-400">Menolak semua request dari IP mencurigakan.</p>
                  </div>
                  <button 
                    onClick={() => setBlockIp(!blockIp)}
                    className={`w-12 h-6 rounded-full transition-colors relative flex items-center p-1 cursor-pointer ${blockIp ? 'bg-[#4C92C3]' : 'bg-white/20'}`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white transition-transform shadow ${blockIp ? 'translate-x-6' : 'translate-x-0'}`}></div>
                  </button>
                </div>

                {/* Toggle 2 */}
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                  <div>
                    <h4 className="text-sm font-bold text-white">Paksa Log Out Semua Perangkat</h4>
                    <p className="text-[10px] text-gray-400">Menghapus token sesi aktif semua user terkait.</p>
                  </div>
                  <button 
                    onClick={() => setForceLogout(!forceLogout)}
                    className={`w-12 h-6 rounded-full transition-colors relative flex items-center p-1 cursor-pointer ${forceLogout ? 'bg-[#4C92C3]' : 'bg-white/20'}`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white transition-transform shadow ${forceLogout ? 'translate-x-6' : 'translate-x-0'}`}></div>
                  </button>
                </div>

                {/* Toggle 3 */}
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                  <div>
                    <h4 className="text-sm font-bold text-white">Batasi Akses Endpoint Sensitif</h4>
                    <p className="text-[10px] text-gray-400">Membatasi akses rute database/admin.</p>
                  </div>
                  <button 
                    onClick={() => setTwoFactor(!twoFactor)}
                    className={`w-12 h-6 rounded-full transition-colors relative flex items-center p-1 cursor-pointer ${twoFactor ? 'bg-[#4C92C3]' : 'bg-white/20'}`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white transition-transform shadow ${twoFactor ? 'translate-x-6' : 'translate-x-0'}`}></div>
                  </button>
                </div>

                {/* Log Mitigasi */}
                <div className="p-4 bg-white/5 border border-white/10 rounded-xl space-y-2">
                  <h4 className="text-sm font-bold text-white">Log Mitigasi Terbaru</h4>
                  {mitigationLogs.length === 0 ? (
                    <p className="text-xs text-gray-400">Belum ada aksi mitigasi yang dijalankan untuk insiden ini.</p>
                  ) : (
                    mitigationLogs.slice(0, 2).map((entry) => (
                      <div key={entry.id} className="text-xs text-gray-200 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-white/80">{entry.time} WIB • {entry.actor}</span>
                          <span className="text-green-300 font-semibold">{entry.result}</span>
                        </div>
                        <p className="text-gray-300">{entry.actions}</p>
                      </div>
                    ))
                  )}
                </div>

                {/* Execute Button */}
                <div className="pt-5 border-t border-white/10 flex flex-wrap justify-end gap-3">
                  <button
                    disabled={mitigating}
                    onClick={() => setIncidentStatus('Resolved')}
                    className="px-4 py-2.5 bg-green-500/20 hover:bg-green-500/30 text-green-100 rounded-xl text-xs font-bold transition-all"
                  >
                    Tandai Selesai
                  </button>
                  <button 
                    disabled={mitigating}
                    onClick={() => setShowMitigationModal(false)}
                    className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-all"
                  >
                    Batal
                  </button>
                  <button 
                    disabled={mitigating}
                    onClick={handleApplyMitigation}
                    className="px-5 py-2.5 bg-[#4C92C3] hover:bg-[#3d7ea9] disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-md active:scale-95"
                  >
                    {mitigating && <RefreshCw size={14} className="animate-spin" />}
                    {mitigating ? 'Memproses...' : 'Terapkan Mitigasi'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AnomaliTerdeteksiPage;
