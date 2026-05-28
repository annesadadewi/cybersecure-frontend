import React, { useState } from 'react';
import { theme } from '../Theme';
import { Shield, AtSign, Lock, Mail, ChevronLeft, Phone, Eye, EyeOff } from 'lucide-react';
import { authService } from '../api/auth';
import { marketplaceService } from '../api/marketplace';

/**
 * AuthPage handles Login, Signup, and Forgot Password modes.
 * Connected to Laravel Backend via authService and marketplaceService.
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

  // Forgot Password Flow States
  const [forgotStep, setForgotStep] = useState('none'); // 'none', 'email', 'otp', 'reset'
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotOtp, setForgotOtp] = useState('');
  const [forgotPasswordState, setForgotPasswordState] = useState('');
  const [forgotPasswordConfirmation, setForgotPasswordConfirmation] = useState('');
  const [simulatedOtpAlert, setSimulatedOtpAlert] = useState('');

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

    // 4. Validasi Kesesuaian Password & Konfirmasi
    const { password, password_confirmation } = newFormData;
    
    if (password_confirmation.length > 0) {
      if (!password.startsWith(password_confirmation)) {
        setError('Konfirmasi kata sandi tidak cocok.');
        return;
      }
      if (password_confirmation.length === password.length && password !== password_confirmation) {
        setError('Konfirmasi kata sandi tidak cocok.');
        return;
      }
    }

    setError('');
  };

  const flashError = (specificError) => {
    setError('Harap isi formulir dengan benar.');
    setTimeout(() => {
      setError(specificError);
    }, 2000);
  };

  const handleAuth = async (e) => {
    if (e) e.preventDefault();
    
    if (!isLogin && (!formData.name || !formData.email || !formData.password || !formData.password_confirmation)) {
      setError('Harap isi semua kolom pendaftaran.');
      return;
    }
    if (isLogin && (!formData.email || !formData.password)) {
      setError('Harap isi email dan kata sandi Anda.');
      return;
    }
    
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
        const data = await authService.login({
          email: formData.email,
          password: formData.password
        });
        
        if (data.token) {
          localStorage.setItem('token', data.token);
          onLogin(data.user);
        } else {
          onLogin(data.user);
        }
      } else {
        const data = await authService.register(formData);
        if (data) {
          setSuccess('Pendaftaran Berhasil! Silakan Masuk.');
          setTimeout(() => setAuthPage('login'), 2000);
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

  // HANDLERS FOR FORGOT PASSWORD
  const handleForgotSendOtp = async (e) => {
    e.preventDefault();
    if (!forgotEmail) {
      setError('Harap masukkan email Anda.');
      return;
    }
    if (!forgotEmail.endsWith('@gmail.com')) {
      setError('Email harus menggunakan domain @gmail.com');
      return;
    }
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const res = await marketplaceService.forgotPassword(forgotEmail);
      setSuccess('Kode OTP reset password telah dikirim (Simulasi).');
      setSimulatedOtpAlert(res.otp);
      setForgotStep('otp');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Email tidak terdaftar.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotVerifyOtp = async (e) => {
    e.preventDefault();
    if (!forgotOtp || forgotOtp.length !== 4) {
      setError('Harap masukkan 4 digit kode OTP.');
      return;
    }
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await marketplaceService.verifyOtp(forgotEmail, forgotOtp);
      setSuccess('OTP terverifikasi. Silakan ubah kata sandi.');
      setError('');
      setForgotStep('reset');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Kode OTP salah atau kedaluwarsa.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotResetPassword = async (e) => {
    e.preventDefault();
    if (!forgotPasswordState || forgotPasswordState.length < 3) {
      setError('Kata sandi minimal harus 3 karakter.');
      return;
    }
    if (forgotPasswordState !== forgotPasswordConfirmation) {
      setError('Konfirmasi kata sandi tidak cocok.');
      return;
    }
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const res = await marketplaceService.resetPassword(
        forgotEmail,
        forgotOtp,
        forgotPasswordState,
        forgotPasswordConfirmation
      );
      setSuccess(res.message || 'Kata sandi berhasil diubah! Silakan masuk kembali.');
      setSimulatedOtpAlert('');
      setForgotEmail('');
      setForgotOtp('');
      setForgotPasswordState('');
      setForgotPasswordConfirmation('');
      setTimeout(() => {
        setForgotStep('none');
        setSuccess('');
      }, 2500);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Gagal mereset kata sandi.');
    } finally {
      setLoading(false);
    }
  };

  const handleSwitchMode = () => {
    setError('');
    setSuccess('');
    setForgotStep('none');
    setSimulatedOtpAlert('');
    setFormData({
      name: '',
      email: '',
      password: '',
      password_confirmation: ''
    });

    setAuthPage(isLogin ? 'signup' : 'login');
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row font-poppins overflow-y-auto lg:overflow-hidden bg-[#0D2C3D] animate-fadeIn">
      
      {/* LEFT COLUMN - Brand & Logo (40% Width on Large Screens) */}
      <div 
        className="w-full lg:w-[40%] py-12 px-6 sm:px-12 flex flex-col justify-center items-center text-center text-white relative overflow-hidden shrink-0 bg-gradient-to-b from-[#1F5E88] to-[#123A57] min-h-[100vh] lg:min-h-0"
        style={{ backgroundColor: theme.sidebar }}
      >
        {/* Efek gradien halus di pojok atas */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/5 to-transparent pointer-events-none"></div>
        
        {/* Wrapper Utama agar semua konten menyatu padat di tengah */}
        <div className="flex flex-col items-center z-10 w-full max-w-[360px]">
          
          {/* Container Lingkaran Logo - Ukuran Gede Maksimal */}
          <div className="w-52 h-52 sm:w-58 sm:h-58 lg:w-66 lg:h-66 rounded-full bg-[#B8DDF5] flex items-center justify-center mb-6 shadow-2xl relative border border-white/10 shrink-0">
             <div className="relative">
                {/* Icon Shield - size prop langsung, paling reliable di lucide-react */}
                <Shield
                  size={145}
                  strokeWidth={1.5}
                  className="text-[#1F5E88] opacity-90"
                />
             </div>
          </div>
          
          {/* Teks Judul Brand */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-6 tracking-tight drop-shadow-md">
            CyberSecure
          </h2>
          
          {/* Deskripsi / Tagline */}
          <p className="text-sm sm:text-base opacity-90 leading-relaxed max-w-[280px] sm:max-w-[320px] font-medium">
             Solusi cerdas untuk memantau, mencegah, dan mendeteksi keamanan transaksi serta keuangan digital
          </p>

          {/* Garis Pembatas Pembagi Atas & Bawah */}
          <div className="w-48 sm:w-64 h-[1px] bg-white/20 my-6 shrink-0"></div>
          
          {/* Teks Instruksi Tombol */}
          <p className="text-sm sm:text-base opacity-90 leading-relaxed max-w-[280px] sm:max-w-[320px] font-medium text-center mb-6">
            {isLogin ? "Buat Akun Baru Untuk Mulai?" : "Ingin Kembali Bertransaksi Lagi?"}
          </p>
          
          {/* Tombol Switch Mode (Daftar / Masuk) */}
          <button 
            disabled={loading}
            onClick={handleSwitchMode} 
            className="w-full max-w-[200px] py-3 rounded-xl font-bold text-sm sm:text-base transition-all hover:scale-105 active:scale-95 border border-white/20 disabled:opacity-50 shadow-lg cursor-pointer hover:bg-white/10 shrink-0 mt-6"
            style={{ backgroundColor: '#4C92C3', color: 'white' }}
          >
            {isLogin ? "DAFTAR" : "MASUK"}
          </button>
        </div>
      </div>

      {/* RIGHT COLUMN - Auth Form Card (60% Width on Large Screens) */}
      <div className="w-full lg:w-[60%] flex-1 flex flex-col items-center justify-center p-4 sm:p-8 lg:p-12 relative min-h-[500px] lg:min-h-0 bg-[#0D2C3D]">
          <div 
           className="w-full max-w-[500px] py-10 sm:py-12 px-8 sm:px-12 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col items-center justify-start border border-white/10 relative bg-gradient-to-b from-[#164E75]/95 to-[#0F3957]/95 backdrop-blur-md"
         >
            <div className="w-20 h-20 rounded-2xl bg-white/10 flex items-center justify-center mb-8 border border-white/20 shadow-lg shrink-0 overflow-hidden">
               <Shield size={44} fill="white" className="text-white" />
            </div>
            
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight shrink-0 mb-9 text-center">
              {forgotStep === 'none' ? 'CyberSecure' : 'Reset Password'}
            </h3>
            
            {/* Error Message Alert */}
            {error && (
              <div className="w-full mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-xs font-semibold animate-shake text-center">
                {error}
              </div>
            )}

            {/* Success Message Alert */}
            {success && (
              <div className="w-full mb-4 p-3 bg-green-500/20 border border-green-500/50 rounded-xl text-green-200 text-xs font-semibold animate-fadeIn text-center shadow-[0_0_15px_rgba(34,197,94,0.2)]">
                {success}
              </div>
            )}

            {/* FORGOT PASSWORD SIMULATION ALERT */}
            {forgotStep === 'otp' && simulatedOtpAlert && (
              <div className="w-full mb-4 p-4 bg-emerald-500/20 border border-emerald-500/50 rounded-2xl text-emerald-100 text-sm font-semibold animate-fadeIn shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs uppercase tracking-wider text-emerald-400 font-extrabold">📲 SIMULASI OTP</span>
                  <button type="button" onClick={() => setSimulatedOtpAlert('')} className="text-emerald-400 hover:text-white font-bold">✕</button>
                </div>
                <p className="text-[11px] font-normal text-emerald-200">
                  Masukkan kode OTP berikut:
                </p>
                <div className="mt-2 text-center text-2xl tracking-[0.5em] font-black text-white bg-black/40 py-2 rounded-xl border border-emerald-400/30">
                  {simulatedOtpAlert}
                </div>
              </div>
            )}

            {forgotStep === 'none' ? (
              <div className="w-full flex justify-center">
                <form onSubmit={handleAuth} className="w-full flex flex-col items-center" noValidate>
                  <div className={`w-full max-w-[380px] ${isLogin ? 'space-y-8 mb-6' : 'space-y-8 mb-10'}`}>
                    {isLogin ? (
                      <>
                        <div className="flex items-center bg-[#D5EEFF] rounded-xl px-4 py-3.5 gap-3 shadow-inner group focus-within:ring-2 ring-white/20 transition-all">
                          <AtSign className="text-[#1F5E88] opacity-80 shrink-0" size={20} />
                          <input 
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Masukkan email Anda" 
                            required
                            className="auth-input bg-transparent w-full outline-none text-[#1F5E88] font-semibold text-sm placeholder:text-[#1F5E88]/50 placeholder:font-medium" 
                          />
                        </div>
                        <div className="flex items-center bg-[#D5EEFF] rounded-xl px-4 py-3.5 gap-3 shadow-inner group focus-within:ring-2 ring-white/20 transition-all">
                          <Lock className="text-[#1F5E88] opacity-80 shrink-0" size={20} />
                          <input 
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Kata Sandi" 
                            required
                            className="auth-input bg-transparent w-full outline-none text-[#1F5E88] font-semibold text-sm placeholder:text-[#1F5E88]/50 placeholder:font-medium" 
                          />
                          <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-[#1F5E88] opacity-80 hover:opacity-100 transition-opacity shrink-0 cursor-pointer">
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center bg-[#D5EEFF] rounded-xl px-4 py-3.5 gap-3 shadow-inner group focus-within:ring-2 ring-white/20 transition-all">
                          <AtSign className="text-[#1F5E88] opacity-80 shrink-0" size={20} />
                          <input 
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Nama Lengkap" 
                            required
                            className="auth-input bg-transparent w-full outline-none text-[#1F5E88] font-semibold text-sm placeholder:text-[#1F5E88]/50 placeholder:font-medium" 
                          />
                        </div>
                        <div className="flex items-center bg-[#D5EEFF] rounded-xl px-4 py-3.5 gap-3 shadow-inner group focus-within:ring-2 ring-white/20 transition-all">
                          <Mail className="text-[#1F5E88] opacity-80 shrink-0" size={20} />
                          <input 
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Alamat Email" 
                            className="auth-input bg-transparent w-full outline-none text-[#1F5E88] font-semibold text-sm placeholder:text-[#1F5E88]/50 placeholder:font-medium" 
                          />
                        </div>
                        <div className="flex items-center bg-[#D5EEFF] rounded-xl px-4 py-3.5 gap-3 shadow-inner group focus-within:ring-2 ring-white/20 transition-all">
                          <Lock className="text-[#1F5E88] opacity-80 shrink-0" size={20} />
                          <input 
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Kata Sandi" 
                            required
                            className="auth-input bg-transparent w-full outline-none text-[#1F5E88] font-semibold text-sm placeholder:text-[#1F5E88]/50 placeholder:font-medium" 
                          />
                          <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-[#1F5E88] opacity-80 hover:opacity-100 transition-opacity shrink-0 cursor-pointer">
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                        <div className="flex items-center bg-[#D5EEFF] rounded-xl px-4 py-3.5 gap-3 shadow-inner group focus-within:ring-2 ring-white/20 transition-all">
                          <Lock className="text-[#1F5E88] opacity-80 shrink-0" size={20} />
                          <input 
                            name="password_confirmation"
                            type={showConfirmPassword ? 'text' : 'password'}
                            value={formData.password_confirmation}
                            onChange={handleChange}
                            placeholder="Konfirmasi Kata Sandi" 
                            required
                            className="auth-input bg-transparent w-full outline-none text-[#1F5E88] font-semibold text-sm placeholder:text-[#1F5E88]/50 placeholder:font-medium" 
                          />
                          <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="text-[#1F5E88] opacity-80 hover:opacity-100 transition-opacity shrink-0 cursor-pointer">
                            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                      </>
                    )}
                  </div>

                  {isLogin && (
                    <div className="flex justify-end w-full max-w-[380px] mt-4 mb-10">
                      <button 
                        type="button" 
                        onClick={() => {
                          setForgotStep('email');
                          setError('');
                          setSuccess('');
                        }}
                        className="text-white/70 hover:text-white text-xs sm:text-sm font-semibold transition-colors hover:underline cursor-pointer"
                      >
                        Lupa Password?
                      </button>
                    </div>
                  )}

                  <button 
                    type="submit"
                    disabled={loading}
                    className="w-full max-w-[190px] py-3 sm:py-3.5 rounded-xl font-semibold text-base sm:text-lg text-white transition-all hover:scale-105 active:scale-95 border border-white/10 disabled:opacity-50 flex justify-center items-center gap-2.5 shadow-lg cursor-pointer" 
                    style={{ backgroundColor: '#4C92C3' }}
                  >
                    {loading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
                    <span>{isLogin ? "MASUK" : "DAFTAR"}</span>
                  </button>
                </form>
              </div>
            ) : (
              <div className="w-full flex flex-col items-center">
                {forgotStep === 'email' && (
                  <form onSubmit={handleForgotSendOtp} className="w-full flex flex-col items-center animate-fadeIn" noValidate>
                    <p className="text-white/80 text-xs sm:text-sm mb-5 text-center leading-relaxed max-w-[380px]">
                      Masukkan alamat email CyberSecure Anda untuk mendapatkan kode OTP reset password.
                    </p>
                    <div className="w-full max-w-[380px] space-y-4 mb-6">
                      <div className="flex items-center bg-[#D5EEFF] rounded-xl px-4 py-3.5 gap-3 shadow-inner">
                        <Mail className="text-[#1F5E88] opacity-80 shrink-0" size={20} />
                        <input 
                          type="email"
                          value={forgotEmail}
                          onChange={(e) => setForgotEmail(e.target.value)}
                          placeholder="Email Anda (@gmail.com)" 
                          required
                          className="auth-input bg-transparent w-full outline-none text-[#1F5E88] font-semibold text-sm placeholder:text-[#1F5E88]/50 placeholder:font-medium" 
                        />
                      </div>
                    </div>
                    <button 
                      type="submit"
                      disabled={loading}
                      className="w-full max-w-[190px] py-3.5 rounded-xl font-semibold text-base text-white transition-all hover:scale-105 active:scale-95 border border-white/10 disabled:opacity-50 flex justify-center items-center gap-2.5 shadow-lg mb-4 cursor-pointer" 
                      style={{ backgroundColor: '#4C92C3' }}
                    >
                      {loading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
                      KIRIM OTP
                    </button>
                    <button 
                      type="button" 
                      onClick={() => {
                        setForgotStep('none');
                        setError('');
                        setSuccess('');
                      }} 
                      className="text-white/60 hover:text-white font-semibold text-xs sm:text-sm transition-colors hover:underline cursor-pointer"
                    >
                      Kembali ke Login
                    </button>
                  </form>
                )}

                {forgotStep === 'otp' && (
                  <form onSubmit={handleForgotVerifyOtp} className="w-full flex flex-col items-center animate-fadeIn" noValidate>
                    <p className="text-white/80 text-xs sm:text-sm mb-5 text-center leading-relaxed max-w-[380px]">
                      Masukkan 4 digit kode OTP yang tertera di pop-up hijau di atas.
                    </p>
                    <div className="w-full max-w-[380px] space-y-4 mb-6">
                      <div className="flex items-center bg-[#D5EEFF] rounded-xl px-4 py-3.5 gap-3 shadow-inner">
                        <Shield className="text-[#1F5E88] opacity-80 shrink-0" size={20} />
                        <input 
                          type="text"
                          maxLength={4}
                          value={forgotOtp}
                          onChange={(e) => setForgotOtp(e.target.value.replace(/\D/g, ''))}
                          placeholder="OTP" 
                          required
                          className="auth-input bg-transparent w-full outline-none text-[#1F5E88] font-black text-center text-lg tracking-[0.25em] placeholder:text-[#1F5E88]/50 placeholder:font-medium placeholder:tracking-normal" 
                        />
                      </div>
                    </div>
                    <button 
                      type="submit"
                      disabled={loading}
                      className="w-full max-w-[190px] py-3.5 rounded-xl font-semibold text-base text-white transition-all hover:scale-105 active:scale-95 border border-white/10 disabled:opacity-50 flex justify-center items-center gap-2.5 shadow-lg mb-4 cursor-pointer" 
                      style={{ backgroundColor: '#4C92C3' }}
                    >
                      {loading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
                      VERIFIKASI OTP
                    </button>
                    <button 
                      type="button" 
                      onClick={() => {
                        setForgotStep('email');
                        setError('');
                        setSuccess('');
                      }} 
                      className="text-white/60 hover:text-white font-semibold text-xs sm:text-sm transition-colors hover:underline cursor-pointer"
                    >
                      Kembali ke Input Email
                    </button>
                  </form>
                )}

                {forgotStep === 'reset' && (
                  <form onSubmit={handleForgotResetPassword} className="w-full flex flex-col items-center animate-fadeIn" noValidate>
                    <p className="text-white/80 text-xs sm:text-sm mb-5 text-center leading-relaxed max-w-[380px]">
                      Buat kata sandi baru untuk mengamankan akun CyberSecure Anda.
                    </p>
                    <div className="w-full max-w-[380px] space-y-3 mb-6">
                      <div className="flex items-center bg-[#D5EEFF] rounded-xl px-4 py-3.5 gap-3 shadow-inner">
                        <Lock className="text-[#1F5E88] opacity-80 shrink-0" size={20} />
                        <input 
                          type={showPassword ? 'text' : 'password'}
                          value={forgotPasswordState}
                          onChange={(e) => setForgotPasswordState(e.target.value)}
                          placeholder="Kata Sandi Baru" 
                          required
                          className="auth-input bg-transparent w-full outline-none text-[#1F5E88] font-semibold text-sm placeholder:text-[#1F5E88]/50 placeholder:font-medium" 
                        />
                      </div>
                      <div className="flex items-center bg-[#D5EEFF] rounded-xl px-4 py-3.5 gap-3 shadow-inner">
                        <Lock className="text-[#1F5E88] opacity-80 shrink-0" size={20} />
                        <input 
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={forgotPasswordConfirmation}
                          onChange={(e) => setForgotPasswordConfirmation(e.target.value)}
                          placeholder="Konfirmasi Kata Sandi" 
                          required
                          className="auth-input bg-transparent w-full outline-none text-[#1F5E88] font-semibold text-sm placeholder:text-[#1F5E88]/50 placeholder:font-medium" 
                        />
                      </div>
                    </div>
                    <button 
                      type="submit"
                      disabled={loading}
                      className="w-full max-w-[190px] py-3.5 rounded-xl font-semibold text-base text-white transition-all hover:scale-105 active:scale-95 border border-white/10 disabled:opacity-50 flex justify-center items-center gap-2.5 shadow-lg mb-4 cursor-pointer" 
                      style={{ backgroundColor: '#4C92C3' }}
                    >
                      {loading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
                      SIMPAN PASSWORD
                    </button>
                    <button 
                      type="button" 
                      onClick={() => {
                        setForgotStep('none');
                        setError('');
                        setSuccess('');
                      }} 
                      className="text-white/60 hover:text-white font-semibold text-xs sm:text-sm transition-colors hover:underline cursor-pointer"
                    >
                      Batal
                    </button>
                  </form>
                )}
              </div>
            )}
         </div>
      </div>
    </div>
  );
};

export default AuthPage;