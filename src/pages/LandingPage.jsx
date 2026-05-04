import React from 'react';
import { Shield, LayoutDashboard, BookOpen, Lock, Cpu, BarChart } from 'lucide-react';
import { theme } from '../Theme';
import FeaturesPage from './FeaturesPage';

const LandingPage = ({ setAuthPage, onLearnFeatures, isViewingFeatures }) => (
  // Tambahkan min-h-screen dan pastikan flex-row eksplisit
  <div className="flex flex-row min-h-screen w-full font-poppins" style={{ backgroundColor: theme.pageBg }}>
    
    {/* SIDEBAR */}
    <aside style={{ backgroundColor: theme.sidebar }} className="w-[280px] h-screen sticky top-0 flex flex-col p-6 justify-between border-r border-white/10 z-20 shrink-0 font-poppins">
      <div className="space-y-10">
        <div className="flex items-center gap-4 text-white px-2">
          <Shield size={36} fill="white" className="shrink-0" />
          <span className="text-2xl font-extrabold tracking-tight">CyberSecure</span>
        </div>
        <nav className="space-y-3">
          <div 
            onClick={() => setAuthPage('landing')} 
            className={`flex items-center gap-4 p-4 rounded-2xl transition-all duration-200 cursor-pointer group ${!isViewingFeatures ? 'bg-white/20 text-white shadow-lg border border-white/10' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}
          >
            <LayoutDashboard size={24} stroke="#69C3FF" strokeWidth={2.5} className="shrink-0" />
            <span className={`text-lg ${!isViewingFeatures ? 'font-bold' : 'font-medium'}`}>Dashboard</span>
          </div>
          <div 
            onClick={onLearnFeatures}
            className={`flex items-center gap-4 p-4 rounded-2xl transition-all duration-200 cursor-pointer group ${isViewingFeatures ? 'bg-white/20 text-white shadow-lg border border-white/10' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}
          >
            <BookOpen size={24} stroke="#69C3FF" strokeWidth={2} className="shrink-0" />
            <span className={`text-lg ${isViewingFeatures ? 'font-bold' : 'font-medium'}`}>Pelajari Fitur</span>
          </div>
        </nav>
      </div>

      <div className="flex flex-col gap-3 pb-4">
        <button onClick={() => setAuthPage('login')} className="w-full py-3 rounded-xl font-bold text-lg shadow-lg transition-transform active:scale-95" style={{ backgroundColor: theme.accentLight, color: theme.textMain }}>Masuk</button>
        <div className="flex items-center gap-2">
           <div className="h-[1px] flex-1 bg-white/10"></div>
           <span className="text-white/50 text-[11px] font-bold uppercase tracking-widest">atau</span>
           <div className="h-[1px] flex-1 bg-white/10"></div>
        </div>
        <button onClick={() => setAuthPage('signup')} className="w-full border-2 py-3 rounded-xl font-bold text-lg hover:bg-white/10 transition-all" style={{ borderColor: theme.accentLight, color: 'white' }}>Daftar</button>
      </div>
    </aside>

    {/* MAIN CONTENT */}
    <main className="flex-1 flex flex-col items-center p-10 overflow-y-auto bg-[#0a1e33]">
      {isViewingFeatures ? (
        <div className="w-full">
           <div className="mb-10">
             <h1 className="text-4xl font-black text-white tracking-tight">Pusat Pembelajaran Fitur</h1>
           </div>
           <FeaturesPage />
        </div>
      ) : (
        <>
          {/* 1. SEKSI BANNER */}
          <div className="w-full max-w-[900px] mb-12">
              <div
                  style={{ backgroundColor: theme.bannerBg }}
                  className="rounded-[40px] px-12 py-10 flex items-center justify-between shadow-lg relative overflow-hidden group min-h-[315px]"
              >
                  <div className="max-w-xl space-y-5 z-10">
                      <h1 className="text-[38px] font-bold text-white leading-[50px]">
                          CyberSecure <br/>
                          Analytics Dashboard
                      </h1>
                      <p className="text-xl text-white/80 font-medium leading-relaxed max-w-[450px]">
                          Solusi cerdas untuk memantau, mencegah, dan mendeteksi keamanan transaksi serta keuangan digital.
                      </p>
                  </div>
                  <div className="relative z-10 pr-6">
                      <div className="w-[240px] h-[240px] bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20 relative group">
                          <div className="relative">
                              <Shield size={160} strokeWidth={1.2} className="text-white opacity-90" />
                          </div>
                      </div>
                  </div>
              </div>
          </div>

          {/* 2. SEKSI CARDS */}
          <div className="w-full max-w-[850px]">
              <div className="grid grid-cols-3 gap-8">
                  {[
                      { t: 'Keamanan Transaksi', i: Lock, d: 'Enkripsi end-to-end untuk setiap aliran dana yang terintegrasi dengan marketplace Anda.' },
                      { t: 'Deteksi Sistem Dengan AI', i: Cpu, d: 'Upaya pencegahan terhadap transaksi mencurigakan disertai dengan pengingat.' },
                      { t: 'Laporan Real-Time', i: BarChart, d: 'Memudahan monitoring melalui grafik analisis keuangan yang akan diupdate setiap waktu.' }
                  ].map((item, i) => (
                      <div
                          key={i}
                          style={{ backgroundColor: theme.cardgridBg }}
                          className="rounded-[35px] px-5 py-6 text-center flex flex-col items-center justify-center shadow-lg border-2 border-transparent hover:border-[#2A65E8] hover:shadow-[0_0_20px_rgba(42,101,232,0.3)] hover:-translate-y-1 transition-all duration-300 min-h-[220px] group"
                      >
                          <h3 className="text-[16px] font-bold leading-tight mb-4" style={{ color: theme.cardSubtext }}>
                              {item.t}
                          </h3>
                          <div className="mb-5">
                              <item.i size={35} stroke="#69C3FF" strokeWidth={1.2} />
                          </div>
                          <p className="text-[#334155] text-[11.5px] leading-relaxed font-medium px-2">
                              {item.d}
                          </p>
                      </div>
                  ))}
              </div>
          </div>
        </>
      )}
    </main>
  </div>
);

export default LandingPage;