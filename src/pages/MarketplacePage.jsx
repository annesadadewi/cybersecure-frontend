import React from 'react';
import { theme } from '../Theme';

const MarketplacePage = () => {
  const marketplaces = [
    { name: 'Tokopedia', initial: 'T', status: 'Connected' },
    { name: 'Shopee', initial: 'S', status: 'Connected' },
    { name: 'Bukalapak', initial: 'B', status: 'Not Connected' },
    { name: 'Lazada', initial: 'L', status: 'Not Connected' },
    { name: 'Blibli', initial: 'B', status: 'Connected' },
  ];

  return (
    <div className="space-y-10 animate-fadeIn">
      {/* Subheader & Button Section */}
      <div className="flex justify-between items-center">
        <p className="text-2xl text-white/70 font-normal tracking-wide">Manage Connected Account</p>
        <button 
          className="bg-[#B8DDF5] text-[#1F5E88] px-8 py-4 rounded-2xl font-bold text-xl shadow-lg hover:scale-105 transition-transform active:scale-95"
        >
          + Add Account
        </button>
      </div>

      {/* Progress Bar Section */}
      <div className="flex items-center gap-6">
        <div className="flex-1 h-3 bg-white/20 rounded-full overflow-hidden">
          <div className="h-full bg-[#1F5E88] w-[60%] rounded-full shadow-[0_0_10px_rgba(31,94,136,0.5)]"></div>
        </div>
        <span className="text-2xl font-bold text-white tracking-wide">3/5 Account</span>
      </div>

      {/* List Section */}
      <div className="space-y-5">
        {marketplaces.map((item, i) => (
          <div 
            key={i} 
            className="flex items-center justify-between p-4 px-6 rounded-2xl shadow-md border border-white/10 transition-all hover:translate-x-2"
            style={{ backgroundColor: '#B8DDF5' }}
          >
            <div className="flex items-center gap-6">
              <div className="w-12 h-12 bg-[#538CB4] rounded-lg flex items-center justify-center text-white text-2xl font-bold shadow-inner">
                {item.initial}
              </div>
              <span className="text-2xl font-bold text-[#0D2C3D]">{item.name}</span>
            </div>

            <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full border ${
              item.status === 'Connected' 
                ? 'bg-[#E2FBE9] text-[#10B981] border-[#10B981]/20' 
                : 'bg-white/50 text-slate-500 border-slate-300'
            }`}>
              <div className={`w-2.5 h-2.5 rounded-full ${
                item.status === 'Connected' ? 'bg-[#10B981]' : 'border-2 border-slate-400'
              }`}></div>
              <span className="text-sm font-black uppercase tracking-widest">{item.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MarketplacePage;
