import React, { useState, useEffect } from 'react';
import { theme } from '../../Theme';
import {
  Activity, Shield, Laptop, Smartphone, Mail, Database, ShoppingBag,
  RefreshCw, X, AlertTriangle, CheckCircle, ShieldCheck, Link2, Key,
  Info, Wifi, WifiOff, PlugZap
} from 'lucide-react';
import { marketplaceService } from '../../api/marketplace';

const TotalIntegrasiPage = () => {
  const [coreSystems, setCoreSystems] = useState(() => {
    const saved = localStorage.getItem('cybersecure_core_systems');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const iconMap = { Mail, Database, Shield, Smartphone, Laptop };
        return parsed.map(item => {
          let updatedName = item.name;
          if (item.id === 'payment') {
            updatedName = 'Sistem Pembayaran (DANA, ShopeePay, Bank, dll)';
          }
          return {
            ...item,
            name: updatedName,
            icon: iconMap[item.type] || Laptop
          };
        });
      } catch (e) {
        console.error('Error loading core systems from localStorage', e);
      }
    }
    return [
      { id: 'mail', name: 'Email Server Utama', status: 'Terputus', type: 'Mail', icon: Mail },
      { id: 'db', name: 'Database Keuangan', status: 'Terputus', type: 'Database', icon: Database },
      { id: 'payment', name: 'Sistem Pembayaran (DANA, ShopeePay, Bank, dll)', status: 'Terputus', type: 'Payment', icon: Shield },
      { id: 'mobile', name: 'Aplikasi Mobile', status: 'Terputus', type: 'Mobile', icon: Smartphone },
      { id: 'web', name: 'Web Portal', status: 'Terputus', type: 'Web', icon: Laptop },
    ];
  });

  useEffect(() => {
    const serialized = coreSystems.map(({ icon, ...rest }) => rest);
    localStorage.setItem('cybersecure_core_systems', JSON.stringify(serialized));
  }, [coreSystems]);

  const [marketplaceList, setMarketplaceList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [selectedId, setSelectedId] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState('');
  const [actionSuccess, setActionSuccess] = useState(true);

  // Reconnect Form
  const [apiToken, setApiToken] = useState('');
  const [clientId, setClientId] = useState('');
  const [formError, setFormError] = useState('');
  const formatMockDate = (offsetDays) => {
    const date = new Date(Date.now() - offsetDays * 24 * 60 * 60 * 1000);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    const day = date.getDate().toString().padStart(2, '0');
    const month = months[date.getMonth()];
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${day} ${month} ${date.getFullYear()}, ${hours}:${minutes} WIB`;
  };

  // ✅ Gabungkan data secara otomatis setiap kali ada state yang berubah
  const integrationsList = [
    ...coreSystems.map((item, idx) => {
      const dbId = idx + 1;
      const connectCount = (dbId * 7) % 5 + 4;
      const disconnectCount = item.status === 'Aktif' ? connectCount - 1 : connectCount;
      return {
        ...item,
        initialConnected: formatMockDate(10),
        lastConnected: item.status === 'Aktif' ? formatMockDate(1) : 'Terputus',
        lastConnectedStr: item.status === 'Aktif' ? '26 Mei, 15:25' : 'Terputus',
        connectCount,
        disconnectCount,
      };
    }),
    ...marketplaceList
  ];
  useEffect(() => {
    const fetchMarketplaces = async () => {
      try {
        const data = await marketplaceService.getMarketplaces();

        const mps = data.map((mp, index) => {
          const dbId = mp.id || index;
          const connectCount = (dbId * 3) % 4 + 2;
          const disconnectCount = mp.status === 'connected' ? connectCount - 1 : connectCount;

          const createdDate = new Date(mp.created_at || new Date(Date.now() - 10 * 24 * 60 * 60 * 1000));
          const updatedDate = new Date(mp.updated_at || Date.now());

          const formatDate = (date) => {
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
            const day = date.getDate().toString().padStart(2, '0');
            const month = months[date.getMonth()];
            const hours = date.getHours().toString().padStart(2, '0');
            const minutes = date.getMinutes().toString().padStart(2, '0');
            return `${day} ${month} ${date.getFullYear()}, ${hours}:${minutes} WIB`;
          };

          const formatDateShort = (date) => {
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
            const day = date.getDate();
            const month = months[date.getMonth()];
            const hours = date.getHours().toString().padStart(2, '0');
            const minutes = date.getMinutes().toString().padStart(2, '0');
            return `${day} ${month}, ${hours}:${minutes}`;
          };

          return {
            id: `mp-${mp.id || index}`,
            dbId: mp.id,
            marketplace_name: mp.marketplace_name,
            marketplace_email: mp.marketplace_email,
            name: `${mp.marketplace_name} - ${mp.marketplace_email}`,
            status: mp.status === 'connected' ? 'Aktif' : 'Terputus',
            type: 'Marketplace',
            icon: ShoppingBag,
            initialConnected: formatDate(createdDate),
            lastConnected: mp.status === 'connected' ? formatDate(updatedDate) : 'Terputus',
            lastConnectedStr: mp.status === 'connected' ? formatDateShort(updatedDate) : 'Terputus',
            connectCount,
            disconnectCount,
          };
        });

        // ✅ SEKARANG CUMA SIMPAN DATA MARKETPLACE SAJA
        setMarketplaceList(mps);
      } catch (err) {
        console.error('Error fetching marketplaces in TotalIntegrasi:', err);
        // Jika error, marketplace dikosongkan (fallback aman)
        setMarketplaceList([]);
      } finally {
        setLoading(false);
      }
    };
    fetchMarketplaces();
  }, []);

  // Derive selectedIntegration live from integrationsList so modal always reflects latest state
  const selectedIntegration = selectedId
    ? integrationsList.find(i => i.id === selectedId) || null
    : null;

  const openModal = (item) => {
    setSelectedId(item.id);
    setActionMessage('');
    setFormError('');
    setApiToken('');
    setClientId('');
  };

  const closeModal = () => {
    setSelectedId(null);
    setActionMessage('');
    setFormError('');
    setApiToken('');
    setClientId('');
  };

  const showMessage = (msg, success = true) => {
    setActionSuccess(success);
    setActionMessage(msg);
    setTimeout(() => setActionMessage(''), 3000);
  };

  const handleDisconnect = async () => {
    if (!selectedIntegration) return;
    setActionLoading(true);

    if (selectedIntegration.type !== 'Marketplace') {
      setTimeout(() => {
        setCoreSystems(prev =>
          prev.map(item =>
            item.id === selectedIntegration.id ? { ...item, status: 'Terputus' } : item
          )
        );
        setActionLoading(false);
        showMessage('Koneksi API berhasil diputuskan. Hubungkan kembali kapan saja.', false);
      }, 1200);
      return;
    }

    try {
      await marketplaceService.disconnectMarketplace(selectedIntegration.dbId);
      setMarketplaceList(prev =>
        prev.map(item =>
          item.id === selectedIntegration.id ? { ...item, status: 'Terputus' } : item
        )
      );
      showMessage('Koneksi API berhasil diputuskan. Hubungkan kembali kapan saja.', false);
    } catch (err) {
      console.error('Error disconnecting marketplace:', err);
      showMessage('Gagal memutuskan koneksi API.', false);
    } finally {
      setActionLoading(false);
    }
  };

  const handleSyncAgain = () => {
  if (!selectedIntegration) return;
  setActionLoading(true);
  
  setTimeout(() => {
    // 1. Update data master coreSystems biar permanen aman
    if (selectedIntegration.type !== 'Marketplace') {
      setCoreSystems(prevCore => 
        prevCore.map(item => 
          item.id === selectedIntegration.id ? { ...item, status: 'Aktif' } : item
        )
      );
    } else {
      setMarketplaceList(prev =>
        prev.map(item =>
          item.id === selectedIntegration.id ? { ...item, status: 'Aktif' } : item
        )
      );
    }
    
    setActionLoading(false);
    closeModal(); // Otomatis tutup modal
    
    if (typeof showMessage === 'function') {
      showMessage('Sinkronisasi ulang berhasil! Web Portal kini aktif.', true);
    }
  }, 1500);
};

  const handleReconnect = async (e) => {
    e.preventDefault();
    if (!apiToken.trim() || !clientId.trim()) {
      setFormError('Harap isi Token API dan Client ID / Username untuk melanjutkan.');
      return;
    }
    setFormError('');
    setActionLoading(true);

    if (selectedIntegration.type !== 'Marketplace') {
      setTimeout(() => {
        setCoreSystems(prev =>
          prev.map(item =>
            item.id === selectedIntegration.id ? { ...item, status: 'Aktif' } : item
          )
        );
        setActionLoading(false);
        setApiToken('');
        setClientId('');
        showMessage('Koneksi berhasil diaktifkan kembali! Sistem mulai sinkronisasi.', true);
      }, 1500);
      return;
    }

    try {
      const response = await marketplaceService.addMarketplace({
        marketplace_name: selectedIntegration.marketplace_name,
        marketplace_email: selectedIntegration.marketplace_email,
        password: apiToken, // Store the apiToken as the password/token in DB
      });

      setMarketplaceList(prev =>
        prev.map(item =>
          item.id === selectedIntegration.id 
            ? { ...item, status: 'Aktif', dbId: response.marketplace.id } 
            : item
        )
      );
      setApiToken('');
      setClientId('');
      showMessage('Koneksi berhasil diaktifkan kembali! Sistem mulai sinkronisasi.', true);
    } catch (err) {
      console.error('Error reconnecting marketplace:', err);
      setFormError(err.response?.data?.message || 'Gagal menghubungi backend API.');
    } finally {
      setActionLoading(false);
    }
  };

  const totalCount = integrationsList.length;
  const activeCount = integrationsList.filter(
    (item) => item.status === 'Aktif' || item.status === 'connected' || item.status === 'Connected'
  ).length;

  const StatusBadge = ({ status, large = false }) => {
    const base = large ? 'px-4 py-1.5 text-sm' : 'px-2.5 py-0.5 text-[10px]';
    const dot = large ? 'w-2.5 h-2.5' : 'w-1.5 h-1.5';
    const colors = status === 'Aktif'
      ? 'bg-green-400/15 text-green-400 border border-green-400/30'
      : status === 'Peringatan'
      ? 'bg-yellow-400/15 text-yellow-400 border border-yellow-400/30'
      : 'bg-red-400/15 text-red-400 border border-red-400/30';
    const dotColor = status === 'Aktif'
      ? 'bg-green-400 animate-pulse'
      : status === 'Peringatan'
      ? 'bg-yellow-400 animate-pulse'
      : 'bg-red-400';

    return (
      <span className={`inline-flex items-center gap-2 rounded-full font-black uppercase tracking-wider ${base} ${colors}`}>
        <span className={`rounded-full ${dot} ${dotColor}`} />
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn">
      {/* Banner */}
      <div
        style={{ backgroundColor: theme.sidebar }}
        className="p-6 sm:p-8 rounded-2xl sm:rounded-3xl shadow-xl flex items-center gap-4 sm:gap-6 border border-white/10 bg-gradient-to-br from-[#1F5E88] to-[#123A57]"
      >
        <div className="p-3 sm:p-4 bg-white/10 rounded-xl sm:rounded-2xl shrink-0 animate-pulse">
          <Activity size={32} className="text-[#B8DDF5] sm:hidden" />
          <Activity size={40} className="text-[#B8DDF5] hidden sm:block" />
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-white">Total Integrasi</h2>
          <p className="text-[#B8DDF5] text-xs sm:text-sm mt-1">
            Detail {activeCount} dari {totalCount} akun dan sistem yang aktif terhubung dengan pengawasan CyberSecure
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="bg-white/5 rounded-2xl sm:rounded-3xl p-5 sm:p-6 border border-white/10 space-y-6">
        <h3 className="text-base sm:text-lg font-bold text-white mb-2 sm:mb-4">
          Daftar Sistem &amp; Toko Terintegrasi
        </h3>
        {loading ? (
          <div className="text-center py-12 text-white/70">
            <RefreshCw size={32} className="animate-spin mx-auto mb-3" />
            <p className="text-sm">Memuat data integrasi...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {integrationsList.map((item, i) => (
              <div
                key={item.id || i}
                onClick={() => openModal(item)}
                className="bg-white/5 hover:bg-white/10 p-4 rounded-xl border border-white/5 hover:border-white/10 transition-all duration-300 hover:scale-[1.01] hover:shadow-lg flex items-center gap-4 cursor-pointer min-w-0 relative pb-7"
              >
                <div className="p-2.5 bg-white/10 rounded-xl shrink-0">
                  <item.icon size={20} className="text-[#B8DDF5]" />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-bold text-sm sm:text-base text-white truncate">{item.name}</h4>
                  <p className="text-[10px] sm:text-xs text-white/50 mb-1.5">{item.type || 'Sistem'}</p>
                  <StatusBadge status={item.status} />
                </div>
                {item.type === 'Marketplace' && item.lastConnectedStr && (
                  <div className="absolute bottom-2.5 right-4 text-[9px] text-white/40 font-mono">
                    {item.status === 'Aktif' ? `Koneksi: ${item.lastConnectedStr}` : 'Koneksi: Terputus'}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ─── Modal ─── */}
      {selectedIntegration && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-sm animate-fadeIn"
          onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
        >
          <div className="bg-gradient-to-b from-[#0f2d45] to-[#0a1f30] border border-white/15 rounded-3xl w-full max-w-5xl shadow-[0_30px_80px_rgba(0,0,0,0.7)] relative animate-scaleUp overflow-hidden max-h-[90vh] flex flex-col">

            {/* Decorative top glow */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#4C92C3]/60 to-transparent" />

            {/* ── Header ── */}
            <div className="flex justify-between items-start px-8 pt-8 pb-5 border-b border-white/10 shrink-0">
              <div className="flex items-start gap-4 min-w-0">
                <div className="p-3 bg-[#4C92C3]/20 rounded-2xl border border-[#4C92C3]/30 shrink-0">
                  <selectedIntegration.icon className="text-[#B8DDF5]" size={28} />
                </div>
                <div className="min-w-0">
                  <h3 className="text-xl sm:text-2xl font-extrabold text-white leading-tight truncate max-w-xs sm:max-w-md">
                    {selectedIntegration.name}
                  </h3>
                  <p className="text-white/40 text-xs mt-1 mb-3">{selectedIntegration.type}</p>
                  <StatusBadge status={selectedIntegration.status} large />
                </div>
              </div>
              <button
                onClick={closeModal}
                className="text-white/50 hover:text-white bg-white/5 hover:bg-white/15 p-2 rounded-xl transition-all cursor-pointer shrink-0 ml-4"
              >
                <X size={20} />
              </button>
            </div>

            {/* ── Body ── */}
            <div className="px-8 py-6 space-y-5 overflow-y-auto flex-1">
              {/* Feedback Alert */}
              {actionMessage && (
                <div className={`p-4 rounded-2xl text-sm font-semibold text-center border animate-fadeIn flex items-center justify-center gap-2 ${
                  actionSuccess
                    ? 'bg-green-500/15 border-green-500/40 text-green-200'
                    : 'bg-orange-500/15 border-orange-500/40 text-orange-200'
                }`}>
                  {actionSuccess
                    ? <CheckCircle size={16} className="shrink-0" />
                    : <AlertTriangle size={16} className="shrink-0" />
                  }
                  {actionMessage}
                </div>
              )}

              {/* ─── CHOOSE VIEW BY TYPE ─── */}
              {selectedIntegration.type === 'Marketplace' ? (
                <div className="space-y-5">
                  {/* Status Banner - full width */}
                  {selectedIntegration.status === 'Aktif' ? (
                    <div className="p-4 bg-green-500/10 border border-green-500/25 rounded-2xl flex items-start gap-3">
                      <ShieldCheck className="text-green-400 shrink-0 mt-0.5" size={22} />
                      <div>
                        <span className="text-sm text-green-300 font-bold block">Status Koneksi: Aktif &amp; Aman</span>
                        <span className="text-xs text-green-200/80 mt-0.5 block leading-relaxed">
                          Sistem memantau dan menyinkronkan data dari marketplace ini secara real-time dengan enkripsi SSL 256-bit.
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-start gap-3">
                      <WifiOff className="text-red-400 shrink-0 mt-0.5" size={22} />
                      <div>
                        <span className="text-sm text-red-300 font-bold block">Status Koneksi: Terputus</span>
                        <span className="text-xs text-red-200/80 mt-0.5 block leading-relaxed">
                          Integrasi ini dinonaktifkan sementara. Riwayat audit dan pencatatan transaksi sebelumnya tetap disimpan aman untuk kepatuhan.
                        </span>
                      </div>
                    </div>
                  )}

                  {/* ── 2 Column Layout ── */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    {/* Left Column: Audit Log Table */}
                    <div className="space-y-5">
                      <div className="bg-white/5 border border-white/8 rounded-2xl overflow-hidden">
                        <div className="px-5 py-3 bg-white/5 border-b border-white/10 text-xs font-bold text-[#B8DDF5] tracking-wide uppercase">
                          Informasi Log &amp; Riwayat Audit
                        </div>
                        {[
                          { label: 'Waktu Otorisasi Awal', value: selectedIntegration.initialConnected, valueClass: 'text-white font-mono text-xs' },
                          { label: 'Waktu Koneksi Terakhir', value: selectedIntegration.lastConnected, valueClass: 'text-white font-mono text-xs' },
                          { label: 'Metode Integrasi', value: 'API Secure Client (Restful)', valueClass: 'text-gray-300 font-mono text-xs' },
                          { label: 'Status Saat Ini', value: selectedIntegration.status === 'Aktif' ? 'Terhubung (Aktif)' : 'Terputus (Inaktif)', valueClass: selectedIntegration.status === 'Aktif' ? 'text-green-400 font-bold' : 'text-red-400 font-bold' },
                        ].map((row, idx, arr) => (
                          <div
                            key={row.label}
                            className={`flex justify-between items-center px-5 py-3 text-sm ${idx < arr.length - 1 ? 'border-b border-white/5' : ''}`}
                          >
                            <span className="text-gray-400 text-xs">{row.label}</span>
                            <span className={row.valueClass}>{row.value}</span>
                          </div>
                        ))}
                      </div>

                      {/* Connection Stats Row */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-white/5 border border-white/5 rounded-2xl text-center">
                          <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider block mb-1">Jumlah Terhubung</span>
                          <span className="text-2xl font-black text-[#B8DDF5]">{selectedIntegration.connectCount}</span>
                          <span className="text-[10px] text-gray-500 block mt-1">Sesi Sukses</span>
                        </div>
                        <div className="p-4 bg-white/5 border border-white/5 rounded-2xl text-center">
                          <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider block mb-1">Jumlah Diputus</span>
                          <span className="text-2xl font-black text-red-300">{selectedIntegration.disconnectCount}</span>
                          <span className="text-[10px] text-gray-500 block mt-1">Manual / Session Expired</span>
                        </div>
                      </div>
                    </div>

                    {/* Right Column: Activity Timeline */}
                    <div className="space-y-5">
                      <div className="p-5 bg-white/5 border border-white/5 rounded-2xl space-y-4 h-full">
                        <span className="text-xs font-bold text-[#B8DDF5] tracking-wider uppercase block">Linimasa Aktivitas Terakhir</span>
                        <div className="relative pl-6 border-l border-white/10 space-y-5">
                          {selectedIntegration.status === 'Aktif' && (
                            <div className="relative">
                              <div className="absolute -left-[30px] top-1.5 w-2 h-2 rounded-full bg-green-400 border border-green-400/50 shadow-[0_0_10px_rgba(74,222,128,0.5)]" />
                              <span className="text-xs font-bold text-green-300 block">Koneksi Dipulihkan</span>
                              <span className="text-[10px] text-gray-400 block mt-0.5">{selectedIntegration.lastConnected}</span>
                            </div>
                          )}
                          
                          <div className="relative">
                            <div className="absolute -left-[30px] top-1.5 w-2 h-2 rounded-full bg-red-400 border border-red-400/50 shadow-[0_0_10px_rgba(248,113,113,0.5)]" />
                            <span className="text-xs font-bold text-red-300 block">Koneksi Diputuskan oleh User</span>
                            <span className="text-[10px] text-gray-400 block mt-0.5">
                              {selectedIntegration.status === 'Aktif' 
                                ? 'Beberapa hari sebelum koneksi dipulihkan' 
                                : selectedIntegration.lastConnected !== 'Terputus' 
                                  ? selectedIntegration.lastConnected 
                                  : 'Riwayat Audit Terakhir'}
                            </span>
                          </div>

                          <div className="relative">
                            <div className="absolute -left-[30px] top-1.5 w-2 h-2 rounded-full bg-green-400" />
                            <span className="text-xs font-bold text-gray-300 block">Integrasi Awal Dikonfigurasi</span>
                            <span className="text-[10px] text-gray-400 block mt-0.5">{selectedIntegration.initialConnected}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Close Action - full width */}
                  <div className="pt-4 border-t border-white/10 flex justify-end">
                    <button
                      onClick={closeModal}
                      className="px-6 py-3 bg-[#4C92C3] hover:bg-[#3d7ea9] text-white rounded-xl text-sm font-bold transition-all active:scale-95 cursor-pointer shadow-lg shadow-[#4C92C3]/20"
                    >
                      Tutup Riwayat
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {/* ─── STATUS: AKTIF ─── */}
                  {selectedIntegration.status === 'Aktif' && (
                    <>
                      {/* Info table */}
                      <div className="bg-white/5 border border-white/8 rounded-2xl overflow-hidden">
                        {[
                          { label: 'Sinkronisasi Terakhir', value: 'Real-time (Baru saja)', valueClass: 'text-white font-mono' },
                          { label: 'Tipe Akses', value: 'API Token (OAuth 2.0)', valueClass: 'text-white font-mono' },
                          { label: 'Integritas Keamanan', value: '100% Terenkripsi', valueClass: 'text-green-400 font-bold' },
                          { label: 'Latensi Koneksi', value: '18ms (Optimal)', valueClass: 'text-cyan-400 font-bold' },
                        ].map((row, idx, arr) => (
                          <div
                            key={row.label}
                            className={`flex justify-between items-center px-5 py-3.5 text-sm ${idx < arr.length - 1 ? 'border-b border-white/5' : ''}`}
                          >
                            <span className="text-gray-400">{row.label}</span>
                            <span className={row.valueClass}>{row.value}</span>
                          </div>
                        ))}
                      </div>

                      {/* AI Insight */}
                      <div className="p-4 bg-green-500/10 border border-green-500/25 rounded-2xl flex items-start gap-3">
                        <ShieldCheck className="text-green-400 shrink-0 mt-0.5" size={22} />
                        <div>
                          <span className="text-sm text-green-300 font-bold block">AI Insight — Fraud Score: Aman</span>
                          <span className="text-xs text-green-200/80 mt-0.5 block leading-relaxed">
                            Semua lalu intrat data terverifikasi bersih. Tidak ada aktivitas anomali dalam 24 jam terakhir.
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
                        <button
                          disabled={actionLoading}
                          onClick={closeModal}
                          className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl text-sm font-bold transition-all cursor-pointer disabled:opacity-50"
                        >
                          Kembali
                        </button>
                        <button
                          disabled={actionLoading}
                          onClick={handleDisconnect}
                          className="px-6 py-3 bg-red-500/15 hover:bg-red-500/30 text-red-300 rounded-xl text-sm font-bold border border-red-500/30 flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                        >
                          {actionLoading
                            ? <RefreshCw size={15} className="animate-spin" />
                            : <WifiOff size={15} />
                          }
                          Putuskan Koneksi API
                        </button>
                      </div>
                    </>
                  )}

                  {/* ─── STATUS: PERINGATAN ─── */}
                  {selectedIntegration.status === 'Peringatan' && (
                    <>
                      <div className="p-5 bg-yellow-500/10 border border-yellow-500/25 rounded-2xl flex gap-4">
                        <AlertTriangle className="text-yellow-400 shrink-0 mt-0.5" size={26} />
                        <div>
                          <h4 className="text-base font-bold text-yellow-300">Deteksi Gangguan Integrasi</h4>
                          <p className="text-sm text-gray-300 mt-1.5 leading-relaxed">
                            Galat: <strong className="text-yellow-200">Token API kedaluwarsa.</strong> Sistem tidak dapat memperbarui log transaksi secara real-time. Lakukan sinkronisasi ulang untuk memperbarui token secara otomatis.
                          </p>
                        </div>
                      </div>

                      <div className="bg-white/5 border border-white/8 rounded-2xl overflow-hidden">
                        {[
                          { label: 'Sinkronisasi Terakhir', value: '2 jam lalu', valueClass: 'text-yellow-400 font-mono' },
                          { label: 'Kode Error', value: 'ERR_TOKEN_EXPIRED', valueClass: 'text-red-400 font-mono text-xs' },
                        ].map((row, idx, arr) => (
                          <div key={row.label} className={`flex justify-between items-center px-5 py-3.5 text-sm ${idx < arr.length - 1 ? 'border-b border-white/5' : ''}`}>
                            <span className="text-gray-400">{row.label}</span>
                            <span className={row.valueClass}>{row.value}</span>
                          </div>
                        ))}
                      </div>

                      <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
                        <button
                          disabled={actionLoading}
                          onClick={closeModal}
                          className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl text-sm font-bold transition-all cursor-pointer disabled:opacity-50"
                        >
                          Batal
                        </button>
                        <button
                          disabled={actionLoading}
                          onClick={handleSyncAgain}
                          className="px-6 py-3 bg-[#4C92C3] hover:bg-[#3d7ea9] text-white rounded-xl text-sm font-bold flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50 cursor-pointer shadow-lg shadow-[#4C92C3]/20"
                        >
                          {actionLoading
                            ? <RefreshCw size={15} className="animate-spin" />
                            : <RefreshCw size={15} />
                          }
                          {actionLoading ? 'Menyinkronkan...' : 'Sinkronisasi Ulang'}
                        </button>
                      </div>
                    </>
                  )}

                  {/* ─── STATUS: TERPUTUS ─── */}
                  {selectedIntegration.status === 'Terputus' && (
                    <form onSubmit={handleReconnect} className="space-y-5">
                      <div className="p-5 bg-red-500/10 border border-red-500/20 rounded-2xl flex gap-4">
                        <WifiOff className="text-red-400 shrink-0 mt-0.5" size={24} />
                        <div>
                          <h4 className="text-base font-bold text-red-300">Koneksi Terputus</h4>
                          <p className="text-sm text-gray-300 mt-1 leading-relaxed">
                            Sistem ini tidak aktif. Masukkan kredensial baru untuk menghubungkan kembali dan melanjutkan sinkronisasi data secara real-time.
                          </p>
                        </div>
                      </div>

                      {formError && (
                        <div className="p-4 bg-red-500/15 border border-red-500/40 rounded-xl text-red-200 text-sm font-semibold text-center">
                          {formError}
                        </div>
                      )}

                      {/* Demo Autopopulate Helper */}
                      <div className="p-4 bg-[#4C92C3]/15 border border-[#4C92C3]/30 rounded-2xl flex items-center justify-between gap-3">
                        <div className="text-xs text-gray-300 leading-normal">
                          <span className="font-bold text-[#B8DDF5] block mb-0.5">💡 Butuh Kredensial Demo?</span>
                          Gunakan kredensial pengujian simulasi otomatis secara instan.
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setApiToken('sk_live_51NxShopeeKey9988_cyber_demo');
                            setClientId('client_cyber_prod_kayla23');
                            setFormError('');
                          }}
                          className="px-4 py-2 bg-[#4C92C3] hover:bg-[#3d7ea9] text-white rounded-xl text-xs font-bold transition-all active:scale-95 cursor-pointer shrink-0 shadow-lg shadow-[#4C92C3]/20"
                        >
                          Gunakan Kredensial Demo
                        </button>
                      </div>

                      <div className="space-y-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-gray-300 block tracking-wide uppercase">Token API Baru</label>
                          <div className="flex items-center bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 gap-3 focus-within:ring-2 ring-[#4C92C3]/50 focus-within:border-[#4C92C3]/50 transition-all">
                            <Key className="text-[#B8DDF5] shrink-0" size={16} />
                            <input
                              type="password"
                              value={apiToken}
                              onChange={(e) => setApiToken(e.target.value)}
                              placeholder="sk_live_51Nx..."
                              className="bg-transparent w-full outline-none text-white text-sm placeholder:text-white/25"
                            />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-gray-300 block tracking-wide uppercase">Client ID / Username</label>
                          <div className="flex items-center bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 gap-3 focus-within:ring-2 ring-[#4C92C3]/50 focus-within:border-[#4C92C3]/50 transition-all">
                            <Link2 className="text-[#B8DDF5] shrink-0" size={16} />
                            <input
                              type="text"
                              value={clientId}
                              onChange={(e) => setClientId(e.target.value)}
                              placeholder="client_cyber_prod_..."
                              className="bg-transparent w-full outline-none text-white text-sm placeholder:text-white/25"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
                        <button
                          type="button"
                          disabled={actionLoading}
                          onClick={closeModal}
                          className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl text-sm font-bold transition-all cursor-pointer disabled:opacity-50"
                        >
                          Batal
                        </button>
                        <button
                          type="submit"
                          disabled={actionLoading}
                          className="px-6 py-3 bg-[#4C92C3] hover:bg-[#3d7ea9] text-white rounded-xl text-sm font-bold flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50 cursor-pointer shadow-lg shadow-[#4C92C3]/20"
                        >
                          {actionLoading
                            ? <RefreshCw size={15} className="animate-spin" />
                            : <PlugZap size={15} />
                          }
                          {actionLoading ? 'Menghubungkan...' : 'Hubungkan Kembali'}
                        </button>
                      </div>
                    </form>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TotalIntegrasiPage;