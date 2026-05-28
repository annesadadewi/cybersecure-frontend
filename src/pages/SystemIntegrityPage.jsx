import React, { useState } from 'react';
import { theme } from '../Theme';
import { CheckCircle, ShieldCheck, Activity, Cpu, X, RefreshCw, Server, Zap } from 'lucide-react';

const SystemIntegrityPage = () => {
  const [activeModal, setActiveModal] = useState('none'); // 'none', 'firewall', 'serverLoad'
  
  // States for scanner
  const [scanning, setScanning] = useState(false);
  const [scanFinished, setScanFinished] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);

  // States for server optimization
  const [optimizing, setOptimizing] = useState(false);
  const [optimizeFinished, setOptimizeFinished] = useState(false);

  const startAiScan = () => {
    setScanning(true);
    setScanFinished(false);
    setScanProgress(0);
    
    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setScanning(false);
          setScanFinished(true);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const runOptimization = () => {
    setOptimizing(true);
    setOptimizeFinished(false);
    setTimeout(() => {
      setOptimizing(false);
      setOptimizeFinished(true);
    }, 1500);
  };

  const closeModal = () => {
    setActiveModal('none');
    setScanning(false);
    setScanFinished(false);
    setScanProgress(0);
    setOptimizing(false);
    setOptimizeFinished(false);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn">
      {/* Banner */}
      <div 
        style={{ backgroundColor: theme.sidebar }} 
        className="p-6 sm:p-8 rounded-2xl sm:rounded-3xl shadow-xl flex items-center gap-4 sm:gap-6 border border-green-500/20 bg-gradient-to-br from-[#1F5E88] to-[#123A57]"
      >
        <div className="p-3 sm:p-4 bg-green-500/20 rounded-xl sm:rounded-2xl shrink-0">
          <CheckCircle size={40} className="text-green-400" />
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-white">System Integrity: 99.9%</h2>
          <p className="text-green-200 text-xs sm:text-sm mt-1">Status kesehatan menyeluruh dari sistem keamanan Anda beroperasi dengan sangat optimal</p>
        </div>
      </div>
      
      {/* Details Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Firewall Card */}
        <div 
          onClick={() => setActiveModal('firewall')}
          className="bg-white/5 hover:bg-white/10 rounded-2xl sm:rounded-3xl p-5 sm:p-6 border border-white/10 flex flex-col items-center text-center transition-all duration-300 hover:scale-[1.02] hover:border-green-500/20 shadow-md hover:shadow-xl cursor-pointer"
        >
          <div className="p-3 sm:p-4 bg-green-500/10 rounded-full mb-3">
            <ShieldCheck size={28} className="text-green-400" />
          </div>
          <h3 className="text-sm sm:text-base font-bold text-white mb-1">Firewall Status</h3>
          <p className="text-green-300 font-bold text-xl sm:text-2xl">Active</p>
          <p className="text-gray-400 text-[10px] sm:text-xs mt-1">Diverting 45 malicious requests/min</p>
          <span className="text-[10px] text-blue-300 mt-3 font-semibold hover:underline">Klik detail & scan</span>
        </div>

        {/* Server Load Card */}
        <div 
          onClick={() => setActiveModal('serverLoad')}
          className="bg-white/5 hover:bg-white/10 rounded-2xl sm:rounded-3xl p-5 sm:p-6 border border-white/10 flex flex-col items-center text-center transition-all duration-300 hover:scale-[1.02] hover:border-blue-500/20 shadow-md hover:shadow-xl cursor-pointer"
        >
          <div className="p-3 sm:p-4 bg-blue-500/10 rounded-full mb-3">
            <Cpu size={28} className="text-blue-400" />
          </div>
          <h3 className="text-sm sm:text-base font-bold text-white mb-1">Server Load</h3>
          <p className="text-white font-bold text-xl sm:text-2xl">14%</p>
          <p className="text-gray-400 text-[10px] sm:text-xs mt-1">Normal operating capacity</p>
          <span className="text-[10px] text-blue-300 mt-3 font-semibold hover:underline">Klik detail & optimasi</span>
        </div>

        {/* Uptime Card (Non-interactive) */}
        <div className="bg-white/5 rounded-2xl sm:rounded-3xl p-5 sm:p-6 border border-white/10 flex flex-col items-center text-center col-span-1 sm:col-span-2 lg:col-span-1">
          <div className="p-3 sm:p-4 bg-purple-500/10 rounded-full mb-3">
            <Activity size={28} className="text-purple-400" />
          </div>
          <h3 className="text-sm sm:text-base font-bold text-white mb-1">Uptime</h3>
          <p className="text-white font-bold text-xl sm:text-2xl">99.99%</p>
          <p className="text-gray-400 text-[10px] sm:text-xs mt-1">Last downtime: 4 months ago</p>
        </div>
      </div>

      {/* Modal 1: FIREWALL STATUS & SCANNER */}
      {activeModal === 'firewall' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#112D42] border border-white/10 rounded-3xl w-full max-w-3xl p-8 md:p-10 shadow-2xl relative animate-scaleUp">
            <div className="flex justify-between items-center mb-8 pb-6 border-b border-white/10">
              <div className="flex items-center gap-3">
                <ShieldCheck className="text-green-400" size={24} />
                <h3 className="text-xl font-bold text-white font-poppins">Firewall & Shield Status</h3>
              </div>
              <button 
                onClick={closeModal}
                className="text-white/60 hover:text-white bg-white/5 hover:bg-white/10 p-1.5 rounded-lg transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-8">
              <div className="p-6 bg-white/5 border border-white/5 rounded-xl text-sm space-y-3">
                <div className="flex justify-between"><span className="text-gray-400">Proteksi Real-time:</span><span className="text-green-400 font-bold">AKTIF & STABIL</span></div>
                <div className="flex justify-between"><span className="text-gray-400">Penyaringan Request:</span><span className="text-white">Layer-7 WAF</span></div>
                <div className="flex justify-between"><span className="text-gray-400">Ancaman Terblokir (Hari ini):</span><span className="text-red-400 font-bold">642 Requests</span></div>
              </div>

              {scanning ? (
                <div className="space-y-4 animate-fadeIn">
                  <div className="flex justify-between text-sm text-blue-300 font-semibold">
                    <span>Mencari celah keamanan otomatis via AI...</span>
                    <span>{scanProgress}%</span>
                  </div>
                  <div className="w-full bg-white/10 h-3 rounded-full overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-teal-400 to-blue-500 h-full rounded-full transition-all duration-200"
                      style={{ width: `${scanProgress}%` }}
                    ></div>
                  </div>
                </div>
              ) : scanFinished ? (
                <div className="p-5 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center gap-3 animate-fadeIn">
                  <CheckCircle className="text-green-400 shrink-0" size={24} />
                  <div>
                    <h4 className="text-base font-bold text-white">Sistem Aman</h4>
                    <p className="text-xs text-green-300 mt-0.5">Semua parameter keamanan diperiksa dan tidak ditemukan celah.</p>
                  </div>
                </div>
              ) : (
                <div className="text-center p-6 bg-white/5 rounded-xl border border-white/5">
                  <p className="text-sm text-gray-300">Jalankan AI Scanner untuk melakukan audit ancaman saat ini secara instant.</p>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-6 border-t border-white/10">
                <button 
                  onClick={closeModal}
                  className="px-5 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl text-sm font-bold transition-all"
                >
                  Tutup
                </button>
                <button 
                  disabled={scanning}
                  onClick={startAiScan}
                  className="px-6 py-3 bg-[#4C92C3] hover:bg-[#3d7ea9] text-white rounded-xl text-sm font-bold flex items-center gap-2 transition-all shadow-md active:scale-95 disabled:opacity-50"
                >
                  <RefreshCw size={14} className={scanning ? 'animate-spin' : ''} />
                  Scan Celah Keamanan (AI Scanner)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: SERVER LOAD DETAILS & OPTIMIZE */}
      {activeModal === 'serverLoad' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#112D42] border border-white/10 rounded-3xl w-full max-w-3xl p-8 md:p-10 shadow-2xl relative animate-scaleUp">
            <div className="flex justify-between items-center mb-8 pb-6 border-b border-white/10">
              <div className="flex items-center gap-3">
                <Server className="text-blue-400" size={24} />
                <h3 className="text-xl font-bold text-white font-poppins">Metrik Server Load</h3>
              </div>
              <button 
                onClick={closeModal}
                className="text-white/60 hover:text-white bg-white/5 hover:bg-white/10 p-1.5 rounded-lg transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-8">
              {/* Performance Metrics */}
              <div className="space-y-6">
                {/* CPU Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-semibold">
                    <span className="text-gray-300">Penggunaan CPU (Core 1-8)</span>
                    <span className="text-blue-300">14%</span>
                  </div>
                  <div className="w-full bg-white/10 h-3 rounded-full overflow-hidden">
                    <div className="bg-blue-400 h-full rounded-full" style={{ width: '14%' }}></div>
                  </div>
                </div>

                {/* RAM Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-semibold">
                    <span className="text-gray-300">Penggunaan RAM</span>
                    <span className="text-teal-300">42% (6.7 GB / 16 GB)</span>
                  </div>
                  <div className="w-full bg-white/10 h-3 rounded-full overflow-hidden">
                    <div className="bg-teal-400 h-full rounded-full" style={{ width: '42%' }}></div>
                  </div>
                </div>

                <div className="flex justify-between p-5 bg-white/5 border border-white/5 rounded-xl text-sm">
                  <span className="text-gray-400">Disk I/O Speed:</span>
                  <span className="text-green-400 font-bold">Optimal (Sangat Rendah)</span>
                </div>
              </div>

              {optimizeFinished && (
                <div className="p-5 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center gap-3 animate-fadeIn">
                  <Zap className="text-yellow-400 shrink-0 animate-bounce" size={24} />
                  <div>
                    <h4 className="text-base font-bold text-white font-poppins">Optimasi Selesai</h4>
                    <p className="text-xs text-green-300 mt-0.5">Cache dibersihkan, penggunaan RAM berkurang menjadi 35%.</p>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-6 border-t border-white/10">
                <button 
                  onClick={closeModal}
                  className="px-5 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl text-sm font-bold transition-all"
                >
                  Tutup
                </button>
                <button 
                  disabled={optimizing}
                  onClick={runOptimization}
                  className="px-6 py-3 bg-[#4C92C3] hover:bg-[#3d7ea9] text-white rounded-xl text-sm font-bold flex items-center gap-2 transition-all shadow-md active:scale-95 disabled:opacity-50"
                >
                  {optimizing && <RefreshCw size={14} className="animate-spin" />}
                  {optimizing ? 'Mengoptimalkan...' : 'Bersihkan Cache & Optimasi Server'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SystemIntegrityPage;
