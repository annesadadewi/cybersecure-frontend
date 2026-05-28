import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Brain, Shield, Bot, ChevronRight, X, Terminal, LineChart, ShieldAlert } from 'lucide-react';
import { theme } from '../Theme';

const FeaturesPage = () => {
  const [selectedFeature, setSelectedFeature] = useState(null);

  const features = [
    {
      id: 'setup-api',
      title: 'Setup API',
      desc: 'Cara integrasi marketplace.',
      icon: Brain,
      color: '#B8DDF5',
      details: {
        subtitle: 'Integrasi Marketplace',
        description: 'Bagian ini berisi dokumentasi teknis untuk menghubungkan dashboard dengan data eksternal.',
        sections: [
          {
            title: 'Langkah Konfigurasi',
            content: (
              <div className="space-y-2">
                <p>Ikuti panduan step-by-step berikut untuk mendapatkan dan memasukkan API Key:</p>
                <ol className="list-decimal list-inside space-y-1 ml-2 text-white/80">
                  <li>Login ke akun Seller Center di platform marketplace Anda (misal: Tokopedia, Shopee).</li>
                  <li>Akses menu <strong>Pengaturan (Settings)</strong>, lalu pilih opsi <strong>Integrasi API</strong> atau <strong>Developer API</strong>.</li>
                  <li>Klik tombol <strong>Generate New Key</strong> atau <strong>Buat Kredensial Baru</strong>.</li>
                  <li>Salin <em>Client ID</em> dan <em>Client Secret</em> (API Key) yang diberikan.</li>
                  <li>Kembali ke dashboard ini, buka menu <strong>Marketplace</strong>, dan tempelkan kunci tersebut ke kolom yang disediakan lalu simpan.</li>
                </ol>
              </div>
            ),
            icon: Terminal
          },
          {
            title: 'Dokumentasi Endpoint',
            content: (
              <div className="space-y-2">
                <p>Sistem ini akan berkomunikasi dengan beberapa endpoint utama dari marketplace Anda:</p>
                <ul className="list-disc list-inside space-y-1 ml-2 text-white/80">
                  <li><code className="bg-[#0A2640] px-2 py-0.5 rounded text-sm text-[#B8DDF5]">/api/v1/orders</code> : Untuk menarik data pesanan dan memantau anomali transaksi (misalnya order fiktif).</li>
                  <li><code className="bg-[#0A2640] px-2 py-0.5 rounded text-sm text-[#B8DDF5]">/api/v1/security-logs</code> : Untuk membaca log percobaan login atau aktivitas tidak biasa pada akun toko Anda.</li>
                </ul>
              </div>
            ),
            icon: Terminal
          },
          {
            title: 'Keamanan Data',
            content: (
              <div className="space-y-2">
                <p>Data Anda dijamin aman saat proses integrasi berlangsung:</p>
                <ul className="list-disc list-inside space-y-1 ml-2 text-white/80">
                  <li><strong>Enkripsi Transit:</strong> Semua komunikasi antara dashboard dan marketplace dienkripsi menggunakan protokol TLS 1.3.</li>
                  <li><strong>Enkripsi Storage:</strong> API Key yang Anda simpan di sistem kami dilindungi dengan enkripsi standar industri AES-256 dan tidak akan pernah dibagikan kepada pihak ketiga.</li>
                </ul>
              </div>
            ),
            icon: ShieldAlert
          }
        ]
      }
    },
    {
      id: 'log-analisis',
      title: 'Log Analisis',
      desc: 'Membaca pola ancaman.',
      icon: Shield,
      color: '#B8DDF5',
      details: {
        subtitle: 'Membaca Pola Ancaman',
        description: 'Modul ini berfungsi sebagai panduan interpretasi data bagi pengguna.',
        sections: [
          {
            title: 'Glosarium Status',
            content: (
              <div className="space-y-2">
                <p>Pahami arti dari masing-masing level ancaman yang muncul di dashboard Anda:</p>
                <ul className="list-disc list-inside space-y-1 ml-2 text-white/80">
                  <li><span className="text-red-400 font-semibold">High Risk:</span> Terdeteksi ancaman nyata, seperti serangan Brute Force atau Credential Stuffing. Sistem biasanya langsung memblokir sumber serangan.</li>
                  <li><span className="text-yellow-400 font-semibold">Suspicious:</span> Aktivitas mencurigakan, misalnya pengguna mencoba login dari negara yang tidak biasa, namun belum pasti sebuah serangan. Butuh pantauan.</li>
                  <li><span className="text-green-400 font-semibold">Clean / Safe:</span> Aktivitas normal, tidak ada pola bahaya yang terdeteksi.</li>
                </ul>
              </div>
            ),
            icon: LineChart
          },
          {
            title: 'Visualisasi Tren',
            content: (
              <div className="space-y-2">
                <p>Cara membaca grafik pemantauan pada halaman dashboard utama:</p>
                <ul className="list-disc list-inside space-y-1 ml-2 text-white/80">
                  <li><strong>Sumbu Horizontal (X):</strong> Mewakili rentang waktu (jam, hari, atau minggu).</li>
                  <li><strong>Sumbu Vertikal (Y):</strong> Mewakili jumlah aktivitas (contoh: jumlah hit API, jumlah transaksi).</li>
                  <li><strong>Lonjakan Garis (Spike):</strong> Jika ada garis yang tiba-tiba naik tajam, segera cek apakah itu kampanye promo normal atau adanya aktivitas bot.</li>
                </ul>
              </div>
            ),
            icon: LineChart
          },
          {
            title: 'Identifikasi Anomali',
            content: (
              <div className="space-y-2">
                <p>Cara membedakan antara lonjakan normal dan serangan siber:</p>
                <ul className="list-disc list-inside space-y-1 ml-2 text-white/80">
                  <li><strong>Trafik Normal (Promo/Flash Sale):</strong> Lonjakan trafik tinggi dibarengi dengan rasio konversi pembelian yang masuk akal dan berasal dari berbagai IP/perangkat yang beragam.</li>
                  <li><strong>Serangan Bot:</strong> Lonjakan trafik sangat drastis dalam hitungan detik, rasio konversi hampir 0%, dan didominasi oleh request dari alamat IP yang sama atau dari server/VPN anonim.</li>
                </ul>
              </div>
            ),
            icon: ShieldAlert
          }
        ]
      }
    },
    {
      id: 'bot-config',
      title: 'Bot Config',
      desc: 'Otomasi deteksi bot.',
      icon: Bot,
      color: '#B8DDF5',
      details: {
        subtitle: 'Otomasi Deteksi Bot',
        description: 'Bagian teknis untuk mengatur tingkat sensitivitas dan respons otomatis terhadap ancaman.',
        sections: [
          {
            title: 'Rule Setting',
            content: (
              <div className="space-y-2">
                <p>Anda bisa mengatur ambang batas (threshold) kapan sistem bertindak:</p>
                <ul className="list-disc list-inside space-y-1 ml-2 text-white/80">
                  <li><strong>Rate Limiting:</strong> Tentukan maksimal permintaan, misal <em>"Blokir IP jika mengirim lebih dari 100 request dalam 1 menit."</em></li>
                  <li><strong>Location Blocking:</strong> Anda dapat langsung memblokir pengunjung dari negara tertentu yang tidak menjadi target pasar Anda namun sering menjadi sumber spam.</li>
                </ul>
              </div>
            ),
            icon: Bot
          },
          {
            title: 'Whitelisting',
            content: (
              <div className="space-y-2">
                <p>Mencegah sistem memblokir pihak yang sah (False Positive):</p>
                <ol className="list-decimal list-inside space-y-1 ml-2 text-white/80">
                  <li>Masuk ke menu <strong>Settings &gt; Security Rules</strong>.</li>
                  <li>Pilih opsi <strong>IP Whitelist</strong>.</li>
                  <li>Masukkan IP statis kantor Anda atau IP server payment gateway mitra.</li>
                  <li>Simpan, dan IP tersebut akan melewati filter keamanan tanpa batasan.</li>
                </ol>
              </div>
            ),
            icon: Bot
          },
          {
            title: 'Aksi Respon',
            content: (
              <div className="space-y-2">
                <p>Sistem menyediakan berbagai opsi tindakan saat anomali terdeteksi:</p>
                <ul className="list-disc list-inside space-y-1 ml-2 text-white/80">
                  <li><strong>Block:</strong> Langsung menolak akses dari IP tersebut selama waktu tertentu (misalnya 1 jam).</li>
                  <li><strong>Challenge (CAPTCHA):</strong> Daripada diblokir, pengunjung akan diminta menyelesaikan CAPTCHA. Berguna jika Anda ragu apakah pengunjung tersebut bot atau manusia asli.</li>
                  <li><strong>Log Only:</strong> Hanya mencatat aktivitas ke dalam sistem tanpa melakukan pemblokiran (Mode Observasi).</li>
                </ul>
              </div>
            ),
            icon: Bot
          }
        ]
      }
    }
  ];

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn relative">
      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {features.map((feature, i) => (
          <div 
            key={i} 
            className="p-6 lg:p-8 rounded-2xl lg:rounded-3xl transition-all duration-300 hover:scale-[1.02] shadow-2xl border border-white/10 group relative overflow-hidden flex flex-col justify-between min-h-[220px] cursor-pointer bg-gradient-to-b from-[#164E75] to-[#0F3957]"
          >
            <div>
              {/* Icon Container */}
              <div 
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-lg border border-white/5"
                style={{ backgroundColor: feature.color }}
              >
                <feature.icon size={26} className="text-[#1F5E88]" strokeWidth={2} />
              </div>

              {/* Content */}
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-white/60 text-sm sm:text-base leading-relaxed mb-6">
                {feature.desc}
              </p>
            </div>

            {/* Link */}
            <div 
              className="flex items-center gap-2 text-[#B8DDF5] font-bold text-sm sm:text-base cursor-pointer group-hover:translate-x-1.5 transition-transform"
              onClick={() => setSelectedFeature(feature)}
            >
              <span>Baca Tutorial</span>
              <ChevronRight size={16} />
            </div>
          </div>
        ))}
      </div>

      {/* Modal Tutorial */}
      {selectedFeature && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 md:p-12">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setSelectedFeature(null)}
          ></div>
          
          {/* Modal Content */}
          <div 
            className="relative w-full max-w-[95vw] lg:max-w-5xl bg-gradient-to-b from-[#164E75] to-[#0D2D44] rounded-2xl p-5 sm:p-8 md:p-10 shadow-2xl border border-white/10 animate-slideUp max-h-[90vh] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']"
          >
            {/* Close button */}
            <button 
              onClick={() => setSelectedFeature(null)}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 text-white/50 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full cursor-pointer"
            >
              <X size={24} />
            </button>

            {/* Header */}
            <div className="flex items-center gap-4 sm:gap-6 mb-6 sm:mb-8">
              <div 
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center shadow-lg shrink-0"
                style={{ backgroundColor: selectedFeature.color }}
              >
                <selectedFeature.icon size={36} className="text-[#1F5E88]" strokeWidth={2} />
              </div>
              <div className="min-w-0">
                <h2 className="text-xl sm:text-3xl font-bold text-white mb-0.5 sm:mb-1 truncate">{selectedFeature.title}</h2>
                <h3 className="text-sm sm:text-lg text-[#B8DDF5] font-semibold truncate">{selectedFeature.details.subtitle}</h3>
              </div>
            </div>

            {/* Description */}
            <p className="text-white/80 text-sm sm:text-base leading-relaxed mb-8">
              {selectedFeature.details.description}
            </p>

            {/* Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
              {selectedFeature.details.sections.map((section, idx) => (
                <div 
                  key={idx}
                  className="bg-[#0D3654] rounded-2xl p-4 sm:p-5 flex flex-col items-start gap-4 border border-white/5 hover:border-white/10 transition-colors h-full"
                >
                  <div className="bg-[#164E75] p-3 rounded-xl shrink-0">
                    <section.icon size={22} className="text-[#B8DDF5]" />
                  </div>
                  <div>
                    <h4 className="text-base sm:text-lg font-bold text-white mb-2">{section.title}</h4>
                    <div className="text-white/70 leading-relaxed text-xs sm:text-sm">
                      {section.content}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Footer / CTA */}
            <div className="mt-8 sm:mt-10 flex justify-end">
              <button 
                onClick={() => setSelectedFeature(null)}
                className="px-6 py-3 bg-[#B8DDF5] text-[#1F5E88] font-bold rounded-xl hover:bg-white transition-colors shadow-lg cursor-pointer text-xs sm:text-sm"
              >
                Tutup Tutorial
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};
export default FeaturesPage;