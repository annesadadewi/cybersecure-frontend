import React, { useState } from 'react';
import { Shield, LayoutDashboard, BookOpen, Lock, Cpu, BarChart, Menu, X } from 'lucide-react';
import { theme } from '../Theme';
import FeaturesPage from './FeaturesPage';

const LandingPage = ({ setAuthPage, onLearnFeatures, isViewingFeatures }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen w-full font-poppins relative overflow-hidden" style={{ backgroundColor: theme.pageBg }}>
      
      {/* Sidebar Backdrop Overlay for Mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden transition-all duration-300"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* SIDEBAR - DESAIN MODERN GLOW */}
      <aside 
        style={{ backgroundColor: theme.sidebar }} 
        className={`fixed lg:sticky top-0 left-0 h-screen z-40 flex flex-col p-5 border-r border-white/5 shrink-0 transition-transform duration-300 w-[260px] shadow-2xl bg-gradient-to-b from-[#1F5E88] via-[#10344E]/90 to-[#071926] backdrop-blur-md ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 overflow-hidden relative`}
      >
        {/* 💡 Ambient glow effect: Menggunakan warna hijau/toska gelap semula dengan opacity halus */}
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-[#0c618f]/15 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="flex flex-col h-full justify-between z-10 relative">
          <div className="space-y-8">
            {/* Logo Section & Close Button for Mobile */}
            <div className="flex items-center justify-between px-2 py-1">
              <div className="flex items-center gap-3 text-white">
                <Shield size={28} fill="white" className="shrink-0 drop-shadow-[0_4px_12px_rgba(255,255,255,0.3)]" />
                <span className="text-xl font-black tracking-tight bg-clip-text bg-gradient-to-r from-white via-blue-100 to-blue-300">CyberSecure</span>
              </div>
              <button 
                onClick={() => setIsSidebarOpen(false)}
                className="lg:hidden text-white/60 hover:text-white p-1 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Navigation Section */}
            <nav className="space-y-2">
              {/* Tombol Dashboard */}
              <div 
                onClick={() => {
                  setAuthPage('landing');
                  setIsSidebarOpen(false);
                }} 
                /* 👉 Menggunakan kustom rounded-[20px] tanpa spasi */
                className={`flex items-center gap-3.5 p-3.5 rounded-[10px] transition-all duration-300 cursor-pointer group border border-transparent ${
                  !isViewingFeatures 
                    ? 'bg-white/10 text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] backdrop-blur-md border-white/5' 
                    : 'text-white/50 hover:bg-white/5 hover:text-white'
                }`}
              >
                <LayoutDashboard 
                  size={20} 
                  stroke={!isViewingFeatures ? "#69C3FF" : "currentColor"} 
                  strokeWidth={!isViewingFeatures ? 2.5 : 2}
                  className={`shrink-0 transition-transform group-hover:scale-105 ${!isViewingFeatures ? 'drop-shadow-[0_0_5px_rgba(105,195,255,0.5)]' : ''}`} 
                />
                <span className={`text-[15px] tracking-wide transition-colors ${!isViewingFeatures ? 'font-bold' : 'font-medium'}`}>
                  Dashboard
                </span>
              </div>

              {/* Tombol Pelajari Fitur */}
              <div 
                onClick={() => {
                  onLearnFeatures();
                  setIsSidebarOpen(false);
                }}
                className={`flex items-center gap-3.5 p-3.5 rounded-[10px] transition-all duration-300 cursor-pointer group border border-transparent ${
                  isViewingFeatures 
                    ? 'bg-white/10 text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] backdrop-blur-md border-white/5' 
                    : 'text-white/50 hover:bg-white/5 hover:text-white'
                }`}
              >
                <BookOpen 
                  size={20} 
                  stroke={isViewingFeatures ? "#69C3FF" : "currentColor"} 
                  strokeWidth={isViewingFeatures ? 2 : 2}
                  className={`shrink-0 transition-transform group-hover:scale-105 ${isViewingFeatures ? 'drop-shadow-[0_0_5px_rgba(105,195,255,0.5)]' : ''}`} 
                />
                <span className={`text-[15px] tracking-wide transition-colors ${isViewingFeatures ? 'font-bold' : 'font-medium'}`}>
                  Pelajari Fitur
                </span>
              </div>
            </nav>
          </div>

          {/* Auth CTA / Footer Section */}
          <div className="flex flex-col gap-3 pb-2 border-t border-white/5 pt-5">
            {/* TOMBOL MASUK */}
            <button 
              onClick={() => setAuthPage('login')} 
              /* 👉 PERUBAHAN EFEK:
                - 'hover:bg-[#CBE6F8]': Menggantikan hover putih solid ke biru pastel yang lebih soft.
                - 'hover:shadow-[0_0_20px_rgba(184,221,245,0.4)]': Efek pendaran cahayanya dibuat lebih smooth dan menyebar merata, tidak kaku ke bawah aja.
              */
              className="w-full py-2.5 rounded-xl font-bold text-sm transition-all duration-300 bg-[#B8DDF5] hover:bg-[#CBE6F8] text-[#123A57] shadow-[0_4px_12px_rgba(184,221,245,0.15)] hover:shadow-[0_0_20px_rgba(184,221,245,0.4)] transform active:scale-95"
            >
              Masuk
            </button>

            {/* Pembatas OR/ATAU */}
            <div className="flex items-center gap-2 px-1 py-1">
              <div className="h-[1px] flex-1 bg-white/5"></div>
              <span className="text-white/30 text-[9px] font-bold uppercase tracking-widest text-center">atau</span>
              <div className="h-[1px] flex-1 bg-white/5"></div>
            </div>

            {/* TOMBOL DAFTAR */}
            <button 
              onClick={() => setAuthPage('signup')} 
              /* 👉 PERUBAHAN EFEK:
                - Ditambahkan 'hover:border-[#69C3FF]/50' dan 'hover:text-[#69C3FF]' agar pas di-hover teks dan bordernya menyala biru, bukan cuma sekadar ngasih background abu-abu tipis.
              */
              className="w-full border border-white/10 py-2.5 rounded-xl font-bold text-sm text-white bg-white/0 hover:bg-white/5 hover:border-[#69C3FF]/50 hover:text-[#69C3FF] transition-all duration-300 transform active:scale-95"
            >
              Daftar
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col items-center overflow-y-auto bg-gradient-to-b from-[#0D2C3D] to-[#061622] min-h-screen">
        
        {/* Mobile Header Bar */}
        <div className="w-full h-16 px-4 sm:px-6 flex items-center justify-between border-b border-white/5 bg-[#0D2C3D]/40 backdrop-blur-md sticky top-0 z-20 lg:hidden">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="text-white/80 hover:text-white p-1.5 hover:bg-white/5 rounded-lg transition-all"
            >
              <Menu size={24} />
            </button>
            <div className="flex items-center gap-2 text-white">
              <Shield size={22} fill="white" className="text-white" />
              <span className="font-extrabold tracking-tight text-base">CyberSecure</span>
            </div>
          </div>
          <button 
            onClick={() => setAuthPage('login')}
            className="bg-[#B8DDF5] hover:bg-white text-[#1F5E88] font-bold text-xs px-4 py-2 rounded-lg shadow transition-all active:scale-95"
          >
            Masuk
          </button>
        </div>

          {/* Content Container */}
          <div className="w-full max-w-[1000px] px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8 md:space-y-12">
            {isViewingFeatures ? (
              <div className="w-full animate-fadeIn">
                <div className="mb-8 border-b border-white/5 pb-4">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">Pusat Pembelajaran Fitur</h1>
                  <p className="text-white/60 text-xs sm:text-sm mt-1">Pelajari cara mengonfigurasi dan mengoperasikan sistem pemantauan Anda.</p>
                </div>
                <FeaturesPage />
              </div>
            ) : (
              <>
                {/* 1. HERO BANNER */}
  <div className="w-full animate-fadeIn">
      <div
          /* 👉 ATUR TINGGI BANNER DI SINI:
            - 'min-h-[280px]': Tinggi minimum pada layar HP/mobile (sebelumnya 250px)
            - 'md:min-h-[310px]': Tinggi minimum pada layar tablet ke atas (sebelumnya 270px)
            - Kamu bisa bebas mengganti angka di dalam kurung siku, misalnya md:min-h-[350px] jika ingin lebih tinggi lagi.
          */
          className="rounded-3xl p-6 sm:p-8 lg:p-10 flex flex-col md:flex-row gap-6 items-center justify-between shadow-2xl relative overflow-hidden group min-h-[300px] md:min-h-[300px] border border-white/10 bg-gradient-to-br from-[#1F5E88] via-[#2A65E8]/80 to-[#123A57]"
      >
          {/* Ambient light glow effect in background */}
          <div className="absolute -top-20 -left-20 w-60 h-60 bg-[#B8DDF5]/10 rounded-full blur-3xl pointer-events-none group-hover:scale-125 transition-transform duration-700"></div>
          
          <div className="flex-1 space-y-4 text-center md:text-left z-10 flex flex-col justify-center">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white leading-tight">
                  CyberSecure <br/>
                  Analytics Dashboard
              </h1>
              <p className="text-sm sm:text-base lg:text-lg text-white/80 font-medium leading-relaxed max-w-[550px] mx-auto md:mx-0">
                  Solusi cerdas untuk memantau, mencegah, dan mendeteksi keamanan transaksi serta keuangan digital bisnis Anda secara terpusat.
              </p>
          </div>

          <div className="relative z-10 shrink-0 hidden md:block">
              <div className="w-[210px] h-[210px] lg:w-[210px] lg:h-[210px] bg-white/10 rounded-full flex items-center justify-center backdrop-blur-md border border-white/20 relative shadow-2xl">
                  <div className="relative animate-pulse">
                      <Shield size={140} strokeWidth={1.2} className="text-white drop-shadow-[0_4px_16px_rgba(255,255,255,0.3)]" />
                  </div>
              </div>
          </div>
      </div>
  </div>

              {/* 2. CARDS SECTION */}
              <div className="w-full animate-fadeIn max-w-[900px] mx-auto">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                      {[
                          { 
                            t: 'Keamanan Transaksi', 
                            d: 'Enkripsi end-to-end untuk setiap aliran dana yang terintegrasi dengan marketplace Anda.',
                            icon: <Lock size={32} className="text-[#0c618f] mb-3" />
                          },
                          { 
                            t: 'Deteksi Sistem Dengan AI', 
                            d: 'Upaya pencegahan terhadap transaksi mencurigakan disertai dengan pengingat.',
                            icon: <Cpu size={32} className="text-[#0c618f] mb-3" />
                          },
                          { 
                            t: 'Laporan Real-Time', 
                            d: 'Memudahkan monitoring melalui grafik analisis keuangan yang akan diupdate setiap waktu.',
                            icon: <BarChart size={32} className="text-[#0c618f] mb-3" />
                          }
                      ].map((item, i) => (
                          <div
                              key={i}
                              style={{ backgroundColor: theme.cardgridBg }}
                              className="rounded-[28px] p-5 md:p-6 text-center flex flex-col items-center justify-center border border-[#0D2C3D]/10 shadow-[6px_6px_0px_#051622] transition-all duration-300 w-full h-[223px] md:h-[223px] group cursor-pointer"
                          >
                              {item.icon}
                              <h3 
                                  style={{ color: theme.textCard }}
                                  className="text-[14px] sm:text-base font-extrabold leading-snug mb-1.5"
                              >
                                  {item.t}
                              </h3>
                              <p 
                                  style={{ color: theme.cardSubtext }}
                                  className="text-[12px] sm:text-[12px] leading-relaxed font-regular px-1 opacity-90"
                              >
                                  {item.d}
                              </p>
                          </div>
                      ))}
                  </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default LandingPage;