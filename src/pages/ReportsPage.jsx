import React from 'react';
import { theme } from '../Theme';
import { TrendingDown, TrendingUp } from 'lucide-react';

const ReportsPage = () => {
  return (
    <div className="space-y-12 animate-fadeIn">
      {/* Top Cards Section */}
      <div className="grid grid-cols-2 gap-10">
        {/* Financial Loss Card */}
        <div className="p-5 rounded-[10px] bg-[#0a1e33] border-2 border-[#EF4444] shadow-[0_0_20px_rgba(239,68,68,0.2)] flex flex-col justify-between min-h-[150px]">
          <div>
            <p className="text-[#EF4444] text-xs font-bold mb-1 uppercase tracking-wider">Financial Loss</p>
            <h3 className="text-3xl font-black text-[#EF4444] tracking-tight">-Rp 124M</h3>
          </div>
          <p className="text-[#EF4444]/60 text-[11px] font-bold flex items-center gap-1">
            <TrendingDown size={14} />
            5.2% from last month
          </p>
        </div>

        {/* Profit Card */}
        <div className="p-5 rounded-[10px] bg-[#0a1e33] border-2 border-[#10B981] shadow-[0_0_20px_rgba(16,185,129,0.2)] flex flex-col justify-between min-h-[110px]">
          <div>
            <p className="text-[#10B981] text-xs font-bold mb-1 uppercase tracking-wider">Profit</p>
            <h3 className="text-3xl font-black text-[#10B981] tracking-tight">+Rp 718M</h3>
          </div>
          <p className="text-[#10B981]/60 text-[11px] font-bold flex items-center gap-1">
            <TrendingUp size={14} />
            12.8% from last month
          </p>
        </div>
      </div>

      {/* Monthly Revenue Section */}
      <div className="space-y-8">
        <h2 className="text-4xl font-bold text-white tracking-tight">Monthly Revenue</h2>
        
        {/* Revenue Summary Container */}
        <div className="p-10 rounded-[10px] bg-[#164E75] shadow-2xl border border-white/5 space-y-12">
          {/* Month Selector (Inside) */}
          <div className="flex justify-between items-center px-6 border-b border-white/10 pb-8">
            {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((month, i) => (
              <span key={i} className={`text-xl font-bold ${month === 'Jan' ? 'text-white' : 'text-white/40'}`}>
                {month}
              </span>
            ))}
          </div>

          {/* Revenue Summary Table */}
          <div className="grid grid-cols-3 gap-10 text-center">
            {/* Total Revenue */}
            <div className="space-y-4">
              <p className="text-white/60 text-xl font-bold uppercase tracking-wider">Total Revenue</p>
              <h4 className="text-3xl font-black text-[#B8DDF5]">Rp 842M</h4>
            </div>
            {/* Total Expenses */}
            <div className="space-y-4">
              <p className="text-white/60 text-xl font-bold uppercase tracking-wider">Total Expenses</p>
              <h4 className="text-3xl font-black text-[#EF4444]">Rp 124M</h4>
            </div>
            {/* Net Profit */}
            <div className="space-y-4">
              <p className="text-white/60 text-xl font-bold uppercase tracking-wider">Net Profit</p>
              <h4 className="text-3xl font-black text-[#10B981]">Rp 718M</h4>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
