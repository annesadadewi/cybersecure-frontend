import React from 'react';
import { formatIDR } from '../../utils/transactions';

/** Profit & kerugian per bulan (Jan–Jun) dari mock transaksi. */
const MonthlyRevenueBreakdown = ({ monthlyRevenue = [], selectedMonth, onSelectMonth }) => {
  if (!monthlyRevenue.length) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
      {monthlyRevenue.map((row) => {
        const isSelected = row.month === selectedMonth;
        return (
          <button
            key={row.month}
            type="button"
            onClick={() => onSelectMonth(row.month)}
            className={`text-left p-4 rounded-xl border transition-all cursor-pointer ${
              isSelected
                ? 'bg-[#1F5E88]/50 border-[#69C3FF]/60 ring-1 ring-[#69C3FF]/40'
                : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
            }`}
          >
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="font-black text-white text-lg">{row.month}</span>
              {row.is_partial && (
                <span className="text-[9px] font-bold uppercase text-amber-300/90 bg-amber-500/15 px-2 py-0.5 rounded-full">
                  s/d tgl 7
                </span>
              )}
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-white/50 font-semibold">Profit</span>
                <span className="text-[#10B981] font-bold">{formatIDR(row.profit)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-white/50 font-semibold">Kerugian</span>
                <span className="text-[#EF4444] font-bold">{formatIDR(row.financial_loss)}</span>
              </div>
              <p className="text-[10px] text-white/40 pt-1">{row.transaction_count} transaksi</p>
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default MonthlyRevenueBreakdown;
