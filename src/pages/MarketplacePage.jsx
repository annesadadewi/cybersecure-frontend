import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown } from 'lucide-react';
import { theme } from '../Theme';

const MarketplacePage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [modalForm, setModalForm] = useState({
    marketplace: '',
    email: '',
    password: ''
  });
  
  const marketplacesOptions = ['Lazada', 'Blibli', 'Bukalapak', 'Tokopedia', 'Shopee'];
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
          onClick={() => setIsModalOpen(true)}
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
            className="flex items-center justify-between p-4 px-6 rounded-2xl shadow-md border border-white/10 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:brightness-105 active:scale-[0.98] cursor-pointer"
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

      {/* Modal Add Account */}
      {isModalOpen && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative z-10 w-full max-w-[750px] p-12 rounded-[2rem] shadow-2xl animate-fadeIn" style={{ backgroundColor: '#5C94B8' }}>
            <h2 className="text-3xl font-bold text-white mb-8">Tambah Akun Marketplace</h2>
            
            <div className="space-y-6">
              <div className="relative">
                <label className="block text-white mb-3 font-medium text-xl">Marketplace</label>
                <div 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full bg-[#F4FBFF] text-[#1F5E88] px-6 py-4 rounded-xl font-semibold cursor-pointer text-lg flex justify-between items-center"
                >
                  <span>{modalForm.marketplace || 'Pilih Marketplace'}</span>
                  <ChevronDown size={24} className={`transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </div>

                {isDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)}></div>
                    <div className="absolute left-0 right-0 mt-3 bg-[#F4FBFF] rounded-xl overflow-hidden shadow-2xl z-50 py-2 border border-white/20">
                      {marketplacesOptions.map((opt) => (
                        <div 
                          key={opt}
                          onClick={() => {
                            setModalForm({...modalForm, marketplace: opt});
                            setIsDropdownOpen(false);
                          }}
                          className={`px-6 py-3.5 cursor-pointer text-[#1F5E88] font-semibold text-lg hover:bg-[#E3F2FD] transition-colors ${modalForm.marketplace === opt ? 'bg-[#D1E8FA]' : ''}`}
                        >
                          {opt}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>

              <div>
                <label className="block text-white mb-3 font-medium text-xl">Email</label>
                <input 
                  type="email"
                  value={modalForm.email}
                  onChange={(e) => setModalForm({...modalForm, email: e.target.value})}
                  placeholder="email@example.com"
                  className="market-input w-full bg-[#F4FBFF] text-[#1F5E88] px-6 py-4 rounded-xl outline-none font-semibold placeholder:text-[#1F5E88]/60 text-lg"
                />
              </div>

              <div>
                <label className="block text-white mb-3 font-medium text-xl">Password</label>
                <input 
                  type="password"
                  value={modalForm.password}
                  onChange={(e) => setModalForm({...modalForm, password: e.target.value})}
                  placeholder="********"
                  className="market-input w-full bg-[#F4FBFF] text-[#1F5E88] px-6 py-4 rounded-xl outline-none font-semibold placeholder:text-[#1F5E88]/60 text-lg"
                />
              </div>
            </div>

            <div className="flex justify-end gap-5 mt-10">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-8 py-3 bg-white text-[#1F5E88] font-bold rounded-xl hover:bg-gray-100 transition-colors shadow-sm text-lg"
              >
                Batal
              </button>
              <button 
                onClick={() => {
                  setIsModalOpen(false);
                  setModalForm({ marketplace: '', email: '', password: '' });
                }}
                className="px-8 py-3 bg-white text-[#1F5E88] font-bold rounded-xl hover:bg-gray-100 transition-colors shadow-md text-lg"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default MarketplacePage;
