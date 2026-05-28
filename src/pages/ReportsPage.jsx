import React, { useState, useEffect } from 'react';
import { theme } from '../Theme';
import { TrendingDown, TrendingUp, RefreshCw, Clock } from 'lucide-react';
import { marketplaceService } from '../api/marketplace';

const ReportsPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState('Jan');

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const data = await marketplaceService.getTransactions();
        setTransactions(data);
      } catch (err) {
        console.error('Error fetching transactions in Reports:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  const getMonthKey = (dateStr) => {
    const date = new Date(dateStr);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[date.getMonth()];
  };

  const isFutureMonth = (monthName) => {
    const monthMap = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11 };
    const now = new Date();
    const currentMonth = now.getMonth(); // 0-indexed, e.g. 4 for May
    return monthMap[monthName] > currentMonth;
  };

  // Group tracked transactions by month
  const monthlyTrackedRevenue = {};
  transactions.forEach(tx => {
    const m = getMonthKey(tx.transaction_date);
    monthlyTrackedRevenue[m] = (monthlyTrackedRevenue[m] || 0) + Number(tx.amount);
  });

  const mockData = {
    Jan: { revenue: 842000000, expenses: 124000000, lossTrend: '5.2%', profitTrend: '12.8%' },
    Feb: { revenue: 750000000, expenses: 110000000, lossTrend: '4.5%', profitTrend: '10.2%' },
    Mar: { revenue: 910000000, expenses: 135000000, lossTrend: '6.1%', profitTrend: '14.5%' },
    Apr: { revenue: 820000000, expenses: 118000000, lossTrend: '5.0%', profitTrend: '11.9%' },
    May: { revenue: 890000000, expenses: 128000000, lossTrend: '5.5%', profitTrend: '12.5%' },
    Jun: { revenue: 880000000, expenses: 130000000, lossTrend: '5.8%', profitTrend: '13.2%' },
  };

  // Resolve data for all months
  const monthsList = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const resolvedData = {};

  monthsList.forEach(m => {
    if (isFutureMonth(m)) {
      resolvedData[m] = {
        revenue: null,
        expenses: null,
        netProfit: null,
        lossTrend: '—',
        profitTrend: '—',
        isDynamic: false,
        isFuture: true
      };
    } else {
      const trackedRev = monthlyTrackedRevenue[m] || 0;
      if (trackedRev > 0) {
        // Overwrite with dynamic tracked data
        const exp = Math.round(trackedRev * 0.15); // 15% expenses
        resolvedData[m] = {
          revenue: trackedRev,
          expenses: exp,
          netProfit: trackedRev - exp,
          lossTrend: '3.8%',
          profitTrend: '14.1%',
          isDynamic: true,
          isFuture: false
        };
      } else {
        // Use mock
        const mock = mockData[m];
        resolvedData[m] = {
          revenue: mock.revenue,
          expenses: mock.expenses,
          netProfit: mock.revenue - mock.expenses,
          lossTrend: mock.lossTrend,
          profitTrend: mock.profitTrend,
          isDynamic: false,
          isFuture: false
        };
      }
    }
  });

  const activeData = resolvedData[selectedMonth] || resolvedData['Jan'];

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
      const rounded = millions % 1 === 0 ? millions.toFixed(0) : millions.toFixed(1);
      formattedVal = `${rounded}M`;
    } else {
      formattedVal = new Intl.NumberFormat('id-ID', {
        minimumFractionDigits: 0
      }).format(val);
    }
    
    if (type === 'loss') {
      return `-Rp ${formattedVal}`;
    }
    if (type === 'profit') {
      return `+Rp ${formattedVal}`;
    }
    return `Rp ${formattedVal}`;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-white/70">
        <RefreshCw size={44} className="animate-spin mb-4 text-[#B8DDF5]" />
        <p className="text-xl font-medium">Memuat Laporan Keuangan...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 sm:space-y-12 animate-fadeIn">
      {/* Top Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
        {/* Financial Loss Card */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-[#1E1B1B]/40 to-[#EF4444]/15 border border-[#EF4444]/30 shadow-[0_8px_30px_rgb(239,68,68,0.1)] flex flex-col justify-between min-h-[140px] lg:min-h-[150px] transition-all duration-300 hover:scale-[1.01]">
          <div>
            <p className="text-[#EF4444] text-[10px] sm:text-xs font-bold mb-1 uppercase tracking-widest">Financial Loss</p>
            <h3 className="text-2xl sm:text-3xl font-black text-[#EF4444] tracking-tight">
              {formatCurrency(activeData.expenses, 'loss')}
            </h3>
          </div>
          {activeData.isFuture ? (
            <p className="text-white/40 text-[10px] font-bold flex items-center gap-1.5 mt-4">
              <Clock size={12} />
              Periode Mendatang
            </p>
          ) : (
            <p className="text-[#EF4444]/80 text-[10px] font-bold flex items-center gap-1.5 mt-4">
              <TrendingDown size={12} />
              {activeData.lossTrend} from last month
            </p>
          )}
        </div>

        {/* Profit Card */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-[#122A1E]/40 to-[#10B981]/15 border border-[#10B981]/30 shadow-[0_8px_30px_rgb(16,185,129,0.1)] flex flex-col justify-between min-h-[140px] lg:min-h-[150px] transition-all duration-300 hover:scale-[1.01]">
          <div>
            <p className="text-[#10B981] text-[10px] sm:text-xs font-bold mb-1 uppercase tracking-widest">Profit</p>
            <h3 className="text-2xl sm:text-3xl font-black text-[#10B981] tracking-tight">
              {formatCurrency(activeData.netProfit, 'profit')}
            </h3>
          </div>
          {activeData.isFuture ? (
            <p className="text-white/40 text-[10px] font-bold flex items-center gap-1.5 mt-4">
              <Clock size={12} />
              Periode Mendatang
            </p>
          ) : (
            <p className="text-[#10B981]/80 text-[10px] font-bold flex items-center gap-1.5 mt-4">
              <TrendingUp size={12} />
              {activeData.profitTrend} from last month
            </p>
          )}
        </div>
      </div>

      {/* Monthly Revenue Section */}
      <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight">Monthly Revenue</h2>
          <div className="flex items-center gap-2">
            {activeData.isDynamic && (
              <span className="bg-[#1F5E88]/30 text-[#B8DDF5] px-3.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border border-[#B8DDF5]/20 animate-pulse">
                ⚡ Live Tracked
              </span>
            )}
            {activeData.isFuture && (
              <span className="bg-white/5 text-white/50 px-3.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border border-white/10">
                📅 Periode Mendatang
              </span>
            )}
          </div>
        </div>
        
        {/* Revenue Summary Container */}
        <div className="p-6 sm:p-10 rounded-2xl sm:rounded-3xl bg-gradient-to-b from-[#164E75]/95 to-[#0F3957]/95 shadow-2xl border border-white/10 space-y-8 sm:space-y-12">
          
          {/* Month Selector (Inside) - Responsive Wrapping */}
          <div className="flex flex-wrap justify-center sm:justify-between items-center gap-2 sm:gap-4 px-2 sm:px-6 border-b border-white/10 pb-6 sm:pb-8">
            {monthsList.map((month) => {
              const isSelected = selectedMonth === month;
              const hasData = (monthlyTrackedRevenue[month] || 0) > 0;
              return (
                <button
                  key={month}
                  onClick={() => setSelectedMonth(month)}
                  className={`text-base sm:text-lg lg:text-xl font-bold transition-all px-3 py-1.5 flex flex-col items-center justify-center outline-none cursor-pointer relative ${
                    isSelected 
                      ? 'text-white scale-110' 
                      : 'text-white/40 hover:text-white/70'
                  }`}
                >
                  <span className="relative z-10">{month}</span>
                  <span className={`w-6 sm:w-8 h-0.5 sm:h-1 bg-[#69C3FF] rounded-full mt-1 sm:mt-1.5 transition-all duration-300 ${isSelected ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}></span>
                  {hasData && !isSelected && (
                    <span className="absolute top-1.5 right-1 w-2 h-2 bg-emerald-400 rounded-full border border-[#164E75]"></span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Revenue Summary Details */}
          {activeData.isFuture ? (
            <div className="flex flex-col items-center justify-center py-10 sm:py-16 text-center space-y-4 sm:space-y-5 animate-fadeIn">
              <div className="p-4 sm:p-5 bg-[#1F5E88]/30 rounded-full border border-[#69C3FF]/30 text-[#69C3FF] shadow-[0_0_25px_rgba(105,195,255,0.15)]">
                <Clock size={36} className="animate-pulse" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl sm:text-2xl font-extrabold text-[#B8DDF5] tracking-tight">Belum Ada Hasil Transaksi</h3>
                <p className="text-[#B8DDF5]/70 text-xs sm:text-sm font-medium max-w-md mx-auto leading-relaxed px-4">
                  Periode bulan ini belum berjalan. Ringkasan keuangan akan otomatis terisi setelah aktivitas transaksi tercatat oleh sistem.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 text-center">
              {/* Total Revenue */}
              <div className="space-y-1.5 sm:space-y-3">
                <p className="text-white/60 text-xs sm:text-sm font-bold uppercase tracking-wider">Total Revenue</p>
                <h4 className="text-xl sm:text-2xl lg:text-3xl font-black text-[#B8DDF5] transition-all">
                  {formatCurrency(activeData.revenue)}
                </h4>
              </div>
              {/* Total Expenses */}
              <div className="space-y-1.5 sm:space-y-3">
                <p className="text-white/60 text-xs sm:text-sm font-bold uppercase tracking-wider">Total Expenses</p>
                <h4 className="text-xl sm:text-2xl lg:text-3xl font-black text-[#EF4444] transition-all">
                  {formatCurrency(activeData.expenses)}
                </h4>
              </div>
              {/* Net Profit */}
              <div className="space-y-1.5 sm:space-y-3">
                <p className="text-white/60 text-xs sm:text-sm font-bold uppercase tracking-wider">Net Profit</p>
                <h4 className="text-xl sm:text-2xl lg:text-3xl font-black text-[#10B981] transition-all">
                  {formatCurrency(activeData.netProfit)}
                </h4>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default ReportsPage;
