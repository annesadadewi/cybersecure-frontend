import React, { useState } from 'react';
import { theme } from '../Theme';
import { Shield, AtSign, Lock, Mail } from 'lucide-react';
import { authService } from '../api/auth';

/**
 * AuthPage handles both Login and Signup modes based on the 'mode' prop.
 * Connected to Laravel Backend via authService.
 */
const AuthPage = ({ mode = 'login', setAuthPage, onLogin }) => {
  const isLogin = mode === 'login';
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError(''); // Clear error when user types
    if (success) setSuccess(''); // Clear success when user types
  };

  const handleAuth = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      if (isLogin) {
        // Logika Login
        const data = await authService.login({
          email: formData.email,
          password: formData.password
        });
        
        // Asumsi Laravel mengembalikan token
        if (data.token) {
          localStorage.setItem('token', data.token);
          onLogin(data.user); // Redirect ke Dashboard
        } else {
          // Jika tidak menggunakan token (session based), langsung redirect
          onLogin(data.user);
        }
      } else {
        // Logika Register
        const data = await authService.register(formData);
        if (data) {
          setSuccess('Pendaftaran Berhasil! Silakan Masuk.');
          setTimeout(() => setAuthPage('login'), 2000); // Redirect setelah 2 detik
        }
      }
    } catch (err) {
      console.error('Auth Error:', err);
      const msg = err.response?.data?.message || err.message || 'Terjadi kesalahan koneksi ke server.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full flex font-poppins overflow-hidden animate-fadeIn">
      
      {/* LEFT COLUMN - Brand & Logo (40% Width) */}
      <div className="w-[40%] h-full p-16 flex flex-col justify-between items-center text-center text-white relative overflow-hidden" style={{ backgroundColor: theme.sidebar }}>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/5 to-transparent pointer-events-none"></div>
        
        <div className="flex flex-col items-center z-10 mt-2">
          {/* Shield Logo Container */}
          <div className="w-64 h-64 rounded-full bg-[#B8DDF5] flex items-center justify-center mb-4 shadow-2xl relative">
             <div className="relative">
                <Shield size={140} strokeWidth={1.5} className="text-[#1F5E88] opacity-90" />
             </div>
          </div>
          <h2 className="text-5xl font-bold mb-2 tracking-tight">CyberSecure</h2>
          <p className="text-xl opacity-90 leading-relaxed max-w-[320px] font-medium">
            Solusi cerdas untuk memantau, mencegah, dan mendeteksi keamanan transaksi serta keuangan digital
          </p>
        </div>

        <div className="w-full flex flex-col items-center gap-4 z-10 mb-10">
          <div className="w-64 h-[2px] bg-white/20 mt-4 mb-2"></div>
          <p className="text-xl opacity-90 leading-relaxed max-w-[320px] font-medium text-center mb-6">
            {isLogin ? "Sudah Yakin Ingin Mulai Sekarang?" : "Ingin Kembali Untuk Mulai Bertransaksi Lagi?"}
          </p>
          <button 
            disabled={loading}
            onClick={() => setAuthPage(isLogin ? 'signup' : 'login')} 
            className="px-16 py-5 rounded-2xl font-bold text-xl transition-all hover:scale-105 active:scale-95 border-2 border-white/20 disabled:opacity-50"
            style={{ backgroundColor: '#4C92C3', color: 'white' }}
          >
            {isLogin ? "DAFTAR" : "MASUK"}
          </button>
        </div>
      </div>

      {/* RIGHT COLUMN - Auth Form Card (60% Width) */}
      <div className="w-[60%] h-full flex flex-col items-center justify-center p-8 relative" style={{ backgroundColor: theme.pageBg }}>
          <div className="w-full max-w-[500px] h-fit py-12 px-10 md:px-12 rounded-[50px] shadow-[0_20px_50px_rgba(0,0,0,0.4)] flex flex-col items-center justify-start border border-white/10" 
                style={{ backgroundColor: '#164E75' }}>
            
            <div className="w-20 h-20 rounded-2xl bg-white/10 flex items-center justify-center mb-6 border border-white/20 shadow-lg shrink-0">
              <Shield size={48} fill="white" className="text-white" />
            </div>
            <h3 className={`text-5xl font-bold text-white tracking-tight shrink-0 ${isLogin ? 'mb-10' : 'mb-6'}`}>CyberSecure</h3>
            
            {/* Error Message Alert */}
            {error && (
              <div className="w-full max-w-[340px] mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-xs font-medium animate-shake text-center">
                {error}
              </div>
            )}

            {/* Success Message Alert */}
            {success && (
              <div className="w-full max-w-[340px] mb-4 p-3 bg-green-500/20 border border-green-500/50 rounded-xl text-green-200 text-xs font-medium animate-fadeIn text-center shadow-[0_0_15px_rgba(34,197,94,0.2)]">
                {success}
              </div>
            )}

            <div className={`w-full max-w-[340px] ${isLogin ? 'space-y-8 mb-10' : 'space-y-4 mb-8'}`}>
              {isLogin ? (
                <>
                  <div className="flex items-center bg-[#D5EEFF] rounded-2xl px-5 py-3.5 gap-4 shadow-inner group focus-within:ring-2 ring-white/20 transition-all">
                    <AtSign className="text-[#1F5E88] opacity-80" size={26} />
                    <input 
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Masukkan Email / Pengguna" 
                      className="bg-transparent w-full outline-none text-[#1F5E88] font-bold text-base placeholder:text-[#1F5E88]/50 placeholder:font-semibold" 
                    />
                  </div>
                  <div className="flex items-center bg-[#D5EEFF] rounded-2xl px-5 py-3.5 gap-4 shadow-inner group focus-within:ring-2 ring-white/20 transition-all">
                    <Lock className="text-[#1F5E88] opacity-80" size={26} />
                    <input 
                      name="password"
                      type="password" 
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Masukkan Kata Sandi Anda" 
                      className="bg-transparent w-full outline-none text-[#1F5E88] font-bold text-base placeholder:text-[#1F5E88]/50 placeholder:font-semibold" 
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center bg-[#D5EEFF] rounded-2xl px-5 py-3.5 gap-4 shadow-inner group focus-within:ring-2 ring-white/20 transition-all">
                    <AtSign className="text-[#1F5E88] opacity-80" size={26} />
                    <input 
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Masukkan Nama Lengkap" 
                      className="bg-transparent w-full outline-none text-[#1F5E88] font-bold text-base placeholder:text-[#1F5E88]/50 placeholder:font-semibold" 
                    />
                  </div>
                  <div className="flex items-center bg-[#D5EEFF] rounded-2xl px-5 py-3.5 gap-4 shadow-inner group focus-within:ring-2 ring-white/20 transition-all">
                    <Mail className="text-[#1F5E88] opacity-80" size={26} />
                    <input 
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Masukkan Alamat Email" 
                      className="bg-transparent w-full outline-none text-[#1F5E88] font-bold text-base placeholder:text-[#1F5E88]/50 placeholder:font-semibold" 
                    />
                  </div>
                  <div className="flex items-center bg-[#D5EEFF] rounded-2xl px-5 py-3.5 gap-4 shadow-inner group focus-within:ring-2 ring-white/20 transition-all">
                    <Lock className="text-[#1F5E88] opacity-80" size={28} />
                    <input 
                      name="password"
                      type="password" 
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Buat Kata Sandi Anda" 
                      className="bg-transparent w-full outline-none text-[#1F5E88] font-bold text-base placeholder:text-[#1F5E88]/50 placeholder:font-semibold" 
                    />
                  </div>
                  <div className="flex items-center bg-[#D5EEFF] rounded-2xl px-5 py-3.5 gap-4 shadow-inner group focus-within:ring-2 ring-white/20 transition-all">
                    <Lock className="text-[#1F5E88] opacity-80" size={28} />
                    <input 
                      name="password_confirmation"
                      type="password" 
                      value={formData.password_confirmation}
                      onChange={handleChange}
                      placeholder="Konfirmasi Kata Sandi" 
                      className="bg-transparent w-full outline-none text-[#1F5E88] font-bold text-base placeholder:text-[#1F5E88]/50 placeholder:font-semibold" 
                    />
                  </div>
                </>
              )}
            </div>

            <button 
              disabled={loading}
              onClick={handleAuth} 
              className={`px-16 py-4 rounded-2xl font-bold text-xl text-white transition-all hover:scale-105 active:scale-95 border-2 border-white/20 disabled:opacity-50 flex items-center gap-3 ${isLogin ? 'mb-10' : 'mb-6'}`} 
              style={{ backgroundColor: '#4C92C3' }}
            >
              {loading && <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
              {isLogin ? "MASUK" : "DAFTAR"}
            </button>

            <div className="w-full max-w-[340px]">
              <div className={`flex items-center gap-4 ${isLogin ? 'mb-6' : 'mb-4'}`}>
                <div className="h-[1px] flex-1 bg-white/10"></div>
                <span className="text-white/60 text-xs font-bold tracking-widest uppercase">Atau Gunakan</span>
                <div className="h-[1px] flex-1 bg-white/10"></div>
              </div>
              
              <div className="flex justify-center gap-6 mb-2">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-xl cursor-pointer hover:scale-110 hover:-translate-y-1 transition-all active:scale-90">
                  <svg width="26" height="26" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                </div>
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-xl cursor-pointer hover:scale-110 hover:-translate-y-1 transition-all active:scale-90">
                  <Mail size={24} className="text-[#EA4335]" />
                </div>
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-xl cursor-pointer hover:scale-110 hover:-translate-y-1 transition-all active:scale-90">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="#25D366" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.937 3.659 1.432 5.631 1.433h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                  </svg>
                </div>
              </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default AuthPage;