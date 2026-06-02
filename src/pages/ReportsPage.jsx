import React, { useState, useEffect, useCallback } from 'react';
import { TrendingDown, TrendingUp, RefreshCw, Clock } from 'lucide-react';
import api from '../api/axios';
import { transactionService } from '../api/transactions';
import SalesTrendChart from '../components/reports/SalesTrendChart';
import SalesSummarySection from '../components/reports/SalesSummarySection';
import MonthlyRevenueBreakdown from '../components/reports/MonthlyRevenueBreakdown';
import {
  REPORT_YEAR,
  isFutureMonth,
  getDefaultReportMonth,
  formatTrendPercent,
} from '../utils/reportMonths';

const ReportsPage = () => {
  const [selectedMonth, setSelectedMonth] = useState('Jan');
  const [monthsOverview, setMonthsOverview] = useState({});
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const [monthLoading, setMonthLoading] = useState(false);
  const [loadError, setLoadError] = useState(null);
  const [exportingPdf, setExportingPdf] = useState(false);

  const loadMonthlyReport = useCallback(async (month) => {
    setMonthLoading(true);
    try {
      const data = await transactionService.getMonthlyReport(month, REPORT_YEAR);
      setReport(data);
    } catch (err) {
      console.error('Error fetching monthly report:', err);
      setReport(null);
    } finally {
      setMonthLoading(false);
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      try {
        const overview = await transactionService.getMonthsOverview(REPORT_YEAR);
        const months = overview?.months || {};
        setMonthsOverview(months);
        setMonthlyRevenue(overview?.monthly_revenue || []);
        const defaultMonth = getDefaultReportMonth(months);
        setSelectedMonth(defaultMonth);
      } catch (err) {
        console.error('Error initializing reports:', err);
        const status = err?.response?.status;
        setLoadError(
          status === 401
            ? 'Sesi habis — logout lalu login lagi.'
            : 'Tidak bisa memuat laporan. Pastikan backend jalan (php artisan serve) di http://127.0.0.1:8000'
        );
        setSelectedMonth('Jan');
      } finally {
        setLoading(false);
        setInitialized(true);
      }
    };
    init();
  }, []);

  useEffect(() => {
    if (!initialized) return;
    loadMonthlyReport(selectedMonth);
  }, [selectedMonth, initialized, loadMonthlyReport]);

  const month = selectedMonth;
  const isFuture = isFutureMonth(month, REPORT_YEAR);
  const metrics = report?.metrics || {};
  const chartData = report?.chart || [];
  const monthTransactions = report?.transactions || [];
  const monthSummary = report?.summary || {
    income_total: 0,
    refund_total: 0,
    net_total: 0,
    transaction_count: 0,
  };
  const hasData = (monthsOverview[month]?.has_data ?? monthTransactions.length > 0) && !isFuture;

  /** Unduh PDF: Axios arraybuffer → Blob URL → anchor virtual (IDM tidak intercept XHR). */
  const handleDownloadPDF = useCallback(async (month) => {
    setExportingPdf(true);
    try {
      const response = await api.get('/reports/export', {
        params: {
          month,
          format: 'pdf',
          year: REPORT_YEAR,
        },
        responseType: 'arraybuffer',
      });

      const blob = new Blob([response.data], { type: 'application/pdf' });

      const header = new Uint8Array(await blob.slice(0, 4).arrayBuffer());
      if (header[0] !== 0x25 || header[1] !== 0x50 || header[2] !== 0x44 || header[3] !== 0x46) {
        throw new Error('Respons server bukan file PDF valid.');
      }

      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `ringkasan-penjualan-${month}.pdf`;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Error download:', error);
      alert('Terjadi kesalahan jaringan atau timeout saat menyiapkan data PDF.');
    } finally {
      setExportingPdf(false);
    }
  }, []);

  const formatCurrency = (val, type) => {
    if (val === null || val === undefined) {
      if (type === 'loss') return 'Rp —';
      if (type === 'profit') return 'Rp —';
      return 'Rp —';
    }
    if (val === 0) {
      if (type === 'loss') return '-Rp 0';
      if (type === 'profit') return '+Rp 0';
      return 'Rp 0';
    }
    const isMillionOrMore = Math.abs(val) >= 1000000;
    let formattedVal = '';
    if (isMillionOrMore) {
      const millions = val / 1000000;
      formattedVal = millions % 1 === 0 ? millions.toFixed(0) : millions.toFixed(1);
      formattedVal = `${formattedVal}M`;
    } else {
      formattedVal = new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(val);
    }
    if (type === 'loss') return `-Rp ${formattedVal}`;
    if (type === 'profit') return `+Rp ${formattedVal}`;
    return `Rp ${formattedVal}`;
  };

  const lossTrend = formatTrendPercent(metrics.loss_trend_percent);
  const profitTrend = formatTrendPercent(metrics.profit_trend_percent);
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-white/70">
        <RefreshCw size={44} className="animate-spin mb-4 text-[#B8DDF5]" />
        <p className="text-xl font-medium">Memuat data transaksi mock...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 sm:space-y-10 animate-fadeIn">
      {loadError && (
        <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-amber-100 text-sm">
          {loadError}
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
        <div className="p-5 rounded-2xl bg-gradient-to-br from-[#1E1B1B]/40 to-[#EF4444]/15 border border-[#EF4444]/30 shadow-[0_8px_30px_rgb(239,68,68,0.1)] flex flex-col justify-between min-h-[140px] transition-all hover:scale-[1.01]">
          <div>
            <p className="text-[#EF4444] text-[10px] sm:text-xs font-bold mb-1 uppercase tracking-widest">Financial Loss</p>
            <h3 className="text-2xl sm:text-3xl font-black text-[#EF4444] tracking-tight">
              {monthLoading ? (
                <span className="text-white/40 text-lg">...</span>
              ) : (
                formatCurrency(metrics.financial_loss ?? 0, 'loss')
              )}
            </h3>
            <p className="text-white/40 text-[10px] mt-1 font-medium">
              Refund · anomali · transaksi berisiko · {month} {REPORT_YEAR}
            </p>
          </div>
          {isFuture ? (
            <p className="text-white/40 text-[10px] font-bold flex items-center gap-1.5 mt-4">
              <Clock size={12} />
              Periode Mendatang
            </p>
          ) : (
            <p className="text-[#EF4444]/80 text-[10px] font-bold flex items-center gap-1.5 mt-4">
              <TrendingDown size={12} />
              {lossTrend} from last month
            </p>
          )}
        </div>

        <div className="p-5 rounded-2xl bg-gradient-to-br from-[#122A1E]/40 to-[#10B981]/15 border border-[#10B981]/30 shadow-[0_8px_30px_rgb(16,185,129,0.1)] flex flex-col justify-between min-h-[140px] transition-all hover:scale-[1.01]">
          <div>
            <p className="text-[#10B981] text-[10px] sm:text-xs font-bold mb-1 uppercase tracking-widest">Profit</p>
            <h3 className="text-2xl sm:text-3xl font-black text-[#10B981] tracking-tight">
              {monthLoading ? (
                <span className="text-white/40 text-lg">...</span>
              ) : (
                formatCurrency(metrics.profit ?? 0, 'profit')
              )}
            </h3>
            <p className="text-white/40 text-[10px] mt-1 font-medium">
              Total pemasukan sukses · {month} {REPORT_YEAR}
            </p>
          </div>
          {isFuture ? (
            <p className="text-white/40 text-[10px] font-bold flex items-center gap-1.5 mt-4">
              <Clock size={12} />
              Periode Mendatang
            </p>
          ) : (
            <p className="text-[#10B981]/80 text-[10px] font-bold flex items-center gap-1.5 mt-4">
              <TrendingUp size={12} />
              {profitTrend} from last month
            </p>
          )}
        </div>
      </div>

      <div className="space-y-5 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight">Monthly Revenue</h2>
          <div className="flex items-center gap-2">
            {hasData && (
              <span className="bg-[#1F5E88]/40 text-[#B8DDF5] px-3.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border border-[#69C3FF]/30">
                Live dari mock transaksi
              </span>
            )}
          </div>
        </div>

        <div className="p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-gradient-to-b from-[#164E75]/95 to-[#0F3957]/95 shadow-2xl border border-white/10 space-y-6 sm:space-y-8">
          <div className="space-y-3">
            <p className="text-white/60 text-xs font-bold uppercase tracking-wider">Profit & kerugian per bulan</p>
            {monthlyRevenue.length === 0 ? (
              <p className="text-white/50 text-sm text-center py-6">
                Belum ada data. Jalankan:{' '}
                <code className="text-[#69C3FF]">php artisan db:seed --class=MockTransactionSeeder</code>
              </p>
            ) : (
              <MonthlyRevenueBreakdown
                monthlyRevenue={monthlyRevenue}
                selectedMonth={month}
                onSelectMonth={setSelectedMonth}
              />
            )}
          </div>

          <SalesTrendChart
            embedded
            chartData={chartData}
            selectedMonth={month}
            isFuture={isFuture}
            loading={monthLoading}
            transactionCount={monthTransactions.length}
          />
        </div>
      </div>

      <SalesSummarySection
        selectedMonth={month}
        isFuture={isFuture}
        transactions={monthTransactions}
        summary={monthSummary}
        totalInPool={Object.values(monthsOverview).reduce((s, m) => s + (m?.transaction_count || 0), 0)}
        onDownloadPdf={handleDownloadPDF}
        exportingPdf={exportingPdf}
      />
    </div>
  );
};

export default ReportsPage;
