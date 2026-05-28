import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  ChevronDown, RefreshCw, KeyRound, Check, X, ShieldAlert,
  Database as DbIcon, ShieldCheck, Mail, Laptop, ShoppingBag, 
  HelpCircle, Link2, Info, Key, Server, Settings, Activity, WifiOff, AlertTriangle
} from 'lucide-react';
import { theme } from '../Theme';
import { marketplaceService } from '../api/marketplace';

const MarketplacePage = () => {
  const [activeTab, setActiveTab] = useState('marketplace'); // 'marketplace', 'database', 'payment', 'email', 'web'
  const [dbMarketplaces, setDbMarketplaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Modals state
  const [connectItem, setConnectItem] = useState(null); // Item to connect (contains { id, name, type })
  const [disconnectItem, setDisconnectItem] = useState(null); // Item to disconnect (contains { id, name, type, dbId })

  // Forms state
  const [apiToken, setApiToken] = useState('');
  const [clientId, setClientId] = useState('');
  const [formError, setFormError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  // States for coreSystems (from localStorage)
  const [coreSystems, setCoreSystems] = useState([]);

  // Load coreSystems
  const loadCoreSystems = () => {
    const saved = localStorage.getItem('cybersecure_core_systems');
    if (saved) {
      try {
        setCoreSystems(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    } else {
      const defaults = [
        { id: 'mail', name: 'Email Server Utama', status: 'Aktif', type: 'Mail' },
        { id: 'db', name: 'Database Keuangan', status: 'Aktif', type: 'Database' },
        { id: 'payment', name: 'Sistem Pembayaran (DANA, ShopeePay, Bank, dll)', status: 'Aktif', type: 'Payment' },
        { id: 'mobile', name: 'Aplikasi Mobile', status: 'Aktif', type: 'Mobile' },
        { id: 'web', name: 'Web Portal', status: 'Peringatan', type: 'Web' },
      ];
      setCoreSystems(defaults);
      localStorage.setItem('cybersecure_core_systems', JSON.stringify(defaults));
    }
  };

  useEffect(() => {
    loadCoreSystems();
  }, []);

  const updateCoreSystemStatus = (systemId, newStatus) => {
    const saved = localStorage.getItem('cybersecure_core_systems');
    let current = coreSystems;
    if (saved) {
      try {
        current = JSON.parse(saved);
      } catch (e) {}
    }
    const updated = current.map(sys => 
      sys.id === systemId ? { ...sys, status: newStatus } : sys
    );
    setCoreSystems(updated);
    localStorage.setItem('cybersecure_core_systems', JSON.stringify(updated));
  };

  const databaseOptions = ['PostgreSQL', 'MySQL', 'SQL Server', 'Oracle'];
  const paymentOptions = ['Midtrans', 'Xendit', 'DANA', 'ShopeePay', 'Bank API'];
  const emailOptions = ['Gmail SMTP', 'Outlook SMTP', 'SendGrid', 'Mailchimp'];
  const webOptions = ['Nginx Server', 'Apache Server', 'IIS Server', 'Cloudflare'];
  const marketplacesOptions = ['Tokopedia', 'Shopee', 'Lazada', 'Blibli', 'Bukalapak'];

  // Fetch connected marketplaces on mount
  const fetchMarketplaces = async () => {
    setLoading(true);
    try {
      const data = await marketplaceService.getMarketplaces();
      setDbMarketplaces(data);
    } catch (err) {
      console.error('Error fetching marketplaces:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMarketplaces();
  }, []);

  // Merged items lists
  const mergedMarketplaces = marketplacesOptions.map(name => {
    const dbMatch = dbMarketplaces.find(item => item.marketplace_name === name);
    return {
      id: `mp-${name}`,
      dbId: dbMatch ? dbMatch.id : null,
      name,
      initial: name[0],
      status: dbMatch ? (dbMatch.status === 'connected' ? 'Connected' : 'Not Connected') : 'Not Connected',
      email: dbMatch ? dbMatch.marketplace_email : '',
      type: 'Marketplace'
    };
  });

  const getSystemStatus = (id) => {
    const sys = coreSystems.find(s => s.id === id);
    return sys ? sys.status : 'Terputus';
  };

  // Connect Handler
  const handleConnectSubmit = async (e) => {
    e.preventDefault();
    if (!apiToken.trim() || !clientId.trim()) {
      setFormError('Harap isi Token API Baru dan Client ID / Username.');
      return;
    }
    setFormError('');
    setActionLoading(true);

    if (connectItem.type === 'Marketplace') {
      try {
        await marketplaceService.addMarketplace({
          marketplace_name: connectItem.name,
          marketplace_email: clientId,
          password: apiToken
        });
        setSuccess(`Koneksi ${connectItem.name} berhasil diaktifkan kembali!`);
        fetchMarketplaces();
        setConnectItem(null);
      } catch (err) {
        console.error(err);
        setFormError(err.response?.data?.message || 'Gagal menghubungkan marketplace.');
      } finally {
        setActionLoading(false);
      }
    } else {
      // Core systems
      setTimeout(() => {
        updateCoreSystemStatus(connectItem.id, 'Aktif');
        setSuccess(`Koneksi ${connectItem.name} berhasil diaktifkan kembali!`);
        loadCoreSystems();
        setActionLoading(false);
        setConnectItem(null);
      }, 1200);
    }
  };

  // Disconnect Handler
  const handleDisconnectSubmit = async () => {
    setActionLoading(true);
    if (disconnectItem.type === 'Marketplace') {
      try {
        await marketplaceService.disconnectMarketplace(disconnectItem.dbId);
        setSuccess(`Koneksi ${disconnectItem.name} berhasil diputuskan.`);
        fetchMarketplaces();
        setDisconnectItem(null);
      } catch (err) {
        console.error(err);
        setError('Gagal memutus koneksi.');
      } finally {
        setActionLoading(false);
      }
    } else {
      // Core systems
      setTimeout(() => {
        updateCoreSystemStatus(disconnectItem.id, 'Terputus');
        setSuccess(`Koneksi ${disconnectItem.name} berhasil diputuskan.`);
        loadCoreSystems();
        setActionLoading(false);
        setDisconnectItem(null);
      }, 1200);
    }
  };

  const handleAutopopulateDemo = () => {
    setApiToken('sk_live_51NxShopeeKey9988_cyber_demo');
    setClientId('client_cyber_prod_kayla23');
    setFormError('');
  };

  const tabs = [
    { id: 'marketplace', label: 'Marketplace', icon: ShoppingBag },
    { id: 'database', label: 'Database', icon: DbIcon },
    { id: 'payment', label: 'Sistem Pembayaran', icon: ShieldCheck },
    { id: 'email', label: 'Email Server', icon: Mail },
    { id: 'web', label: 'Web Portal', icon: Laptop }
  ];

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn">
      {/* Subheader Section */}
      <div>
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-white">Tambah &amp; Kelola Integrasi</h2>
        <p className="text-white/70 text-xs sm:text-sm mt-1">Hubungkan dan kelola credential sistem digital Anda secara terputus/sambung</p>
      </div>

      {/* Alert Notification */}
      {success && (
        <div className="p-3 bg-green-500/20 border border-green-500/50 rounded-xl text-green-200 text-xs sm:text-sm font-semibold animate-fadeIn text-center shadow-[0_0_15px_rgba(34,197,94,0.15)]">
          {success}
        </div>
      )}

      {/* Tabs navigation */}
      <div className="flex flex-wrap gap-2 border-b border-white/10 pb-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                isActive 
                  ? 'bg-white/15 text-white border border-white/10 shadow-md backdrop-blur-md' 
                  : 'text-white/50 hover:bg-white/5 hover:text-white/80'
              }`}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Grid content based on activeTab */}
      <div className="space-y-4">
        {activeTab === 'marketplace' && (
          <div className="space-y-4">
            {loading && dbMarketplaces.length === 0 ? (
              <div className="text-white text-center py-10 opacity-70">
                <RefreshCw size={32} className="animate-spin mx-auto mb-3" />
                <p className="text-sm">Memuat data akun toko terintegrasi...</p>
              </div>
            ) : (
              mergedMarketplaces.map((item, i) => {
                const isConnected = item.status === 'Connected';
                return (
                  <div 
                    key={i} 
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 px-5 rounded-xl sm:rounded-2xl shadow-md border border-white/10 transition-all duration-300 hover:scale-[1.005] hover:shadow-xl hover:brightness-105 active:scale-[0.995] bg-gradient-to-r from-[#B8DDF5] to-[#D5EEFF]"
                  >
                    <div className="flex items-center gap-4 sm:gap-6 mb-3 sm:mb-0">
                      <div className="w-10 h-10 sm:w-11 sm:h-11 bg-[#538CB4] rounded-lg flex items-center justify-center text-white text-lg sm:text-xl font-bold shadow-inner shrink-0">
                        {item.initial}
                      </div>
                      <div className="min-w-0">
                        <span className="text-base sm:text-lg font-bold text-[#0D2C3D] block truncate">{item.name}</span>
                        {isConnected && (
                          <span className="text-xs sm:text-sm text-[#1F5E88] font-bold block truncate">{item.email}</span>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border ${
                        isConnected 
                          ? 'bg-[#E2FBE9] text-[#10B981] border-[#10B981]/25' 
                          : 'bg-white/60 text-slate-500 border-slate-300'
                      }`}>
                        <div className={`w-2 h-2 rounded-full ${
                          isConnected ? 'bg-[#10B981]' : 'border-2 border-slate-400'
                        }`}></div>
                        <span className="text-[10px] font-black uppercase tracking-wider">{isConnected ? 'CONNECTED' : 'NOT CONNECTED'}</span>
                      </div>

                      {isConnected ? (
                        <button 
                          onClick={() => {
                            setApiToken('');
                            setClientId('');
                            setFormError('');
                            setDisconnectItem({ id: item.id, dbId: item.dbId, name: item.name, type: 'Marketplace' });
                          }}
                          className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-lg text-xs font-bold shadow transition-all hover:scale-105 cursor-pointer"
                        >
                          Putus
                        </button>
                      ) : (
                        <button 
                          onClick={() => {
                            setApiToken('');
                            setClientId('');
                            setFormError('');
                            setConnectItem({ id: item.id, name: item.name, type: 'Marketplace' });
                          }}
                          className="bg-[#1F5E88] hover:bg-[#154666] text-white px-4 py-1.5 rounded-lg text-xs font-bold shadow transition-all hover:scale-105 cursor-pointer"
                        >
                          Hubungkan
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Database Tab */}
        {activeTab === 'database' && (
          <div className="space-y-4">
            {databaseOptions.map((dbOpt) => {
              const status = getSystemStatus('db');
              const isConnected = status === 'Aktif';
              return (
                <div 
                  key={dbOpt}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 px-5 rounded-xl sm:rounded-2xl shadow-md border border-white/10 transition-all duration-300 hover:scale-[1.005] hover:shadow-xl hover:brightness-105 active:scale-[0.995] bg-gradient-to-r from-[#B8DDF5] to-[#D5EEFF]"
                >
                  <div className="flex items-center gap-4 sm:gap-6 mb-3 sm:mb-0">
                    <div className="w-10 h-10 sm:w-11 sm:h-11 bg-[#538CB4] rounded-lg flex items-center justify-center text-white shrink-0">
                      <DbIcon size={22} />
                    </div>
                    <div>
                      <span className="text-base sm:text-lg font-bold text-[#0D2C3D] block">{dbOpt} Database</span>
                      {isConnected && (
                        <span className="text-xs text-[#1F5E88] font-bold block font-mono">Host: 127.0.0.1 | Port: {dbOpt === 'PostgreSQL' ? '5432' : '3306'}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border ${
                      isConnected 
                        ? 'bg-[#E2FBE9] text-[#10B981] border-[#10B981]/25' 
                        : 'bg-white/60 text-slate-500 border-slate-300'
                    }`}>
                      <div className={`w-2 h-2 rounded-full ${
                        isConnected ? 'bg-[#10B981]' : 'border-2 border-slate-400'
                      }`}></div>
                      <span className="text-[10px] font-black uppercase tracking-wider">
                        {isConnected ? 'CONNECTED' : 'NOT CONNECTED'}
                      </span>
                    </div>

                    {isConnected ? (
                      <button 
                        onClick={() => {
                          setApiToken('');
                          setClientId('');
                          setFormError('');
                          setDisconnectItem({ id: 'db', name: `${dbOpt} Database`, type: 'Database' });
                        }}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-lg text-xs font-bold shadow transition-all hover:scale-105 cursor-pointer"
                      >
                        Putus
                      </button>
                    ) : (
                      <button 
                        onClick={() => {
                          setApiToken('');
                          setClientId('');
                          setFormError('');
                          setConnectItem({ id: 'db', name: `${dbOpt} Database`, type: 'Database' });
                        }}
                        className="bg-[#1F5E88] hover:bg-[#154666] text-white px-4 py-1.5 rounded-lg text-xs font-bold shadow transition-all hover:scale-105 cursor-pointer"
                      >
                        Hubungkan
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Payment Systems Tab */}
        {activeTab === 'payment' && (
          <div className="space-y-4">
            {paymentOptions.map((payOpt) => {
              const status = getSystemStatus('payment');
              const isConnected = status === 'Aktif';
              return (
                <div 
                  key={payOpt}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 px-5 rounded-xl sm:rounded-2xl shadow-md border border-white/10 transition-all duration-300 hover:scale-[1.005] hover:shadow-xl hover:brightness-105 active:scale-[0.995] bg-gradient-to-r from-[#B8DDF5] to-[#D5EEFF]"
                >
                  <div className="flex items-center gap-4 sm:gap-6 mb-3 sm:mb-0">
                    <div className="w-10 h-10 sm:w-11 sm:h-11 bg-[#538CB4] rounded-lg flex items-center justify-center text-white shrink-0">
                      <ShieldCheck size={22} />
                    </div>
                    <div>
                      <span className="text-base sm:text-lg font-bold text-[#0D2C3D] block">{payOpt} Gateway</span>
                      {isConnected && (
                        <span className="text-xs text-[#1F5E88] font-bold block">Status: Integrasi API Secure Active</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border ${
                      isConnected 
                        ? 'bg-[#E2FBE9] text-[#10B981] border-[#10B981]/25' 
                        : 'bg-white/60 text-slate-500 border-slate-300'
                    }`}>
                      <div className={`w-2 h-2 rounded-full ${
                        isConnected ? 'bg-[#10B981]' : 'border-2 border-slate-400'
                      }`}></div>
                      <span className="text-[10px] font-black uppercase tracking-wider">
                        {isConnected ? 'CONNECTED' : 'NOT CONNECTED'}
                      </span>
                    </div>

                    {isConnected ? (
                      <button 
                        onClick={() => {
                          setApiToken('');
                          setClientId('');
                          setFormError('');
                          setDisconnectItem({ id: 'payment', name: `${payOpt} Gateway`, type: 'Payment' });
                        }}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-lg text-xs font-bold shadow transition-all hover:scale-105 cursor-pointer"
                      >
                        Putus
                      </button>
                    ) : (
                      <button 
                        onClick={() => {
                          setApiToken('');
                          setClientId('');
                          setFormError('');
                          setConnectItem({ id: 'payment', name: `${payOpt} Gateway`, type: 'Payment' });
                        }}
                        className="bg-[#1F5E88] hover:bg-[#154666] text-white px-4 py-1.5 rounded-lg text-xs font-bold shadow transition-all hover:scale-105 cursor-pointer"
                      >
                        Hubungkan
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Email Tab */}
        {activeTab === 'email' && (
          <div className="space-y-4">
            {emailOptions.map((mailOpt) => {
              const status = getSystemStatus('mail');
              const isConnected = status === 'Aktif';
              return (
                <div 
                  key={mailOpt}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 px-5 rounded-xl sm:rounded-2xl shadow-md border border-white/10 transition-all duration-300 hover:scale-[1.005] hover:shadow-xl hover:brightness-105 active:scale-[0.995] bg-gradient-to-r from-[#B8DDF5] to-[#D5EEFF]"
                >
                  <div className="flex items-center gap-4 sm:gap-6 mb-3 sm:mb-0">
                    <div className="w-10 h-10 sm:w-11 sm:h-11 bg-[#538CB4] rounded-lg flex items-center justify-center text-white shrink-0">
                      <Mail size={22} />
                    </div>
                    <div>
                      <span className="text-base sm:text-lg font-bold text-[#0D2C3D] block">{mailOpt} Server</span>
                      {isConnected && (
                        <span className="text-xs text-[#1F5E88] font-bold block font-mono">SMTP: smtp.{mailOpt.toLowerCase().replace(' ', '')}.com</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border ${
                      isConnected 
                        ? 'bg-[#E2FBE9] text-[#10B981] border-[#10B981]/25' 
                        : 'bg-white/60 text-slate-500 border-slate-300'
                    }`}>
                      <div className={`w-2 h-2 rounded-full ${
                        isConnected ? 'bg-[#10B981]' : 'border-2 border-slate-400'
                      }`}></div>
                      <span className="text-[10px] font-black uppercase tracking-wider">
                        {isConnected ? 'CONNECTED' : 'NOT CONNECTED'}
                      </span>
                    </div>

                    {isConnected ? (
                      <button 
                        onClick={() => {
                          setApiToken('');
                          setClientId('');
                          setFormError('');
                          setDisconnectItem({ id: 'mail', name: `${mailOpt} Server`, type: 'Mail' });
                        }}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-lg text-xs font-bold shadow transition-all hover:scale-105 cursor-pointer"
                      >
                        Putus
                      </button>
                    ) : (
                      <button 
                        onClick={() => {
                          setApiToken('');
                          setClientId('');
                          setFormError('');
                          setConnectItem({ id: 'mail', name: `${mailOpt} Server`, type: 'Mail' });
                        }}
                        className="bg-[#1F5E88] hover:bg-[#154666] text-white px-4 py-1.5 rounded-lg text-xs font-bold shadow transition-all hover:scale-105 cursor-pointer"
                      >
                        Hubungkan
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Web Portal Tab */}
        {activeTab === 'web' && (
          <div className="space-y-4">
            {webOptions.map((webOpt) => {
              const status = getSystemStatus('web');
              const isConnected = status === 'Aktif';
              return (
                <div 
                  key={webOpt}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 px-5 rounded-xl sm:rounded-2xl shadow-md border border-white/10 transition-all duration-300 hover:scale-[1.005] hover:shadow-xl hover:brightness-105 active:scale-[0.995] bg-gradient-to-r from-[#B8DDF5] to-[#D5EEFF]"
                >
                  <div className="flex items-center gap-4 sm:gap-6 mb-3 sm:mb-0">
                    <div className="w-10 h-10 sm:w-11 sm:h-11 bg-[#538CB4] rounded-lg flex items-center justify-center text-white shrink-0">
                      <Laptop size={22} />
                    </div>
                    <div>
                      <span className="text-base sm:text-lg font-bold text-[#0D2C3D] block">{webOpt} Integration</span>
                      {isConnected && (
                        <span className="text-xs text-[#1F5E88] font-bold block">Status: Pemantauan Integritas Web Aktif</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border ${
                      isConnected 
                        ? 'bg-[#E2FBE9] text-[#10B981] border-[#10B981]/25' 
                        : 'bg-white/60 text-slate-500 border-slate-300'
                    }`}>
                      <div className={`w-2 h-2 rounded-full ${
                        isConnected ? 'bg-[#10B981]' : 'border-2 border-slate-400'
                      }`}></div>
                      <span className="text-[10px] font-black uppercase tracking-wider">
                        {isConnected ? 'CONNECTED' : 'NOT CONNECTED'}
                      </span>
                    </div>

                    {isConnected ? (
                      <button 
                        onClick={() => {
                          setApiToken('');
                          setClientId('');
                          setFormError('');
                          setDisconnectItem({ id: 'web', name: webOpt, type: 'Web' });
                        }}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-lg text-xs font-bold shadow transition-all hover:scale-105 cursor-pointer"
                      >
                        Putus
                      </button>
                    ) : (
                      <button 
                        onClick={() => {
                          setApiToken('');
                          setClientId('');
                          setFormError('');
                          setConnectItem({ id: 'web', name: webOpt, type: 'Web' });
                        }}
                        className="bg-[#1F5E88] hover:bg-[#154666] text-white px-4 py-1.5 rounded-lg text-xs font-bold shadow transition-all hover:scale-105 cursor-pointer"
                      >
                        Hubungkan
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ─── MODAL 1: HUBUNGKAN INTEGRASI (CONNECT MODAL) ─── */}
      {connectItem && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="bg-gradient-to-b from-[#0f2d45] to-[#0a1f30] border border-white/15 rounded-3xl w-full max-w-md p-6 sm:p-8 shadow-[0_30px_80px_rgba(0,0,0,0.7)] relative animate-scaleUp overflow-hidden max-h-[90vh] flex flex-col">
            
            {/* Header */}
            <div className="flex justify-between items-start pb-4 border-b border-white/10 shrink-0">
              <div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-white leading-tight truncate">
                  {connectItem.name}
                </h3>
                <p className="text-white/40 text-xs mt-1">{connectItem.type} Integration</p>
              </div>
              <button
                onClick={() => setConnectItem(null)}
                className="text-white/50 hover:text-white bg-white/5 hover:bg-white/15 p-2 rounded-xl transition-all cursor-pointer shrink-0"
              >
                <X size={20} />
              </button>
            </div>

            {/* Form Body */}
            <form onSubmit={handleConnectSubmit} className="py-4 space-y-4 overflow-y-auto flex-1">
              
              {/* TERPUTUS Badge */}
              <div className="inline-flex items-center gap-2 rounded-full font-black uppercase tracking-wider px-4 py-1.5 text-xs bg-red-400/15 text-red-400 border border-red-400/30">
                <span className="rounded-full w-2.5 h-2.5 bg-red-400" />
                Terputus
              </div>

              {/* Warning Banner */}
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex gap-3">
                <WifiOff className="text-red-400 shrink-0 mt-0.5" size={20} />
                <div>
                  <h4 className="text-xs font-bold text-red-300">Koneksi Terputus</h4>
                  <p className="text-[10px] text-gray-300 mt-1 leading-normal">
                    Sistem ini tidak aktif. Masukkan kredensial baru untuk menghubungkan kembali dan melanjutkan sinkronisasi data secara real-time.
                  </p>
                </div>
              </div>

              {formError && (
                <div className="p-3 bg-red-500/15 border border-red-500/40 rounded-xl text-red-200 text-xs font-semibold text-center">
                  {formError}
                </div>
              )}

              {/* Autopopulate Helper Banner */}
              <div className="p-3 bg-[#4C92C3]/15 border border-[#4C92C3]/30 rounded-xl flex items-center justify-between gap-3">
                <div className="text-[10px] text-gray-300 leading-normal">
                  <span className="font-bold text-[#B8DDF5] block mb-0.5">💡 Butuh Kredensial Demo?</span>
                  Gunakan kredensial pengujian simulasi otomatis secara instan.
                </div>
                <button
                  type="button"
                  onClick={handleAutopopulateDemo}
                  className="px-3 py-1.5 bg-[#4C92C3] hover:bg-[#3d7ea9] text-white rounded-lg text-[10px] font-bold transition-all active:scale-95 cursor-pointer shrink-0 shadow-lg"
                >
                  Gunakan Kredensial Demo
                </button>
              </div>

              {/* Credential Inputs */}
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-300 block tracking-wide uppercase">Token API Baru</label>
                  <div className="flex items-center bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 gap-2.5 focus-within:ring-2 ring-[#4C92C3]/50 focus-within:border-[#4C92C3]/50 transition-all">
                    <Key className="text-[#B8DDF5] shrink-0" size={14} />
                    <input
                      type="password"
                      value={apiToken}
                      onChange={(e) => setApiToken(e.target.value)}
                      placeholder="sk_live_51Nx..."
                      className="bg-transparent w-full outline-none text-white text-xs placeholder:text-white/25"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-300 block tracking-wide uppercase">Client ID / Username</label>
                  <div className="flex items-center bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 gap-2.5 focus-within:ring-2 ring-[#4C92C3]/50 focus-within:border-[#4C92C3]/50 transition-all">
                    <Link2 className="text-[#B8DDF5] shrink-0" size={14} />
                    <input
                      type="text"
                      value={clientId}
                      onChange={(e) => setClientId(e.target.value)}
                      placeholder="client_cyber_prod_..."
                      className="bg-transparent w-full outline-none text-white text-xs placeholder:text-white/25"
                    />
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="pt-4 border-t border-white/10 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setConnectItem(null)}
                  className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-4 py-2.5 bg-[#4C92C3] hover:bg-[#3d7ea9] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 disabled:opacity-50 cursor-pointer shadow-lg shadow-[#4C92C3]/20"
                >
                  {actionLoading ? <RefreshCw size={12} className="animate-spin" /> : null}
                  Hubungkan Kembali
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* ─── MODAL 2: DETAIL SINKRONISASI & PUTUS KONEKSI (DISCONNECT MODAL) ─── */}
      {disconnectItem && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="bg-gradient-to-b from-[#0f2d45] to-[#0a1f30] border border-white/15 rounded-3xl w-full max-w-lg p-6 sm:p-8 shadow-[0_30px_80px_rgba(0,0,0,0.7)] relative animate-scaleUp overflow-hidden max-h-[90vh] flex flex-col">
            
            {/* Header */}
            <div className="flex justify-between items-start pb-4 border-b border-white/10 shrink-0">
              <div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-white leading-tight truncate">
                  {disconnectItem.name}
                </h3>
                <p className="text-white/40 text-xs mt-1">{disconnectItem.type}</p>
              </div>
              <button
                onClick={() => setDisconnectItem(null)}
                className="text-white/50 hover:text-white bg-white/5 hover:bg-white/15 p-2 rounded-xl transition-all cursor-pointer shrink-0"
              >
                <X size={20} />
              </button>
            </div>

            {/* Disconnect Body */}
            <div className="py-5 space-y-5 overflow-y-auto flex-1">
              
              {/* AKTIF badge */}
              <div className="inline-flex items-center gap-2 rounded-full font-black uppercase tracking-wider px-4 py-1.5 text-xs bg-green-400/15 text-green-400 border border-green-400/30">
                <span className="rounded-full w-2.5 h-2.5 bg-green-400 animate-pulse" />
                Aktif
              </div>

              {/* Info Table */}
              <div className="bg-white/5 border border-white/8 rounded-2xl overflow-hidden">
                {[
                  { label: 'Sinkronisasi Terakhir', value: 'Real-time (Baru saja)', valueClass: 'text-white font-mono text-xs' },
                  { label: 'Tipe Akses', value: 'API Token (OAuth 2.0)', valueClass: 'text-white font-mono text-xs' },
                  { label: 'Integritas Keamanan', value: '100% Terenkripsi', valueClass: 'text-green-400 font-bold text-xs' },
                  { label: 'Latensi Koneksi', value: '18ms (Optimal)', valueClass: 'text-cyan-400 font-bold text-xs' },
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

              {/* AI Insight */}
              <div className="p-4 bg-green-500/10 border border-green-500/25 rounded-2xl flex items-start gap-3">
                <ShieldCheck className="text-green-400 shrink-0 mt-0.5" size={20} />
                <div>
                  <span className="text-xs font-bold text-green-300 block">AI Insight — Fraud Score: Aman</span>
                  <span className="text-[10px] text-green-200/80 mt-0.5 block leading-relaxed">
                    Semua lalu lintas data terverifikasi bersih. Tidak ada aktivitas anomali dalam 24 jam terakhir.
                  </span>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="pt-4 border-t border-white/10 flex justify-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setDisconnectItem(null)}
                  className="px-5 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  Kembali
                </button>
                <button
                  onClick={handleDisconnectSubmit}
                  disabled={actionLoading}
                  className="px-5 py-3 bg-red-500/15 hover:bg-red-500/30 text-red-300 rounded-xl text-xs font-bold border border-red-500/30 flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                >
                  {actionLoading ? <RefreshCw size={12} className="animate-spin" /> : <WifiOff size={12} />}
                  Putuskan Koneksi API
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default MarketplacePage;
