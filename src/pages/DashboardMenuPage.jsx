import React, { useState, useEffect } from 'react';
import { RefreshCw, ShieldAlert, ShieldCheck, Link2 } from 'lucide-react';
import { marketplaceService } from '../api/marketplace';
import { transactionService } from '../api/transactions';
import { anomalyService } from '../api/anomalies';
import TransactionLogList from '../components/TransactionLogList';
import SuspiciousActivityModal from '../components/anomaly/SuspiciousActivityModal';
import AnomalyRiskChart from '../components/dashboard/AnomalyRiskChart';

const DashboardPage = ({ setActiveMenu }) => {
  const [loading, setLoading] = useState(true);
  const [marketplaces, setMarketplaces] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [anomalyModalOpen, setAnomalyModalOpen] = useState(false);
  const [anomalyMetrics, setAnomalyMetrics] = useState({ total: 0 });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [mpData, recentTx, metrics] = await Promise.all([
        marketplaceService.getMarketplaces(),
        transactionService.getRecent(15),
        anomalyService.getMetrics().catch(() => null),
      ]);
      setMarketplaces(mpData);
      setTransactions(Array.isArray(recentTx) ? recentTx : []);
      if (metrics) setAnomalyMetrics(metrics);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 45000);
    return () => clearInterval(interval);
  }, []);

  const getTotalIntegrationCount = () => {
    // 1. Core systems
    const savedCore = localStorage.getItem('cybersecure_core_systems');
    let activeCoreCount = 0;
    if (savedCore) {
      try {
        const coreSystems = JSON.parse(savedCore);
        if (Array.isArray(coreSystems)) {
          activeCoreCount = coreSystems.filter(sys => sys.status === 'Aktif').length;
        }
      } catch (e) {
        console.error(e);
      }
    }

    // 2. Custom integrations from localStorage
    const savedCustom = localStorage.getItem('cybersecure_custom_integrations');
    let activeCustomCount = 0;
    if (savedCustom) {
      try {
        const custom = JSON.parse(savedCustom);
        if (custom) {
          Object.values(custom).forEach(list => {
            if (Array.isArray(list)) {
              activeCustomCount += list.filter(item => item.status === 'Aktif').length;
            }
          });
        }
      } catch (e) {
        console.error(e);
      }
    }

    // 3. Marketplaces from backend
    const activeMarketplaceCount = marketplaces.filter(mp => mp.status === 'connected').length;

    return activeCoreCount + activeCustomCount + activeMarketplaceCount;
  };

  const totalIntegrationCount = getTotalIntegrationCount();
  const hasActiveIntegrations = totalIntegrationCount > 0;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-white/70">
        <RefreshCw size={44} className="animate-spin mb-4 text-[#B8DDF5]" />
        <p className="text-xl font-medium">Memuat monitoring keamanan real-time...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn text-white">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {[
          {
            icon: ShieldAlert,
            text: 'Anomali Terdeteksi',
            val: `${anomalyMetrics.total ?? 0} Kasus`,
            color: '#EF4444',
            action: () => setAnomalyModalOpen(true),
          },
          {
            icon: ShieldCheck,
            text: 'System Integrity',
            val: hasActiveIntegrations ? '99.9%' : 'N/A',
            color: hasActiveIntegrations ? '#10B981' : '#6B7280',
            action: () => setActiveMenu('System Integrity'),
          },
          {
            icon: Link2,
            text: 'Total Integrasi',
            val: `${totalIntegrationCount} Akun`,
            color: '#2A65E8',
            action: () => setActiveMenu('Total Integrasi'),
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-5">
        <AnomalyRiskChart />

        <div className="lg:col-span-1 p-3 sm:p-4 rounded-2xl sm:rounded-3xl shadow-xl border border-white/10 bg-gradient-to-b from-[#B8DDF5]/15 to-[#B8DDF5]/5 backdrop-blur-md flex flex-col min-h-[320px]">
          <div className="mb-2">
            <h3 className="text-base sm:text-lg font-bold mb-0.5">Log Transaksi Terkini</h3>
            <p className="text-white/50 text-[10px] sm:text-xs leading-snug">
              Pemantauan real-time — masuk, retur & pembatalan · ringkasan lengkap di menu Reports
            </p>
          </div>

          <TransactionLogList
            transactions={transactions}
            emptyAction={
              <p className="text-white/40">
                Hubungkan marketplace di{' '}
                <button
                  type="button"
                  onClick={() => setActiveMenu('Manajemen Integrasi')}
                  className="text-[#69C3FF] underline font-bold cursor-pointer"
                >
                  Manajemen Integrasi
                </button>
              </p>
            }
          />
        </div>
      </div>

      <SuspiciousActivityModal open={anomalyModalOpen} onClose={() => setAnomalyModalOpen(false)} />
    </div>
  );
};

export default DashboardPage;
