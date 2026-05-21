import React, { useState } from 'react';
import { theme } from '../Theme';
import { Shield, AtSign, Lock, Mail, ChevronLeft, Phone, Eye, EyeOff } from 'lucide-react';
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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newFormData = { ...formData, [name]: value };
    setFormData(newFormData);
    
    if (success) setSuccess('');

    // --- LOGIKA VALIDASI REAL-TIME ---
    
    // 1. Validasi Nama (hanya untuk register)
    if (name === 'name') {
      if (value.length > 0 && value.length < 3) {
        setError('Nama minimal harus 3 karakter.');
        return;
      }
      if (value.length > 75) {
        setError('Nama maksimal 75 karakter.');
        return;
      }
    }

    // 2. Validasi Email
    if (name === 'email') {
      if (value.length > 0 && value.length < 8) {
        setError('Email minimal harus 8 karakter.');
        return;
      }
      if (value.length > 65) {
        setError('Email maksimal 65 karakter.');
        // Potong input jika melebihi 65
        setFormData({ ...newFormData, email: value.substring(0, 65) });
        return;
      }
      if (value.length > 0 && !value.endsWith('@gmail.com')) {
         setError('Email harus menggunakan domain @gmail.com');
         return;
      }
    }

    // 3. Validasi Password
    if (name === 'password') {
      if (value.length > 0 && value.length < 3) {
        setError('Kata sandi minimal harus 3 karakter.');
        return;
      }
      if (value.length > 20) {
        setError('Kata sandi maksimal 20 karakter.');
        return;
      }
    }

    // 4. Validasi Kesesuaian Password & Konfirmasi (Lebih Pintar)
    const { password, password_confirmation } = newFormData;
    
    if (password_confirmation.length > 0) {
      // Cek apakah yang diketik di konfirmasi mulai berbeda dengan password utama
      if (!password.startsWith(password_confirmation)) {
        setError('Konfirmasi kata sandi tidak cocok.');
        return;
      }
      // Cek jika panjangnya sudah sama tapi isinya beda
      if (password_confirmation.length === password.length && password !== password_confirmation) {
        setError('Konfirmasi kata sandi tidak cocok.');
        return;
      }
    }

    // Jika semua pengecekan di atas lolos, hapus pesan error
    setError('');
  };

  const flashError = (specificError) => {
    setError('Harap isi formulir dengan benar.');
    setTimeout(() => {
      setError(specificError);
    }, 2000); // Tampilkan pesan umum selama 2 detik, lalu kembali ke error spesifik
  };

  const handleAuth = async (e) => {
    if (e) e.preventDefault();
    
    // Cek jika form kosong saat tombol ditekan
    if (!isLogin && (!formData.name || !formData.email || !formData.password || !formData.password_confirmation)) {
      setError('Harap isi semua kolom pendaftaran.');
      return;
    }
    if (isLogin && (!formData.email || !formData.password)) {
      setError('Harap isi email dan kata sandi Anda.');
      return;
    }
    
    // Validasi Sederhana di Frontend
    if (!isLogin && formData.name.length < 3) {
      flashError('Nama minimal harus 3 karakter.');
      return;
    }
    if (!isLogin && formData.name.length > 75) {
      flashError('Nama maksimal 75 karakter.');
      return;
    }

    if (formData.email.length < 8) {
      flashError('Email minimal harus 8 karakter.');
      return;
    }
    if (formData.email.length > 65) {
      flashError('Email maksimal 65 karakter.');
      return;
    }

    if (!formData.email.endsWith('@gmail.com')) {
      flashError('Email harus menggunakan domain @gmail.com');
      return;
    }

    if (formData.password.length < 3) {
      flashError('Kata sandi minimal harus 3 karakter.');
      return;
    }
    if (formData.password.length > 20) {
      flashError('Kata sandi maksimal 20 karakter.');
      return;
    }

    if (!isLogin && formData.password !== formData.password_confirmation) {
      flashError('Konfirmasi kata sandi tidak cocok.');
      return;
    }

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

  const isFormEmpty = isLogin 
    ? (!formData.email || !formData.password)
    : (!formData.name || !formData.email || !formData.password || !formData.password_confirmation);

  const handleSwitchMode = () => {
    // Reset form dan pesan saat pindah halaman
    setError('');
    setSuccess('');
    setFormData({
      name: '',
      email: '',
      password: '',
      password_confirmation: ''
    });

    setAuthPage(isLogin ? 'signup' : 'login');
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
            {isLogin ? "Buat Akun Baru Untuk Mulai?" : "Ingin Kembali Bertransaksi Lagi?"}
          </p>
          <button 
            disabled={loading}
            onClick={handleSwitchMode} 
            className="px-16 py-5 rounded-2xl font-bold text-xl transition-all hover:scale-105 active:scale-95 border-2 border-white/20 disabled:opacity-50"
            style={{ backgroundColor: '#4C92C3', color: 'white' }}
          >
            {isLogin ? "DAFTAR" : "MASUK"}
          </button>
        </div>
      </div>

      {/* RIGHT COLUMN - Auth Form Card (60% Width) */}
      <div className="w-[60%] h-full flex flex-col items-center justify-center p-8 relative" style={{ backgroundColor: theme.pageBg }}>
         <div 
           className="w-full max-w-[500px] h-fit py-14 px-10 md:px-14 rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.4)] flex flex-col items-center justify-start border border-white/10 relative" 
           style={{ backgroundColor: '#164E75' }}
         >
            <div className="w-20 h-20 rounded-2xl bg-white/10 flex items-center justify-center mb-6 border border-white/20 shadow-lg shrink-0 overflow-hidden">
               <Shield size={48} fill="white" className="text-white" />
            </div>
            
            <h3 className={`text-4xl font-bold text-white tracking-tight shrink-0 mb-8 text-center`}>
              CyberSecure
            </h3>
            
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

            <div className="w-full flex justify-center">
              <form onSubmit={handleAuth} className="w-full flex flex-col items-center" noValidate>
                <div className={`w-full max-w-[340px] ${isLogin ? 'space-y-8 mb-10' : 'space-y-4 mb-8'}`}>
              {isLogin ? (
                <>
                  <div className="flex items-center bg-[#D5EEFF] rounded-2xl px-5 py-3.5 gap-4 shadow-inner group focus-within:ring-2 ring-white/20 transition-all">
                    <AtSign className="text-[#1F5E88] opacity-80" size={26} />
                    <input 
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Masukkan Email / Pengguna" 
                      required
                      className="auth-input bg-transparent w-full outline-none text-[#1F5E88] font-bold text-base placeholder:text-[#1F5E88]/50 placeholder:font-semibold" 
                    />
                  </div>
                  <div className="flex items-center bg-[#D5EEFF] rounded-2xl px-5 py-3.5 gap-4 shadow-inner group focus-within:ring-2 ring-white/20 transition-all">
                    <Lock className="text-[#1F5E88] opacity-80 shrink-0" size={26} />
                    <input 
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Masukkan Kata Sandi Anda" 
                      required
                      className="auth-input bg-transparent w-full outline-none text-[#1F5E88] font-bold text-base placeholder:text-[#1F5E88]/50 placeholder:font-semibold" 
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-[#1F5E88] opacity-80 hover:opacity-100 transition-opacity shrink-0">
                      {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                    </button>
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
                      required
                      className="auth-input bg-transparent w-full outline-none text-[#1F5E88] font-bold text-base placeholder:text-[#1F5E88]/50 placeholder:font-semibold" 
                    />
                  </div>
                  <div className="flex items-center bg-[#D5EEFF] rounded-2xl px-5 py-3.5 gap-4 shadow-inner group focus-within:ring-2 ring-white/20 transition-all">
                    <Mail className="text-[#1F5E88] opacity-80" size={26} />
                    <input 
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Masukkan Alamat Email" 
                      className="auth-input bg-transparent w-full outline-none text-[#1F5E88] font-bold text-base placeholder:text-[#1F5E88]/50 placeholder:font-semibold" 
                    />
                  </div>
                  <div className="flex items-center bg-[#D5EEFF] rounded-2xl px-5 py-3.5 gap-4 shadow-inner group focus-within:ring-2 ring-white/20 transition-all">
                    <Lock className="text-[#1F5E88] opacity-80 shrink-0" size={28} />
                    <input 
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Buat Kata Sandi Anda" 
                      required
                      className="auth-input bg-transparent w-full outline-none text-[#1F5E88] font-bold text-base placeholder:text-[#1F5E88]/50 placeholder:font-semibold" 
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-[#1F5E88] opacity-80 hover:opacity-100 transition-opacity shrink-0">
                      {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                    </button>
                  </div>
                  <div className="flex items-center bg-[#D5EEFF] rounded-2xl px-5 py-3.5 gap-4 shadow-inner group focus-within:ring-2 ring-white/20 transition-all">
                    <Lock className="text-[#1F5E88] opacity-80 shrink-0" size={28} />
                    <input 
                      name="password_confirmation"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={formData.password_confirmation}
                      onChange={handleChange}
                      placeholder="Konfirmasi Kata Sandi" 
                      required
                      className="auth-input bg-transparent w-full outline-none text-[#1F5E88] font-bold text-base placeholder:text-[#1F5E88]/50 placeholder:font-semibold" 
                    />
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="text-[#1F5E88] opacity-80 hover:opacity-100 transition-opacity shrink-0">
                      {showConfirmPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                    </button>
                  </div>
                </>
              )}
            </div>

            <button 
              type="submit"
              disabled={loading}
              className={`px-16 py-4 rounded-2xl font-bold text-xl text-white transition-all hover:scale-105 active:scale-95 border-2 border-white/20 disabled:opacity-50 flex justify-center gap-3 w-[340px] ${isLogin ? 'mb-10' : 'mb-6'}`} 
              style={{ backgroundColor: '#4C92C3' }}
            >
              {loading && <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
              {isLogin ? "MASUK" : "DAFTAR"}
            </button>
              </form>
            </div>
         </div>
      </div>
    </div>
  );
};

export default AuthPage;