import React, { useState } from 'react';
import { 
  Shield, LayoutDashboard, BookOpen, Store, 
  BarChart3, Bell, Settings, Search,
  ShieldAlert, Activity, CheckCircle, Plus, 
  Mail, BrainCircuit, BotMessageSquare, 
  ArrowRight, FileText, ChevronDown,
  Lock, Cpu, BarChart 
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// --- DATA DUMMY UNTUK GRAFIK ---
const dataGrafik = [
  { name: 'Senin', jumlah: 4 }, { name: 'Selasa', jumlah: 7 },
  { name: 'Rabu', jumlah: 5 }, { name: 'Kamis', jumlah: 12 },
  { name: 'Jumat', jumlah: 8 }, { name: 'Sabtu', jumlah: 15 }, { name: 'Minggu', jumlah: 10 },
];

function App() {
  // STATE UTAMA
  const [activeMenu, setActiveMenu] = useState('Dashboard');
  const [showModal, setShowModal] = useState(false);
  const [selectedMarket, setSelectedMarket] = useState('Shopee');
  const [isLogin, setIsLogin] = useState(false);
  const [authPage, setAuthPage] = useState('landing'); 

  // LOGO
  const handleGoogleLogin = () => {alert("Login Google");};
  const handleEmailLogin = () => {alert("Login Email");};
  const handleWhatsAppLogin = () => {alert("Login WhatsApp");};

  // KONFIGURASI WARNA (Nuansa Cyber Biru Tua)
  const theme = {
    sidebar: '#0F172A',      // Biru Navy Gelap
    pageBg: '#1E293B',       // Biru Tua Halaman
    cardBg: '#334155',       // Biru Kolom/Card
    accent: '#2A65E8',       // Biru Terang (Tombol Aktif)
    modalBg: '#5A8BB5',      // Biru Laut Modal
    inputBg: '#B8DDF5',      // Biru Muda Input
    textMain: '#F8FAFC',     
    textDim: '#94A3B8'       
  };

  // ==========================================
  //      KOMPONEN HALAMAN DINAMIS
  // ==========================================

  // LANDING PAGE
  const LandingPage = () => (
    <div className="flex h-screen w-full overflow-hidden page-transition">
      <aside style={{ backgroundColor: theme.modalBg }} className="w-[320px] flex flex-col p-10 justify-between border-r border-white/10 z-20">
        <div className="space-y-12">
          <div className="flex items-center gap-4 text-white">
            <Shield size={40} fill="white" />
            <span className="text-3xl font-bold">CyberSecure</span>
          </div>
          <nav className="space-y-4">
            <div className="flex items-center gap-4 bg-white/20 p-4 rounded-2xl text-white border border-white/30 shadow-lg cursor-pointer">
              <LayoutDashboard size={28} />
              <span className="text-xl font-medium">Dashboard</span>
            </div>
            <div className="flex items-center gap-4 p-4 text-white/70 hover:bg-white/10 rounded-2xl transition-all cursor-pointer">
              <BookOpen size={28} />
              <span className="text-xl font-medium">Pelajari Fitur</span>
            </div>
          </nav>
        </div>
        <div className="flex flex-col items-center gap-4 pb-10">
          <button onClick={() => setAuthPage('login')} className="w-44 bg-[#B8DDF5] text-[#1E3A4C] py-3 rounded-2xl font-bold text-xl shadow-lg hover:bg-white transition-all">Masuk</button>
          <span className="text-white font-medium">— atau —</span>
          <button onClick={() => setAuthPage('signup')} className="w-44 border-2 border-[#B8DDF5] text-white py-3 rounded-2xl font-bold text-xl hover:bg-white/10 transition-all">Daftar</button>
        </div>
      </aside>
      <main style={{ backgroundColor: '#09212E' }} className="flex-1 p-16 flex items-center justify-center overflow-y-auto">
        <div className="max-w-6xl w-full space-y-12">
          <div style={{ backgroundColor: '#538CB4' }} className="rounded-[40px] p-16 flex items-center justify-between shadow-2xl relative">
            <div className="max-w-xl space-y-6">
              <h1 className="text-6xl font-extrabold text-white leading-tight">CyberSecure Analytics Dashboard</h1>
              <p className="text-2xl text-white/90 font-light leading-relaxed">Solusi cerdas untuk memantau, mencegah, dan mendeteksi keamanan transaksi serta keuangan digital.</p>
            </div>
            <div className="bg-white/10 p-12 rounded-full border border-white/20"><Shield size={160} strokeWidth={1} className="text-white" /></div>
          </div>
          <div className="grid grid-cols-3 gap-8">
            {[
              { t: 'Keamanan Transaksi', i: Lock, d: 'Enkripsi end-to-end untuk setiap aliran dana.' },
              { t: 'Deteksi Sistem Dengan AI', i: Cpu, d: 'Upaya pencegahan terhadap transaksi mencurigakan.' },
              { t: 'Laporan Real-Time', i: BarChart, d: 'Monitoring melalui grafik analisis keuangan.' }
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-[40px] p-10 text-center space-y-4 shadow-xl">
                <div className="text-[#1E3A4C] flex justify-center"><item.i size={45} /></div>
                <h3 className="text-2xl font-bold text-[#1E3A4C]">{item.t}</h3>
                <p className="text-slate-500 text-lg">{item.d}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );

  // LOGIN
  const LoginPage = () => (
    <div className="min-h-screen flex items-center justify-center px-10" style={{ backgroundColor: theme.pageBg }} >
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 rounded-3xl overflow-hidden shadow-2xl">
        <div className="p-12 flex flex-col justify-center items-center text-center" style={{ backgroundColor: theme.cardBg }} >
          <div className="w-24 h-24 rounded-full bg-white/10 flex items-center justify-center mb-6">
            <Shield size={40} className="text-blue-400" /></div>
          <h2 className="text-3xl font-bold mb-3" style={{ color: theme.textMain }}>CyberSecure</h2>
          <div className="space-y-3 text-sm max-w-xs leading-relaxed" style={{ color: theme.textDim }}>
            <p>Solusi cerdas untuk memantau, mencegah, dan mendeteksi keamanan transaksi digital</p>
            <p>Sudah yakin ingin Mulai sekarang?</p>
          </div>
          <button onClick={() => setAuthPage('signup')} className="mt-8 px-8 py-3 rounded-2xl font-bold" style={{ backgroundColor: theme.accent, color: theme.textMain }}>DAFTAR</button>
        </div>
        <div className="flex items-center justify-center p-12" style={{ backgroundColor: theme.pageBg }} >
          <div className="w-full max-w-md p-10 rounded-3xl shadow-xl" style={{ backgroundColor: theme.cardBg }} >
            <h3 className="text-2xl font-bold mb-8 text-center" style={{ color: theme.textMain }}>CyberSecure</h3>
            <input 
              placeholder="Masukkan Nama Pengguna"
              className="w-full mb-4 p-4 rounded-xl outline-none"
              style={{ backgroundColor: theme.inputBg }}
            />
            <input 
              type="password"
              placeholder="Masukkan Kata Sandi Anda"
              className="w-full mb-6 p-4 rounded-xl outline-none"
              style={{ backgroundColor: theme.inputBg }}
            />
            <button onClick={() => {
              setIsLogin(true);
              setAuthPage('app');
            }}
              className="w-full py-3 rounded-xl font-bold" style={{ backgroundColor: theme.accent, color: theme.textMain }}>MASUK</button>
            <p className="text-center text-sm mt-6" style={{ color: theme.textDim }}>atau</p>
            <div className="flex justify-center gap-4 mt-4">
              <button onClick={handleGoogleLogin} className="w-12 h-12 bg-white rounded-xl flex items-center justify-center hover:scale-110 transition">
                <img src="/icons/google.png.jpeg" alt="google" className="w-6 h-6" />
              </button>
              <button onClick={handleEmailLogin} className="w-12 h-12 bg-white rounded-xl flex items-center justify-center hover:scale-110 transition">
                <img src="/icons/gmail.png.jpeg" alt="email" className="w-6 h-6" />
              </button>
              <button onClick={handleWhatsAppLogin} className="w-12 h-12 bg-white rounded-xl flex items-center justify-center hover:scale-110 transition">
                <img src="/icons/whatsapp.png.jpeg" alt="whatsapp" className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // SIGN UP
  const SignupPage = () => (
    <div className="min-h-screen flex items-center justify-center px-10" style={{ backgroundColor: theme.pageBg }}>
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 rounded-3xl overflow-hidden shadow-2xl">
        <div className="p-12 flex flex-col justify-center items-center text-center" style={{ backgroundColor: theme.cardBg }} >
          <div className="w-24 h-24 rounded-full bg-white/10 flex items-center justify-center mb-6">
            <Shield size={40} className="text-blue-400" />
          </div>
          <h2 className="text-3xl font-bold mb-3" style={{ color: theme.textMain }}>CyberSecure</h2>
          <div className="space-y-3 text-sm max-w-xs leading-relaxed" style={{ color: theme.textDim }}>
            <p>Solusi cerdas untuk memantau, mencegah, dan mendeteksi keamanan transaksi digital</p>
            <p>Ingin Kembali untuk Mulai bertransaksi lagi?</p>
          </div>
          <button onClick={() => setAuthPage('login')} className="mt-8 px-8 py-3 rounded-2xl font-bold" style={{ backgroundColor: theme.accent, color: theme.textMain }}>MASUK</button>
        </div>
        <div className="flex items-center justify-center p-12" style={{ backgroundColor: theme.pageBg }} >
          <div className="w-full max-w-md p-10 rounded-3xl shadow-xl" style={{ backgroundColor: theme.cardBg }}>
            <h3 className="text-2xl font-bold mb-8 text-center" style={{ color: theme.textMain }}>CyberSecure</h3>
            <input 
              placeholder="Masukkan Nama Lengkap"
              className="w-full mb-4 p-4 rounded-xl outline-none"
              style={{ backgroundColor: theme.inputBg }}
            />
            <input 
              type="password"
              placeholder="Buat Kata Sandi Anda"
              className="w-full mb-4 p-4 rounded-xl outline-none"
              style={{ backgroundColor: theme.inputBg }}
            />
            <input 
              type="password"
              placeholder="Konfirmasi Kata Sandi"
              className="w-full mb-6 p-4 rounded-xl outline-none"
              style={{ backgroundColor: theme.inputBg }}
            />
            <button onClick={() => {
              setIsLogin(true);
              setAuthPage('app');
            }}
            className="w-full py-3 rounded-xl font-bold" style={{ backgroundColor: theme.accent, color: theme.textMain }}>DAFTAR</button>
            <p className="text-center text-sm mt-6" style={{ color: theme.textDim }}>atau</p>
            <div className="flex justify-center gap-4 mt-4">
              <button onClick={handleGoogleLogin} className="w-12 h-12 bg-white rounded-xl flex items-center justify-center hover:scale-110 transition">
                <img src="/icons/google.png" alt="google" className="w-6 h-6" />
              </button>
              <button onClick={handleEmailLogin} className="w-12 h-12 bg-white rounded-xl flex items-center justify-center hover:scale-110 transition">
                <img src="/icons/email.png" alt="email" className="w-6 h-6" />
              </button>
              <button onClick={handleWhatsAppLogin} className="w-12 h-12 bg-white rounded-xl flex items-center justify-center hover:scale-110 transition">
                <img src="/icons/whatsapp.png" alt="whatsapp" className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // AUTH FLOW 
  if (!isLogin) {
    if (authPage === 'landing') return <LandingPage />;
    if (authPage === 'login') return <LoginPage />;
    if (authPage === 'signup') return <SignupPage />;
  }

  // 1. DASHBOARD
  const DashboardPage = () => (
    <div className="space-y-8 animate-fadeIn">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { icon: Activity, text: 'Total Integrasi', val: '12 Akun', color: 'blue' },
          { icon: ShieldAlert, text: 'Anomali Terdeteksi', val: '24 Kasus', color: 'red' },
          { icon: CheckCircle, text: 'System Integrity', val: '99.9%', color: 'green' },
        ].map((card, i) => (
          <div key={i} style={{ backgroundColor: theme.cardBg }} className="p-6 rounded-3xl border border-white/5 hover:scale-[1.02] transition-all flex flex-col justify-between h-44 shadow-2xl">
            <div className={`p-3 w-fit bg-${card.color}-500/20 text-${card.color}-400 rounded-xl`}><card.icon size={26} /></div>
            <div>
              <p style={{ color: theme.textDim }} className="text-sm font-medium">{card.text}</p>
              <h3 style={{ color: theme.textMain }} className="text-3xl font-extrabold mt-1">{card.val}</h3>
            </div>
          </div>
        ))}
      </div>
      <div style={{ backgroundColor: theme.cardBg }} className="p-8 rounded-3xl border border-white/5 shadow-xl">
        <h3 style={{ color: theme.textMain }} className="text-xl font-bold mb-6">Threat Analysis</h3>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dataGrafik}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 12}} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 12}} dx={-10} />
              <Tooltip contentStyle={{ backgroundColor: '#1E293B', borderRadius: '12px', border: 'none', color: '#fff' }} />
              <Line type="monotone" dataKey="jumlah" stroke={theme.accent} strokeWidth={4} dot={{ r: 6, fill: theme.accent, stroke: theme.cardBg, strokeWidth: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  // 2. PELAJARI FITUR
  const FeaturesPage = () => (
    <div className="space-y-8 animate-fadeIn text-white">
      <h2 className="text-3xl font-extrabold">Pusat Pembelajaran Fitur</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: 'Setup API', desc: 'Cara integrasi marketplace.', icon: BrainCircuit },
          { title: 'Log Analisis', desc: 'Membaca pola ancaman.', icon: Shield },
          { title: 'Bot Config', desc: 'Otomasi deteksi bot.', icon: BotMessageSquare },
        ].map((f, i) => (
          <div key={i} style={{ backgroundColor: theme.cardBg }} className="p-8 rounded-3xl border border-white/5 space-y-4 shadow-xl">
            <div className="w-14 h-14 bg-blue-500/20 text-blue-400 rounded-2xl flex items-center justify-center"><f.icon size={30} /></div>
            <h4 className="font-bold text-xl">{f.title}</h4>
            <p className="text-slate-400 text-sm">{f.desc}</p>
            <button className="text-blue-400 font-bold text-sm hover:underline">Baca Tutorial →</button>
          </div>
        ))}
      </div>
    </div>
  );

  // 3. MARKETPLACE + MODAL
  const MarketplacePage = () => (
    <div className="space-y-8 animate-fadeIn text-white">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-extrabold">Marketplace Terhubung</h2>
          <p className="text-slate-400 text-sm mt-1">Kelola semua toko online Anda.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-[#2A65E8] px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"
        >
          <Plus size={20} /> Tambah Marketplace
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {['Shopee', 'Tokopedia', 'Lazada'].map((shop, i) => (
          <div key={i} style={{ backgroundColor: theme.cardBg }} className="p-8 rounded-3xl flex justify-between items-center border border-white/5 hover:border-white/10 transition-all">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center font-black text-2xl text-blue-400">{shop[0]}</div>
              <div>
                <p className="font-bold text-xl">{shop} Store</p>
                <p className="text-green-400 text-xs font-bold uppercase tracking-widest mt-1">● Connected</p>
              </div>
            </div>
            <ArrowRight className="text-slate-500 cursor-pointer hover:text-white" />
          </div>
        ))}
      </div>

      {/* --- MODAL POP-UP --- */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowModal(false)}></div>
          <div style={{ backgroundColor: theme.modalBg }} className="relative w-full max-w-lg p-10 rounded-[24px] shadow-2xl animate-fadeIn space-y-7">
            <h3 className="text-3xl font-bold text-white mb-2">Tambah Akun Marketplace</h3>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-base font-semibold text-white/90">Marketplace</label>
                <div className="relative">
                  <select 
                    style={{ backgroundColor: theme.inputBg }}
                    className="w-full text-[#1A1D1F] p-4 pr-10 rounded-xl outline-none appearance-none text-base font-medium"
                    defaultValue=""
                  >
                    <option value="" disabled>Pilih Marketplace</option>
                    <option value="lazada">Lazada</option>
                    <option value="blibli">Blibli</option>
                    <option value="bukalapak">Bukalapak</option>
                    <option value="tokopedia">Tokopedia</option>
                    <option value="shopee">Shopee</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-[#1A1D1F]" size={20} />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-base font-semibold text-white/90">Email</label>
                <input 
                  type="email" 
                  placeholder="email@example.com" 
                  style={{ backgroundColor: theme.inputBg }}
                  className="w-full text-[#1A1D1F] p-4 rounded-xl outline-none text-base font-medium placeholder:text-slate-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-base font-semibold text-white/90">Password</label>
                <input 
                  type="password" 
                  placeholder="********" 
                  style={{ backgroundColor: theme.inputBg }}
                  className="w-full text-[#1A1D1F] p-4 rounded-xl outline-none text-base font-medium placeholder:text-slate-500"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button onClick={() => setShowModal(false)} className="bg-white/90 text-[#1A1D1F] px-8 py-3 rounded-2xl font-bold hover:bg-white transition-all">Batal</button>
                <button onClick={() => setShowModal(false)} className="bg-white/90 text-[#1A1D1F] px-8 py-3 rounded-2xl font-bold hover:bg-white transition-all">Simpan</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // 4. REPORTS
  const ReportsPage = () => (
    <div className="space-y-8 animate-fadeIn text-white">
      <h2 className="text-3xl font-extrabold">Laporan Keamanan</h2>
      <div style={{ backgroundColor: theme.cardBg }} className="rounded-3xl p-6 border border-white/5 shadow-xl">
        {[1, 2, 3].map((r) => (
          <div key={r} className="flex justify-between items-center p-5 border-b border-white/5 last:border-0 hover:bg-white/5 rounded-xl transition-all">
            <div className="flex items-center gap-4">
              <FileText className="text-blue-400" />
              <p className="font-medium text-sm">Security_Report_April_Week_{r}.pdf</p>
            </div>
            <button className="text-blue-400 font-bold text-xs uppercase tracking-widest">Download</button>
          </div>
        ))}
      </div>
    </div>
  );

  // 5. NOTIFICATION
  const NotificationPage = () => (
    <div className="space-y-8 animate-fadeIn text-white">
      <h2 className="text-3xl font-extrabold">Notifikasi Terbaru</h2>
      <div className="space-y-4">
        {[
          { title: 'Login Mencurigakan', time: '2 menit lalu', color: 'red' },
          { title: 'Update Sistem v1.2', time: '1 jam lalu', color: 'blue' },
          { title: 'Toko Baru Terhubung', time: '5 jam lalu', color: 'green' },
        ].map((n, i) => (
          <div key={i} style={{ backgroundColor: theme.cardBg }} className="p-6 rounded-3xl border border-white/5 flex gap-5 items-center shadow-lg">
            <div className={`w-3 h-3 bg-${n.color}-500 rounded-full shadow-[0_0_10px_rgba(0,0,0,0.5)]`}></div>
            <div className="flex-1">
              <p className="font-bold">{n.title}</p>
              <p className="text-slate-400 text-xs">{n.time}</p>
            </div>
            <Bell size={18} className="text-slate-500" />
          </div>
        ))}
      </div>
    </div>
  );

  // 6. SETTINGS
  const SettingsPage = () => (
    <div className="space-y-6 animate-fadeIn text-white">
      <h2 className="text-3xl font-extrabold mb-8">Settings</h2>
      
      <div className="max-w-4xl space-y-6">
        {/* 1. Profile User Section */}
        <div style={{ backgroundColor: theme.modalBg }} className="p-8 rounded-[20px] shadow-xl space-y-6">
          <div className="flex items-center gap-3 border-b border-white/10 pb-4">
            <Settings size={22} className="text-white/80" />
            <h3 className="text-2xl font-bold">Profile User</h3>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-lg font-medium">Nama</label>
              <input 
                type="text" 
                style={{ backgroundColor: theme.inputBg }}
                className="w-full p-4 rounded-xl outline-none text-[#1A1D1F] font-medium"
              />
            </div>
            <div className="space-y-2">
              <label className="text-lg font-medium">Email</label>
              <input 
                type="email" 
                style={{ backgroundColor: theme.inputBg }}
                className="w-full p-4 rounded-xl outline-none text-[#1A1D1F] font-medium"
              />
            </div>
          </div>
        </div>

        {/* 2. Keamanan Section */}
        <div style={{ backgroundColor: theme.modalBg }} className="p-8 rounded-[20px] shadow-xl space-y-6">
          <div className="flex items-center gap-3 border-b border-white/10 pb-4">
            <Shield size={22} className="text-white/80" />
            <h3 className="text-2xl font-bold">Keamanan</h3>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <p className="text-xl font-bold">Two-Factor Authentication</p>
              <p className="text-sm text-white/80">Tambahkan lapisan keamanan ekstra</p>
            </div>
            <button className="bg-[#B8DDF5] text-[#1A1D1F] px-6 py-2.5 rounded-xl font-bold hover:bg-white transition-all">
              Aktifkan
            </button>
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-white/10">
            <div className="space-y-1">
              <p className="text-xl font-bold">Login Alerts</p>
              <p className="text-sm text-white/80">Dapatkan notifikasi saat login dari device baru</p>
            </div>
            <div className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-14 h-7 bg-slate-400 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-[#2A65E8]"></div>
            </div>
          </div>
        </div>

        {/* 3. Notifications Section */}
        <div style={{ backgroundColor: theme.modalBg }} className="p-8 rounded-[20px] shadow-xl space-y-6">
          <div className="flex items-center gap-3 border-b border-white/10 pb-4">
            <Bell size={22} className="text-white/80" />
            <h3 className="text-2xl font-bold">Notifications</h3>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-xl font-bold">Email Notifications</p>
            <div className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-14 h-7 bg-slate-400 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-[#2A65E8]"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // ==========================================
  //            LAYOUT UTAMA
  // ==========================================

  return (
    <div style={{ backgroundColor: theme.pageBg }} className="flex h-screen font-sans overflow-hidden">
      
      {/* SIDEBAR */}
      <aside style={{ backgroundColor: theme.sidebar }} className="w-64 text-white flex flex-col h-full border-r border-white/5 z-20">
        <div className="p-8 flex items-center gap-3">
          <Shield className="text-blue-400" size={32} />
          <span className="text-xl font-black tracking-wider">CYBERSECURE</span>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {[
            { name: 'Dashboard', icon: LayoutDashboard },
            { name: 'Pelajari Fitur', icon: BookOpen },
            { name: 'Marketplace', icon: Store },
            { name: 'Reports', icon: BarChart3 },
            { name: 'Notification', icon: Bell },
            { name: 'Settings', icon: Settings },
          ].map((item) => (
            <div 
              key={item.name}
              onClick={() => setActiveMenu(item.name)}
              className={`flex items-center gap-4 p-3.5 rounded-2xl cursor-pointer transition-all ${
                activeMenu === item.name 
                  ? 'bg-[#2A65E8] text-white shadow-lg shadow-blue-600/20 font-bold' 
                  : 'text-slate-500 hover:bg-white/5 hover:text-slate-200'
              }`}
            >
              <item.icon size={22} />
              <span>{item.name}</span>
            </div>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-800 mt-auto">
          <div className="bg-slate-800 p-3 rounded-lg text-[10px] text-slate-400 text-center uppercase font-bold tracking-[2px]">Admin Panel v1.0</div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-24 px-10 flex justify-between items-center bg-[#1E293B]/50 backdrop-blur-md z-10 border-b border-white/5">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
            <input 
              type="text" 
              placeholder="Search data..." 
              style={{ backgroundColor: 'rgba(255,255,255,0.03)', color: '#fff' }} 
              className="w-full pl-12 pr-4 py-3.5 border border-white/5 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20" 
            />
          </div>
          <div className="flex items-center gap-8 text-white">
            <div className="relative cursor-pointer">
              <Bell size={24} className="text-slate-400 hover:text-white" />
              <span className="absolute -top-1 -right-1 bg-red-500 w-4 h-4 rounded-full border-2 border-[#1E293B] flex items-center justify-center text-[10px] font-bold">3</span>
            </div>
            <div className="flex items-center gap-4 border-l border-white/10 pl-8">
              <div className="w-12 h-12 bg-[#2A65E8] rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg border-2 border-white/10">AD</div>
              <div className="hidden lg:block">
                <p className="font-bold text-sm">Admin UTS</p>
                <p className="text-[10px] text-green-400 font-bold uppercase tracking-tighter">Online Status</p>
              </div>
            </div>
          </div>
        </header>

        {/* CONTAINER DINAMIS */}
        <div className="flex-1 overflow-y-auto px-10 pb-10 pt-8">
          <div className="max-w-7xl mx-auto">
            {activeMenu === 'Dashboard' && <DashboardPage />}
            {activeMenu === 'Pelajari Fitur' && <FeaturesPage />}
            {activeMenu === 'Marketplace' && <MarketplacePage />}
            {activeMenu === 'Reports' && <ReportsPage />}
            {activeMenu === 'Notification' && <NotificationPage />}
            {activeMenu === 'Settings' && <SettingsPage />}
          </div>
        </div>
      </main>

      {/* ANIMATION STYLES */}
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.4s ease-out; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.1); }
      `}</style>
    </div>
  );
}

export default App;