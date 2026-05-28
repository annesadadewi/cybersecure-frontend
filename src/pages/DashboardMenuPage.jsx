import React, { useState, useEffect } from 'react';
import { Activity, RefreshCw, AlertCircle, ShieldAlert, ShieldCheck, Link2 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { theme } from '../Theme';
import { marketplaceService } from '../api/marketplace';

const DashboardPage = ({ setActiveMenu }) => {
  const [loading, setLoading] = useState(true);
  const [marketplaces, setMarketplaces] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch both marketplaces and transactions in parallel
      const [mpData, txData] = await Promise.all([
        marketplaceService.getMarketplaces(),
        marketplaceService.getTransactions()
      ]);
      setMarketplaces(mpData);
      setTransactions(txData);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Gagal memuat data dari server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const connectedMarketplaces = marketplaces.filter(item => item.status === 'connected');
  const connectedCount = connectedMarketplaces.length;

  // Align card logic with "Total Integrasi" page:
  // count current saved systems + current marketplace records (connected OR disconnected).
  const getTotalIntegrationCount = () => {
    const defaultCoreSystems = [
      { id: 'mail' },
      { id: 'db' },
      { id: 'payment' },
      { id: 'mobile' },
      { id: 'web' },
    ];
    const safeParse = (raw, fallback) => {
      try {
        return JSON.parse(raw);
      } catch {
        return fallback;
      }
    };
    const savedCore = localStorage.getItem('cybersecure_core_systems');
    const coreSystems = savedCore ? safeParse(savedCore, defaultCoreSystems) : defaultCoreSystems;
    const coreCount = Array.isArray(coreSystems) ? coreSystems.length : defaultCoreSystems.length;
    const marketplaceCount = marketplaces.length;
    return coreCount + marketplaceCount;
  };

  const totalIntegrationCount = getTotalIntegrationCount();

  // Formatting helpers
  const formatIDR = (num) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(num);
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // 1. Calculate KPI Metrics
  const totalOmzet = transactions.reduce((sum, tx) => sum + Number(tx.amount), 0);
  const totalTxCount = transactions.length;

  // 2. Prepare Chart Data (Group by date, sort chronologically)
  const chartGroup = {};
  transactions.forEach(tx => {
    const d = new Date(tx.transaction_date);
    const dayKey = d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
    chartGroup[dayKey] = (chartGroup[dayKey] || 0) + Number(tx.amount);
  });

  // Convert chart group to array format sorted chronologically
  const sortedDates = Object.keys(chartGroup).sort((a, b) => new Date(a) - new Date(b));
  const chartData = sortedDates.map(dateKey => ({
    name: dateKey,
    Omzet: chartGroup[dateKey]
  }));

  // Fallback chart data if empty
  const defaultChartData = [
    { name: 'Senin', Omzet: 0 },
    { name: 'Selasa', Omzet: 0 },
    { name: 'Rabu', Omzet: 0 },
    { name: 'Kamis', Omzet: 0 },
    { name: 'Jumat', Omzet: 0 },
    { name: 'Sabtu', Omzet: 0 },
    { name: 'Minggu', Omzet: 0 }
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-white/70">
        <RefreshCw size={44} className="animate-spin mb-4 text-[#B8DDF5]" />
        <p className="text-xl font-medium">Memuat Analisis Keamanan Keuangan...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn text-white">
      {/* Responsive KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {[
          { 
            icon: ShieldAlert, 
            text: 'Anomali Terdeteksi', 
            val: '24 Kasus', 
            color: '#EF4444', 
            action: () => setActiveMenu('Anomali Terdeteksi') 
          },
          { 
            icon: ShieldCheck, 
            text: 'System Integrity', 
            val: '99.9%', 
            color: '#10B981', 
            action: () => setActiveMenu('System Integrity') 
          },
          { 
            icon: Link2, 
            text: 'Total Integrasi', 
            val: `${totalIntegrationCount} Akun`, 
            color: '#2A65E8', 
            action: () => setActiveMenu('Total Integrasi') 
          },
        ].map((card, i) => (
          <div 
            key={i} 
            onClick={card.action}
            className="p-5 lg:p-6 rounded-2xl lg:rounded-3xl hover:scale-[1.02] active:scale-[0.99] transition-all flex flex-col justify-between h-36 lg:h-40 shadow-xl border border-white/10 cursor-pointer hover:border-[#69C3FF]/30 hover:shadow-[0_12px_24px_rgba(31,94,136,0.15)] bg-gradient-to-br from-[#F0F9FF] to-[#E0F2FE]" 
          >
            <div className="p-2.5 w-fit rounded-xl" style={{ backgroundColor: `${card.color}15`, color: card.color }}>
              <card.icon size={22} strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#1F5E88]/80">{card.text}</p>
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-black mt-0.5 text-[#0D2C3D]">{card.val}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Layout */}
      {connectedCount === 0 ? (
        <div className="p-6 sm:p-10 rounded-2xl sm:rounded-3xl border border-white/10 bg-[#B8DDF5]/10 backdrop-blur-md text-center max-w-2xl mx-auto space-y-5 sm:space-y-6">
          <AlertCircle size={48} className="mx-auto text-[#B8DDF5] opacity-80 sm:block hidden" />
          <AlertCircle size={36} className="mx-auto text-[#B8DDF5] opacity-80 sm:hidden" />
          <h3 className="text-xl sm:text-2xl font-bold">Belum Ada Marketplace Terhubung</h3>
          <p className="text-white/80 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
            Silakan hubungkan toko marketplace Anda terlebih dahulu di menu Marketplace untuk mensimulasikan penarikan data transaksi finansial secara otomatis.
          </p>
          <button
            onClick={() => setActiveMenu('Marketplace')}
            className="bg-[#B8DDF5] text-[#1F5E88] font-bold text-xs sm:text-sm px-6 py-3 rounded-xl hover:bg-white transition-all transform hover:scale-105 active:scale-95 shadow-lg cursor-pointer"
          >
            Hubungkan Sekarang
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart Section (2 cols) */}
          <div className="lg:col-span-2 p-5 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl shadow-xl flex flex-col justify-between border border-white/10 bg-gradient-to-b from-[#B8DDF5]/15 to-[#B8DDF5]/5 backdrop-blur-md">
            <div className="mb-4">
              <h3 className="text-lg sm:text-xl font-bold mb-0.5">Threat & Sales Analysis</h3>
              <p className="text-white/60 text-xs sm:text-sm">Tren omzet transaksi digital terintegrasi</p>
            </div>
            <div className="h-64 sm:h-72 lg:h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData.length > 0 ? chartData : defaultChartData}>
                  <defs>
                    <linearGradient id="colorOmzet" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#69C3FF" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#69C3FF" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} stroke="rgba(255,255,255,0.6)" fontSize={11} />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    stroke="rgba(255,255,255,0.6)"
                    tickFormatter={(val) => `Rp ${val / 1000}k`}
                    fontSize={11}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1F5E88', borderRadius: '0.75rem', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', fontSize: '12px' }}
                    formatter={(value) => [formatIDR(value), 'Omzet']}
                  />
                  <Area type="monotone" dataKey="Omzet" stroke="#69C3FF" strokeWidth={2.5} fillOpacity={1} fill="url(#colorOmzet)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Transactions Log Section (1 col) */}
          <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl shadow-xl border border-white/10 bg-gradient-to-b from-[#B8DDF5]/15 to-[#B8DDF5]/5 backdrop-blur-md flex flex-col">
            <div className="mb-4">
              <h3 className="text-lg sm:text-xl font-bold mb-0.5">Log Transaksi Terkini</h3>
              <p className="text-white/60 text-xs">Simulasi penarikan data transaksi terbaru</p>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3.5 max-h-[300px] lg:max-h-[340px] pr-1 scrollbar-thin">
              {transactions.length === 0 ? (
                <div className="text-center py-10 text-white/50 text-xs">
                  Tidak ada log transaksi.
                </div>
              ) : (
                transactions.slice(0, 8).map((tx, idx) => (
                  <div 
                    key={idx} 
                    className="p-3 bg-white/5 hover:bg-white/10 transition-all rounded-xl flex items-center justify-between border border-white/5"
                  >
                    <div className="space-y-0.5 max-w-[65%] min-w-0">
                      <span className="text-[9px] uppercase font-extrabold tracking-wider text-[#69C3FF] block truncate">
                        {tx.marketplace_name}
                      </span>
                      <span className="text-xs sm:text-sm font-bold block text-white truncate">
                        {tx.product_name}
                      </span>
                      <span className="text-[9px] text-white/60 block">
                        {formatDate(tx.transaction_date)}
                      </span>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-xs sm:text-sm font-black text-[#10B981] block">
                        +{formatIDR(tx.amount)}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;