import React, { useEffect, useRef, useState, useCallback } from 'react';
import { User, Shield, Camera, Pencil, X, Check, Eye, EyeOff, Loader2 } from 'lucide-react';
import { profileService } from '../api/profile';
import Cropper from 'react-easy-crop';
import getCroppedImg from '../utils/cropImage';

const inputClass =
  'w-full bg-[#DEF2FF] px-4 py-3.5 rounded-xl text-[#1F5E88] text-base font-bold outline-none border border-white/10 placeholder:text-[#1F5E88]/50 disabled:opacity-70 disabled:bg-white/5 disabled:text-white/50';
const labelClass = 'text-white text-sm font-semibold block mb-2';

const SettingsPage = ({ user, onUserUpdate }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const [editingPassword, setEditingPassword] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);
  
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  
  const [msgTimeout, setMsgTimeout] = useState(null);
  const [errTimeout, setErrTimeout] = useState(null);

  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoRemoved, setPhotoRemoved] = useState(false);
  const [showPhotoOptions, setShowPhotoOptions] = useState(false);
  
  const fileInputRef = useRef(null);

  // Image Crop State
  const [showCropModal, setShowCropModal] = useState(false);
  const [imageToCrop, setImageToCrop] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  
  const [passwordForm, setPasswordForm] = useState({
    current_password: '',
    password: '',
    password_confirmation: '',
  });

  const showSuccess = (msg) => {
    setMessage(msg);
    setError('');
    if (msgTimeout) clearTimeout(msgTimeout);
    setMsgTimeout(setTimeout(() => setMessage(''), 4000));
  };

  const showError = (err) => {
    setError(err);
    setMessage('');
    if (errTimeout) clearTimeout(errTimeout);
    setErrTimeout(setTimeout(() => setError(''), 4000));
  };

  // Handle clicking outside photo options
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (showPhotoOptions && !e.target.closest('.photo-options-container')) {
        setShowPhotoOptions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showPhotoOptions]);

  const loadProfile = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await profileService.get();
      const p = data.profile || data;
      setProfile(p);
      setForm({
        name: p.name || '',
        email: p.email || '',
        phone: p.phone || '',
      });
    } catch (err) {
      console.error(err);
      setProfile({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        profile_photo_url: user?.profile_photo_url || null,
      });
      setForm({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
      });
      showError('Gagal memuat profil. Pastikan backend sudah di-migrate.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const initials = (profile?.name || user?.name || 'U')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  const avatarUrl = photoRemoved ? null : (photoPreview || profile?.profile_photo_url || user?.profile_photo_url);
  const displayName = profile?.name || user?.name || '';

  const startEditing = () => {
    setEditing(true);
    setMessage('');
    setError('');
    setForm({
      name: profile?.name || '',
      email: profile?.email || '',
      phone: profile?.phone || '',
    });
    setPhotoFile(null);
    setPhotoPreview(null);
    setPhotoRemoved(false);
    setShowPhotoOptions(false);
  };

  const cancelEditing = () => {
    setEditing(false);
    setPhotoFile(null);
    setPhotoPreview(null);
    setPhotoRemoved(false);
    setShowPhotoOptions(false);
    setForm({
      name: profile?.name || '',
      email: profile?.email || '',
      phone: profile?.phone || '',
    });
    setMessage('');
    setError('');
  };

  const startEditingPassword = () => {
    setEditingPassword(true);
    setMessage('');
    setError('');
    setPasswordForm({
      current_password: '',
      password: '',
      password_confirmation: '',
    });
  };

  const cancelEditingPassword = () => {
    setEditingPassword(false);
    setPasswordForm({
      current_password: '',
      password: '',
      password_confirmation: '',
    });
    setMessage('');
    setError('');
  };

  const handlePhotoPick = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      setImageToCrop(reader.result);
      setShowCropModal(true);
    });
    reader.readAsDataURL(file);
    
    e.target.value = '';
    setShowPhotoOptions(false);
  };

  const handleRemovePhoto = () => {
    setPhotoRemoved(true);
    setPhotoFile(null);
    setPhotoPreview(null);
    setShowPhotoOptions(false);
  };

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleSaveCrop = async () => {
    try {
      const croppedImage = await getCroppedImg(imageToCrop, croppedAreaPixels);
      if (croppedImage) {
        setPhotoFile(croppedImage.file);
        setPhotoPreview(croppedImage.url);
        setPhotoRemoved(false);
      }
      setShowCropModal(false);
      setImageToCrop(null);
    } catch (e) {
      console.error(e);
      alert('Gagal memotong gambar');
    }
  };

  const isPhoneValid = form.phone.length === 0 || (form.phone.length >= 10 && form.phone.length <= 15);
  const isNameValid = form.name.length >= 3 && form.name.length <= 65;
  const isEmailValid = form.email.length >= 8 && form.email.length <= 65 && form.email.endsWith('@gmail.com');

  const canSaveProfile = editing && isPhoneValid && isNameValid && isEmailValid;

  const handlePhoneChange = (e) => {
    const val = e.target.value.replace(/\D/g, '');
    if (val.length <= 15) {
      setForm((f) => ({ ...f, phone: val }));
    }
  };

  const handleSaveProfile = async () => {
    if (!canSaveProfile) return;
    
    // Check if anything changed
    const hasChanged = 
      form.name.trim() !== (profile?.name || '') ||
      form.email.trim() !== (profile?.email || '') ||
      form.phone.trim() !== (profile?.phone || '') ||
      photoFile !== null ||
      photoRemoved === true;

    if (!hasChanged) {
      showError('Tidak ada perubahan yang disimpan.');
      return; // stay in edit mode
    }

    setSaving(true);
    setMessage('');
    setError('');
    try {
      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || null,
      };
      
      let data = await profileService.update(payload);

      if (photoRemoved && profile?.profile_photo_url) {
         data = await profileService.deletePhoto();
      } else if (photoFile) {
         data = await profileService.updatePhoto(photoFile);
      }

      const updated = data.profile;
      setProfile(updated);
      onUserUpdate?.(updated);
      setEditing(false);
      setPhotoFile(null);
      setPhotoPreview(null);
      setPhotoRemoved(false);
      showSuccess(data.message || 'Profil berhasil diperbarui');
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        Object.values(err.response?.data?.errors || {}).flat().join(' ') ||
        'Gagal menyimpan profil';
      showError(msg);
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordForm.password === '') {
      showError('Sandi baru tidak boleh kosong.');
      return;
    }
    
    setPasswordSaving(true);
    setMessage('');
    setError('');
    try {
      const data = await profileService.updatePassword(passwordForm);
      showSuccess(data.message || 'Kata sandi berhasil diubah');
      setPasswordForm({ current_password: '', password: '', password_confirmation: '' });
      setEditingPassword(false);
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        Object.values(err.response?.data?.errors || {}).flat().join(' ') ||
        'Gagal mengubah kata sandi';
      showError(msg);
    } finally {
      setPasswordSaving(false);
    }
  };

  // Password Requirements Logic
  const p = passwordForm.password;
  const reqLength = p.length >= 8 && p.length <= 20;
  const reqCase = /[a-z]/.test(p) && /[A-Z]/.test(p);
  const reqNumSpec = /[0-9]/.test(p) || /[^A-Za-z0-9]/.test(p);

  const ReqItem = ({ met, text }) => (
    <div className={`flex items-center gap-2 text-xs sm:text-sm transition-colors duration-300 ${!editingPassword ? 'text-white/40' : met ? 'text-green-400 font-bold' : 'text-white/70'}`}>
      {editingPassword && (
        <span className={`flex-shrink-0 w-4 h-4 flex items-center justify-center rounded-full border transition-colors duration-300 ${met ? 'border-green-400 bg-green-400/20 text-green-400' : 'border-white/20'}`}>
          {met && <Check size={10} strokeWidth={4} />}
        </span>
      )}
      <span>{text}</span>
    </div>
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[40vh] text-white/70">
        <Loader2 size={36} className="animate-spin mb-3 text-[#B8DDF5]" />
        <p>Memuat pengaturan...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full px-4 sm:px-6 lg:px-8 pb-10">
      
      {/* Toast Notification Container */}
      <div className={`transition-all duration-500 ease-in-out overflow-hidden ${message || error ? 'max-h-24 opacity-100 scale-100' : 'max-h-0 opacity-0 scale-95'}`}>
        <div
          className={`px-5 py-4 rounded-xl text-base font-semibold border text-center shadow-lg ${
            error
              ? 'bg-red-500/15 border-red-400/30 text-red-200'
              : 'bg-emerald-500/15 border-emerald-400/30 text-emerald-200'
          }`}
        >
          {error || message}
        </div>
      </div>

      {showCropModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-[#164E75] w-full max-w-xl rounded-3xl overflow-hidden shadow-2xl border border-white/10 flex flex-col">
            <div className="p-5 border-b border-white/10 flex justify-between items-center">
              <h3 className="text-white font-bold text-lg">Sesuaikan Foto Profil</h3>
              <button onClick={() => setShowCropModal(false)} className="text-white/60 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>
            <div className="relative h-[60vh] min-h-[300px] w-full bg-black">
              <Cropper
                image={imageToCrop}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
              />
            </div>
            <div className="p-5 border-t border-white/10 bg-[#0F3652] flex flex-col sm:flex-row gap-4 items-center justify-between">
              <input
                type="range"
                value={zoom}
                min={1}
                max={3}
                step={0.1}
                aria-labelledby="Zoom"
                onChange={(e) => setZoom(e.target.value)}
                className="w-full sm:w-1/2 accent-[#B8DDF5]"
              />
              <div className="flex gap-3 w-full sm:w-auto">
                <button
                  onClick={() => setShowCropModal(false)}
                  className="flex-1 sm:flex-none px-6 py-3 rounded-xl bg-white/10 text-white font-bold hover:bg-white/20 transition-all cursor-pointer"
                >
                  Batal
                </button>
                <button
                  onClick={handleSaveCrop}
                  className="flex-1 sm:flex-none px-6 py-3 rounded-xl bg-[#B8DDF5] text-[#1F5E88] font-bold hover:bg-white transition-all cursor-pointer shadow-md"
                >
                  Terapkan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        {/* Profile Card */}
        <div className="p-6 sm:p-8 rounded-2xl sm:rounded-[2rem] bg-gradient-to-b from-[#164E75] to-[#0F3652] shadow-xl border border-white/5 space-y-8 text-left flex flex-col h-full animate-fadeIn">
          
          {/* Header & Avatar Area */}
          <div className="flex flex-col items-center gap-6 border-b border-white/10 pb-6 w-full">
            
            {/* Title Section */}
            <div className="flex flex-col items-center gap-4 text-white text-center">
              <User size={52} className="text-[#B8DDF5] drop-shadow-md" />
              <h1 className="text-xl sm:text-2xl font-bold">Profil Akun CyberSecure</h1>
            </div>

            {/* Avatar Section */}
            <div className="flex flex-col items-center justify-center w-full mt-2">
              <div className="relative shrink-0 group photo-options-container">
                <div 
                  className={`w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 border-[#B8DDF5]/40 overflow-hidden bg-white/10 flex items-center justify-center transition-all duration-300 shadow-xl ${editing ? 'cursor-pointer hover:border-white/60 hover:scale-105' : ''}`}
                  onClick={() => editing && setShowPhotoOptions(!showPhotoOptions)}
                >
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="Foto profil" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-4xl sm:text-5xl font-black text-[#B8DDF5]">{initials}</span>
                  )}
                </div>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={handlePhotoPick}
                />

                {editing && showPhotoOptions && (
                  <div className="absolute top-full mt-3 left-1/2 -translate-x-1/2 w-56 bg-[#0F3652] rounded-xl shadow-2xl border border-white/20 overflow-hidden z-20 animate-fadeIn">
                     <button type="button" onClick={() => { fileInputRef.current?.click(); setShowPhotoOptions(false); }} className="w-full text-left px-4 py-3 text-sm text-white hover:bg-white/10 transition-colors font-medium">Pilih foto dari perangkat</button>
                     <button type="button" onClick={handleRemovePhoto} className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-red-500/20 transition-colors border-t border-white/10 font-medium">Hapus foto profil</button>
                  </div>
                )}
              </div>
              
              <div className="flex flex-col items-center justify-center pt-4">
                {editing ? (
                  <p className="text-sm text-[#B8DDF5] font-medium text-center">
                    Ketuk foto profil di atas untuk mengubahnya
                  </p>
                ) : (
                  <div className="space-y-1 text-center">
                    <h2 className="text-lg sm:text-xl font-bold text-white">Halo, {displayName}!</h2>
                    <p className="text-sm text-white/60">
                      Data di bawah diambil dari akun yang Anda daftarkan.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-6 w-full pt-2 flex-grow">
            <div className="space-y-2">
              <label className={labelClass}>Nama Lengkap</label>
              <input
                type="text"
                value={editing ? form.name : profile?.name || ''}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                disabled={!editing}
                className={inputClass}
              />
              {editing && form.name.length > 0 && !isNameValid && (
                <p className="text-sm text-red-300 mt-2 bg-red-500/10 py-1.5 px-3 rounded-lg border border-red-500/20 inline-block">
                  Nama lengkap harus antara 3 - 65 karakter.
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <label className={labelClass}>Email (@gmail.com)</label>
              <input
                type="email"
                value={editing ? form.email : profile?.email || ''}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                disabled={!editing}
                className={inputClass}
              />
              {editing && form.email.length > 0 && !isEmailValid && (
                <p className="text-sm text-red-300 mt-2 bg-red-500/10 py-1.5 px-3 rounded-lg border border-red-500/20 inline-block">
                  Email harus 8 - 65 karakter dan menggunakan @gmail.com.
                </p>
              )}
              {editing && (
                <p className="text-sm text-white/50 mt-2">
                  Email hanya dapat diubah di sini saat Anda sudah masuk ke CyberSecure.
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <label className={labelClass}>Nomor Telepon</label>
              <input
                type="tel"
                placeholder={editing ? '08xxxxxxxxxx' : 'Belum diisi'}
                value={editing ? form.phone : profile?.phone || ''}
                onChange={handlePhoneChange}
                disabled={!editing}
                className={inputClass}
              />
              {editing && form.phone.length > 0 && !isPhoneValid && (
                <p className="text-sm text-red-300 mt-2 bg-red-500/10 py-1.5 px-3 rounded-lg border border-red-500/20 inline-block">
                  Nomor telepon harus antara 10 - 15 digit angka.
                </p>
              )}
            </div>
          </div>
          
          <div className="flex justify-end pt-6 border-t border-white/10 mt-auto">
            {!editing ? (
              <button
                type="button"
                onClick={startEditing}
                className="flex items-center gap-2 bg-[#B8DDF5] hover:bg-white text-[#1F5E88] px-6 py-3 rounded-xl font-bold text-base shadow-lg hover:shadow-xl transition-all cursor-pointer hover:-translate-y-0.5"
              >
                <Pencil size={18} />
                Edit Profil
              </button>
            ) : (
              <div className="flex gap-4 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={cancelEditing}
                  disabled={saving}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-base font-bold cursor-pointer transition-all disabled:opacity-50"
                >
                  <X size={18} />
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleSaveProfile}
                  disabled={saving || !canSaveProfile}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#B8DDF5] hover:bg-white text-[#1F5E88] text-base font-bold cursor-pointer transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:bg-[#B8DDF5]"
                >
                  {saving ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />}
                  Simpan Perubahan
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Password Card */}
        <div className="p-6 sm:p-8 rounded-2xl sm:rounded-[2rem] bg-gradient-to-b from-[#164E75] to-[#0F3652] shadow-xl border border-white/5 space-y-8 text-left flex flex-col h-full animate-fadeIn">
          
          {/* Header Area */}
          <div className="flex flex-col items-center gap-5 border-b border-white/10 pb-6 w-full">
            
            {/* Title Section */}
            <div className="flex flex-col items-center gap-4 text-white text-center">
              <Shield size={52} className="text-[#B8DDF5] drop-shadow-md" />
              <h2 className="text-xl sm:text-2xl font-bold">Kata Sandi Akun CyberSecure</h2>
            </div>
            
            <p className="text-sm text-white/60 text-center px-4 pt-1">
              lupa kata sandi? ganti kata sandi Anda di sini.
            </p>
          </div>

          <form onSubmit={handlePasswordChange} className="space-y-5 w-full pt-2 flex-grow flex flex-col">
            <div className="space-y-2">
              <label className={labelClass}>Kata Sandi Saat Ini</label>
              <div className="relative w-full">
                <input
                  type={showCurrentPw ? 'text' : 'password'}
                  required={editingPassword}
                  disabled={!editingPassword}
                  value={passwordForm.current_password}
                  onChange={(e) =>
                    setPasswordForm((f) => ({ ...f, current_password: e.target.value }))
                  }
                  className={`${inputClass} pr-12`}
                />
                <button
                  type="button"
                  disabled={!editingPassword}
                  onClick={() => setShowCurrentPw(!showCurrentPw)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#1F5E88]/60 hover:text-[#1F5E88] cursor-pointer transition-colors disabled:opacity-50"
                >
                  {showCurrentPw ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className={labelClass}>Kata Sandi Baru</label>
              <div className="relative w-full">
                <input
                  type={showNewPw ? 'text' : 'password'}
                  required={editingPassword}
                  disabled={!editingPassword}
                  value={passwordForm.password}
                  onChange={(e) => setPasswordForm((f) => ({ ...f, password: e.target.value }))}
                  className={`${inputClass} pr-12`}
                />
                <button
                  type="button"
                  disabled={!editingPassword}
                  onClick={() => setShowNewPw(!showNewPw)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#1F5E88]/60 hover:text-[#1F5E88] cursor-pointer transition-colors disabled:opacity-50"
                >
                  {showNewPw ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className={labelClass}>Konfirmasi Kata Sandi Baru</label>
              <div className="relative w-full">
                <input
                  type={showConfirmPw ? 'text' : 'password'}
                  required={editingPassword}
                  disabled={!editingPassword}
                  value={passwordForm.password_confirmation}
                  onChange={(e) =>
                    setPasswordForm((f) => ({ ...f, password_confirmation: e.target.value }))
                  }
                  className={`${inputClass} pr-12`}
                />
                <button
                  type="button"
                  disabled={!editingPassword}
                  onClick={() => setShowConfirmPw(!showConfirmPw)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#1F5E88]/60 hover:text-[#1F5E88] cursor-pointer transition-colors disabled:opacity-50"
                >
                  {showConfirmPw ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Password Requirements Card */}
            <div className={`mt-4 p-4 rounded-xl border transition-colors duration-300 ${editingPassword ? 'bg-black/20 border-white/10' : 'bg-transparent border-transparent'}`}>
              <div className="space-y-2">
                <ReqItem met={reqLength} text="Minimal 8 & maksimal 20 karakter." />
                <ReqItem met={reqCase} text="Mengandung huruf besar & kecil." />
                <ReqItem met={reqNumSpec} text="Mengandung angka atau karakter spesial (@, #, $, dll.)" />
              </div>
            </div>
          </form>

          <div className="flex justify-end pt-6 border-t border-white/10 mt-auto">
            {!editingPassword ? (
              <button
                type="button"
                onClick={startEditingPassword}
                className="flex items-center gap-2 bg-[#B8DDF5] hover:bg-white text-[#1F5E88] px-6 py-3 rounded-xl font-bold text-base shadow-lg hover:shadow-xl transition-all cursor-pointer hover:-translate-y-0.5"
              >
                <Pencil size={18} />
                Ubah Kata Sandi
              </button>
            ) : (
              <div className="flex gap-4 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={cancelEditingPassword}
                  disabled={passwordSaving}
                  className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-base font-bold cursor-pointer transition-all disabled:opacity-50"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handlePasswordChange}
                  disabled={passwordSaving}
                  className="px-6 py-3 rounded-xl bg-[#B8DDF5] hover:bg-white text-[#1F5E88] text-base font-bold cursor-pointer transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:bg-[#B8DDF5]"
                >
                  {passwordSaving ? 'Menyimpan...' : 'Simpan Kata Sandi'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
