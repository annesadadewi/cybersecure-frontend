import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, RefreshCw, ShieldCheck, Mail, Laptop, ShoppingBag, 
  Key, Link2, Info, WifiOff, Database as DbIcon, ShieldAlert, Plus
} from 'lucide-react';
import { marketplaceService } from '../api/marketplace';

// Import subcomponents
import MarketplaceTab from './ManajemenIntegrasi/MarketplaceTab';
import DatabaseTab from './ManajemenIntegrasi/DatabaseTab';
import PaymentTab from './ManajemenIntegrasi/PaymentTab';
import EmailTab from './ManajemenIntegrasi/EmailTab';
import WebTab from './ManajemenIntegrasi/WebTab';

const ManajemenIntegrasiPage = () => {
  const [activeTab, setActiveTab] = useState('marketplace');
  const [dbMarketplaces, setDbMarketplaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // Modals state
  const [connectItem, setConnectItem] = useState(null);
  const [disconnectItem, setDisconnectItem] = useState(null);

  // Forms state
  const [apiToken, setApiToken] = useState('');
  const [clientId, setClientId] = useState('');
  const [formError, setFormError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  // States for coreSystems (from localStorage)
  const [coreSystems, setCoreSystems] = useState([]);
  const [customIntegrations, setCustomIntegrations] = useState({
    marketplace: [],
    database: [],
    payment: [],
    email: [],
    web: [],
  });

  // Add integration form
  const [addProvider, setAddProvider] = useState('');
  const [addLabel, setAddLabel] = useState('');
  const [addFormError, setAddFormError] = useState('');

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
        { id: 'mail', name: 'Email Server Utama', status: 'Terputus', type: 'Mail' },
        { id: 'db', name: 'Database Keuangan', status: 'Terputus', type: 'Database' },
        { id: 'payment', name: 'Sistem Pembayaran (DANA, ShopeePay, Bank, dll)', status: 'Terputus', type: 'Payment' },
        { id: 'mobile', name: 'Aplikasi Mobile', status: 'Terputus', type: 'Mobile' },
        { id: 'web', name: 'Web Portal', status: 'Terputus', type: 'Web' },
      ];
      setCoreSystems(defaults);
      localStorage.setItem('cybersecure_core_systems', JSON.stringify(defaults));
    }
  };

  useEffect(() => {
    loadCoreSystems();
  }, []);

  const loadCustomIntegrations = () => {
    const saved = localStorage.getItem('cybersecure_custom_integrations');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const sanitizeNames = (items) =>
          (Array.isArray(items) ? items : []).map((it) => ({
            ...it,
            name: (it?.name || '').replace(/\s*\(Akun Tambahan\)\s*$/i, ''),
          }));

        setCustomIntegrations({
          marketplace: sanitizeNames(parsed.marketplace),
          database: sanitizeNames(parsed.database),
          payment: sanitizeNames(parsed.payment),
          email: sanitizeNames(parsed.email),
          web: sanitizeNames(parsed.web),
        });
        return;
      } catch (e) {
        console.error(e);
      }
    }
    const defaults = { marketplace: [], database: [], payment: [], email: [], web: [] };
    setCustomIntegrations(defaults);
    localStorage.setItem('cybersecure_custom_integrations', JSON.stringify(defaults));
  };

  const persistCustomIntegrations = (next) => {
    setCustomIntegrations(next);
    localStorage.setItem('cybersecure_custom_integrations', JSON.stringify(next));
  };

  useEffect(() => {
    loadCustomIntegrations();
  }, []);

  // Auto-dismiss toast notifications
  useEffect(() => {
    if (!success) return;
    const t = setTimeout(() => setSuccess(''), 1800);
    return () => clearTimeout(t);
  }, [success]);

  useEffect(() => {
    if (!error) return;
    const t = setTimeout(() => setError(''), 1800);
    return () => clearTimeout(t);
  }, [error]);

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

  const getAddOptionsForTab = (tabId) => {
    if (tabId === 'marketplace') return marketplacesOptions;
    if (tabId === 'database') return databaseOptions;
    if (tabId === 'payment') return paymentOptions;
    if (tabId === 'email') return emailOptions;
    if (tabId === 'web') return webOptions;
    return [];
  };

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
        if (connectItem.customTabId) {
          const next = { ...customIntegrations };
          const list = Array.isArray(next[connectItem.customTabId]) ? next[connectItem.customTabId] : [];
          next[connectItem.customTabId] = list.map((it) =>
            it.id === connectItem.id ? { ...it, status: 'Aktif' } : it
          );
          persistCustomIntegrations(next);
        } else {
          updateCoreSystemStatus(connectItem.id, 'Aktif');
          loadCoreSystems();
        }
        setSuccess(`Koneksi ${connectItem.name} berhasil diaktifkan kembali!`);
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
        if (disconnectItem.customTabId) {
          const next = { ...customIntegrations };
          const list = Array.isArray(next[disconnectItem.customTabId]) ? next[disconnectItem.customTabId] : [];
          next[disconnectItem.customTabId] = list.map((it) =>
            it.id === disconnectItem.id ? { ...it, status: 'Terputus' } : it
          );
          persistCustomIntegrations(next);
        } else {
          updateCoreSystemStatus(disconnectItem.id, 'Terputus');
          loadCoreSystems();
        }
        setSuccess(`Koneksi ${disconnectItem.name} berhasil diputuskan.`);
        setActionLoading(false);
        setDisconnectItem(null);
      }, 1200);
    }
  };

  const openAddIntegration = () => {
    setAddFormError('');
    setAddProvider('');
    setAddLabel('');
    setShowAddModal(true);
  };

  const handleAddIntegration = (e) => {
    e.preventDefault();
    const provider = addProvider.trim();
    const label = addLabel.trim();
    if (!provider) {
      setAddFormError('Pilih tipe/provider integrasi terlebih dahulu.');
      return;
    }
    const tabId = activeTab;
    const newItem = {
      id: `${tabId}-${provider}-${Date.now()}`,
      provider,
      name: label || provider,
      status: 'Terputus',
      typeLabel: tabId,
    };
    const next = { ...customIntegrations };
    next[tabId] = [newItem, ...(Array.isArray(next[tabId]) ? next[tabId] : [])];
    persistCustomIntegrations(next);
    setShowAddModal(false);
    setSuccess('Integrasi baru ditambahkan. Silakan hubungkan untuk mengaktifkan.');
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
      {/* Alert Notification */}
      {success && (
        <div className="p-3 bg-green-500/20 border border-green-500/50 rounded-xl text-green-200 text-xs sm:text-sm font-semibold animate-fadeIn text-center shadow-[0_0_15px_rgba(34,197,94,0.15)]">
          {success}
        </div>
      )}
      {error && (
        <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-xl text-red-100 text-xs sm:text-sm font-semibold animate-fadeIn text-center shadow-[0_0_15px_rgba(239,68,68,0.15)]">
          {error}
        </div>
      )}

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Tabs navigation */}
        <div className="flex flex-wrap gap-3">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl font-bold text-sm sm:text-base transition-all cursor-pointer ${
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

        {/* Tab Actions */}
        <div className="flex items-center lg:justify-end">
          <button
            onClick={openAddIntegration}
            className="px-7 py-4 bg-[#4C92C3] hover:bg-[#3d7ea9] text-white rounded-2xl text-base sm:text-lg font-extrabold flex items-center gap-3 transition-all shadow-lg active:scale-95"
          >
            <Plus size={20} />
            Tambah Integrasi
          </button>
        </div>
      </div>

      {/* Sub Tab component rendering */}
      <div className="space-y-4">
        {activeTab === 'marketplace' && (
          <MarketplaceTab 
            loading={loading}
            mergedMarketplaces={[
              ...customIntegrations.marketplace.map((it) => ({
                id: it.id,
                dbId: null,
                name: it.name,
                initial: (it.provider || it.name || 'M')[0],
                status: it.status === 'Aktif' ? 'Connected' : 'Not Connected',
                email: '',
                type: 'Marketplace',
                customTabId: 'marketplace',
              })),
              ...mergedMarketplaces,
            ]}
            onConnect={setConnectItem}
            onDisconnect={setDisconnectItem}
          />
        )}
        {activeTab === 'database' && (
          <DatabaseTab 
            databaseOptions={[
              ...customIntegrations.database.map((it) => it.name),
              ...databaseOptions,
            ]}
            getSystemStatus={(idOrName) => {
              const match = customIntegrations.database.find((it) => it.name === idOrName);
              if (match) return match.status;
              return getSystemStatus('db');
            }}
            customIdByName={Object.fromEntries(customIntegrations.database.map((it) => [it.name, it.id]))}
            onConnect={setConnectItem}
            onDisconnect={setDisconnectItem}
          />
        )}
        {activeTab === 'payment' && (
          <PaymentTab 
            paymentOptions={[
              ...customIntegrations.payment.map((it) => it.name),
              ...paymentOptions,
            ]}
            getSystemStatus={(idOrName) => {
              const match = customIntegrations.payment.find((it) => it.name === idOrName);
              if (match) return match.status;
              return getSystemStatus('payment');
            }}
            customIdByName={Object.fromEntries(customIntegrations.payment.map((it) => [it.name, it.id]))}
            onConnect={setConnectItem}
            onDisconnect={setDisconnectItem}
          />
        )}
        {activeTab === 'email' && (
          <EmailTab 
            emailOptions={[
              ...customIntegrations.email.map((it) => it.name),
              ...emailOptions,
            ]}
            getSystemStatus={(idOrName) => {
              const match = customIntegrations.email.find((it) => it.name === idOrName);
              if (match) return match.status;
              return getSystemStatus('mail');
            }}
            customIdByName={Object.fromEntries(customIntegrations.email.map((it) => [it.name, it.id]))}
            onConnect={setConnectItem}
            onDisconnect={setDisconnectItem}
          />
        )}
        {activeTab === 'web' && (
          <WebTab 
            webOptions={[
              ...customIntegrations.web.map((it) => it.name),
              ...webOptions,
            ]}
            getSystemStatus={(idOrName) => {
              const match = customIntegrations.web.find((it) => it.name === idOrName);
              if (match) return match.status;
              return getSystemStatus('web');
            }}
            customIdByName={Object.fromEntries(customIntegrations.web.map((it) => [it.name, it.id]))}
            onConnect={setConnectItem}
            onDisconnect={setDisconnectItem}
          />
        )}
      </div>

      {/* ─── MODAL: TAMBAH INTEGRASI ─── */}
      {showAddModal && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="bg-gradient-to-b from-[#0f2d45] to-[#0a1f30] border border-white/15 rounded-3xl w-full max-w-lg p-6 sm:p-8 shadow-[0_30px_80px_rgba(0,0,0,0.7)] relative animate-scaleUp overflow-hidden max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-start pb-4 border-b border-white/10 shrink-0">
              <div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-white leading-tight">
                  Tambah Integrasi
                </h3>
                <p className="text-white/50 text-xs mt-1">
                  Tambahkan akun/integrasi baru untuk tab <span className="text-white font-bold">{tabs.find(t => t.id === activeTab)?.label}</span>.
                </p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-white/50 hover:text-white bg-white/5 hover:bg-white/15 p-2 rounded-xl transition-all cursor-pointer shrink-0"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddIntegration} className="py-5 space-y-4 overflow-y-auto flex-1">
              {addFormError && (
                <div className="p-3 bg-red-500/15 border border-red-500/40 rounded-xl text-red-200 text-xs font-semibold text-center">
                  {addFormError}
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-300 block tracking-wide uppercase">
                  Provider / Tipe Integrasi
                </label>
                <select
                  value={addProvider}
                  onChange={(e) => setAddProvider(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-xs outline-none focus:ring-2 ring-[#4C92C3]/50"
                >
                  <option value="" className="bg-[#0a1f30]">Pilih provider...</option>
                  {getAddOptionsForTab(activeTab).map((opt) => (
                    <option key={opt} value={opt} className="bg-[#0a1f30]">{opt}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-300 block tracking-wide uppercase">
                  Nama Label (opsional)
                </label>
                <input
                  value={addLabel}
                  onChange={(e) => setAddLabel(e.target.value)}
                  placeholder="Mis. Midtrans Kayla - Production"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-xs outline-none focus:ring-2 ring-[#4C92C3]/50 placeholder:text-white/25"
                />
                <p className="text-[10px] text-white/40">
                  Kalau kosong, otomatis pakai nama provider.
                </p>
              </div>

              <div className="pt-4 border-t border-white/10 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-[#4C92C3] hover:bg-[#3d7ea9] text-white rounded-xl text-xs font-bold transition-all active:scale-95 cursor-pointer shadow-lg shadow-[#4C92C3]/20"
                >
                  Tambahkan
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* ─── MODAL 1: HUBUNGKAN INTEGRASI (CONNECT MODAL) ─── */}
      {connectItem && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="bg-gradient-to-b from-[#0f2d45] to-[#0a1f30] border border-white/15 rounded-3xl w-full max-w-2xl p-7 sm:p-9 shadow-[0_30px_80px_rgba(0,0,0,0.7)] relative animate-scaleUp overflow-hidden max-h-[90vh] flex flex-col">
            
            {/* Header */}
            <div className="flex justify-between items-start pb-4 border-b border-white/10 shrink-0">
              <div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight truncate">
                  Hubungkan {connectItem.name}
                </h3>
                <p className="text-white/50 text-sm mt-1.5">{connectItem.type} Integration</p>
              </div>
              <button
                onClick={() => setConnectItem(null)}
                className="text-white/50 hover:text-white bg-white/5 hover:bg-white/15 p-2 rounded-xl transition-all cursor-pointer shrink-0"
              >
                <X size={20} />
              </button>
            </div>

            {/* Form Body */}
            <form onSubmit={handleConnectSubmit} className="py-5 space-y-5 overflow-y-auto flex-1">
              
              {/* TERPUTUS Badge */}
              <div className="inline-flex items-center gap-2 rounded-full font-black uppercase tracking-wider px-4 py-2 text-sm bg-red-400/15 text-red-400 border border-red-400/30">
                <span className="rounded-full w-3 h-3 bg-red-400" />
                Terputus
              </div>

              {/* Warning Banner */}
              <div className="p-5 bg-red-500/10 border border-red-500/20 rounded-2xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-start gap-3">
                  <WifiOff className="text-red-400 shrink-0 mt-0.5" size={22} />
                  <div>
                    <h4 className="text-sm font-bold text-red-300">Koneksi Terputus</h4>
                    <p className="text-xs text-gray-300 mt-1 leading-normal">
                      Sistem ini tidak aktif.
                    </p>
                  </div>
                </div>
                <p className="text-xs text-gray-300 leading-normal sm:max-w-[55%]">
                    Sistem ini tidak aktif. Masukkan kredensial baru untuk menghubungkan kembali dan melanjutkan sinkronisasi data secara real-time.
                </p>
              </div>

              {formError && (
                <div className="p-3 bg-red-500/15 border border-red-500/40 rounded-xl text-red-200 text-xs font-semibold text-center">
                  {formError}
                </div>
              )}

              {/* Autopopulate Helper Banner */}
              <div className="p-4 bg-[#4C92C3]/15 border border-[#4C92C3]/30 rounded-xl flex items-center justify-between gap-3">
                <div className="text-xs text-gray-300 leading-normal">
                  <span className="font-bold text-[#B8DDF5] block mb-0.5">💡 Butuh Kredensial Demo?</span>
                  Gunakan kredensial pengujian simulasi otomatis secara instan.
                </div>
                <button
                  type="button"
                  onClick={handleAutopopulateDemo}
                  className="px-4 py-2 bg-[#4C92C3] hover:bg-[#3d7ea9] text-white rounded-lg text-xs font-bold transition-all active:scale-95 cursor-pointer shrink-0 shadow-lg"
                >
                  Gunakan Kredensial Demo
                </button>
              </div>

              {/* Credential Inputs */}
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-300 block tracking-wide uppercase">Token API Baru</label>
                  <div className="flex items-center bg-white/5 border border-white/10 rounded-xl px-4 py-3 gap-2.5 focus-within:ring-2 ring-[#4C92C3]/50 focus-within:border-[#4C92C3]/50 transition-all">
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

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-300 block tracking-wide uppercase">Client ID / Username</label>
                  <div className="flex items-center bg-white/5 border border-white/10 rounded-xl px-4 py-3 gap-2.5 focus-within:ring-2 ring-[#4C92C3]/50 focus-within:border-[#4C92C3]/50 transition-all">
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

              {/* Actions Footer */}
              <div className="pt-5 border-t border-white/10 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setConnectItem(null)}
                  className="px-5 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl text-sm font-bold transition-all cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-3 bg-[#4C92C3] hover:bg-[#3d7ea9] text-white rounded-xl text-sm font-bold flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50 cursor-pointer shadow-lg shadow-[#4C92C3]/20"
                >
                  {actionLoading ? <RefreshCw size={14} className="animate-spin" /> : null}
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
          <div className="bg-gradient-to-b from-[#0f2d45] to-[#0a1f30] border border-white/15 rounded-3xl w-full max-w-2xl p-7 sm:p-9 shadow-[0_30px_80px_rgba(0,0,0,0.7)] relative animate-scaleUp overflow-hidden max-h-[90vh] flex flex-col">
            
            {/* Header */}
            <div className="flex justify-between items-start pb-4 border-b border-white/10 shrink-0">
              <div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight truncate">
                  {disconnectItem.name}
                </h3>
                <p className="text-white/50 text-sm mt-1.5">{disconnectItem.type}</p>
              </div>
              <button
                onClick={() => setDisconnectItem(null)}
                className="text-white/50 hover:text-white bg-white/5 hover:bg-white/15 p-2 rounded-xl transition-all cursor-pointer shrink-0"
              >
                <X size={20} />
              </button>
            </div>

            {/* Disconnect Body */}
            <div className="py-6 space-y-6 overflow-y-auto flex-1">
              
              {/* AKTIF badge */}
              <div className="inline-flex items-center gap-2 rounded-full font-black uppercase tracking-wider px-4 py-2 text-sm bg-green-400/15 text-green-400 border border-green-400/30">
                <span className="rounded-full w-3 h-3 bg-green-400 animate-pulse" />
                Aktif
              </div>

              {/* Info Table */}
              <div className="bg-white/5 border border-white/8 rounded-2xl overflow-hidden">
                {[
                  { label: 'Sinkronisasi Terakhir', value: 'Real-time (Baru saja)', valueClass: 'text-white font-mono text-sm' },
                  { label: 'Tipe Akses', value: 'API Token (OAuth 2.0)', valueClass: 'text-white font-mono text-sm' },
                  { label: 'Integritas Keamanan', value: '100% Terenkripsi', valueClass: 'text-green-400 font-bold text-sm' },
                  { label: 'Latensi Koneksi', value: '18ms (Optimal)', valueClass: 'text-cyan-400 font-bold text-sm' },
                ].map((row, idx, arr) => (
                  <div
                    key={row.label}
                    className={`flex justify-between items-center px-5 py-3.5 text-sm ${idx < arr.length - 1 ? 'border-b border-white/5' : ''}`}
                  >
                    <span className="text-gray-400 text-sm">{row.label}</span>
                    <span className={row.valueClass}>{row.value}</span>
                  </div>
                ))}
              </div>

              {/* AI Insight */}
              <div className="p-5 bg-green-500/10 border border-green-500/25 rounded-2xl flex items-start gap-3">
                <ShieldCheck className="text-green-400 shrink-0 mt-0.5" size={22} />
                <div>
                  <span className="text-sm font-bold text-green-300 block">AI Insight — Fraud Score: Aman</span>
                  <span className="text-xs text-green-200/80 mt-1 block leading-relaxed">
                    Semua lalu lintas data terverifikasi bersih. Tidak ada aktivitas anomali dalam 24 jam terakhir.
                  </span>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="pt-5 border-t border-white/10 flex justify-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setDisconnectItem(null)}
                  className="px-5 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl text-sm font-bold transition-all cursor-pointer"
                >
                  Kembali
                </button>
                <button
                  onClick={handleDisconnectSubmit}
                  disabled={actionLoading}
                  className="px-5 py-3 bg-red-500/15 hover:bg-red-500/30 text-red-300 rounded-xl text-sm font-bold border border-red-500/30 flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                >
                  {actionLoading ? <RefreshCw size={14} className="animate-spin" /> : <WifiOff size={14} />}
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

export default ManajemenIntegrasiPage;
