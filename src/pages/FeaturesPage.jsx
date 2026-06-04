import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import {
  ShieldAlert, Link2, BarChart2, Bell, ChevronRight, X,
  ShieldCheck, AlertTriangle, LineChart, ShoppingBag,
  FileText, CheckCircle, XCircle, Activity, Filter,
  Download, Settings, RefreshCw, Eye
} from 'lucide-react';

const FeaturesPage = () => {
  const [selectedFeature, setSelectedFeature] = useState(null);

  const features = [
    {
      id: 'dashboard-monitoring',
      title: 'Dashboard Monitoring',
      desc: 'Pantau anomali keamanan, integritas sistem, dan total integrasi aktif secara real-time dalam satu tampilan.',
      icon: Activity,
      color: '#B8DDF5',
      details: {
        subtitle: 'Pemantauan Keamanan Real-Time',
        description: 'Halaman utama CyberSecure menampilkan ringkasan kondisi keamanan bisnis online kamu secara langsung. Data diperbarui otomatis setiap 45 detik.',
        sections: [
          {
            title: 'Card Anomali Terdeteksi',
            content: (
              <div className="space-y-2">
                <p>Menampilkan total kasus ancaman yang berhasil terdeteksi, terbagi menjadi:</p>
                <ul className="list-disc list-inside space-y-1 ml-2 text-white/80">
                  <li><span className="text-red-400 font-semibold">High Risk:</span> Ancaman kritis seperti brute-force dan retur bermasalah.</li>
                  <li><span className="text-yellow-400 font-semibold">Medium Risk:</span> Aktivitas mencurigakan seperti login tidak biasa dan anomali geografis.</li>
                  <li><span className="text-blue-300 font-semibold">Low Risk:</span> Pola minor yang perlu dipantau, misalnya akses file sensitif.</li>
                </ul>
                <p className="text-white/60 text-xs mt-1">Klik card ini untuk langsung membuka Log Aktivitas Mencurigakan.</p>
              </div>
            ),
            icon: ShieldAlert
          },
          {
            title: 'Card System Integrity & Total Integrasi',
            content: (
              <div className="space-y-2">
                <p>Dua card pendamping di sebelah Anomali Terdeteksi:</p>
                <ul className="list-disc list-inside space-y-1 ml-2 text-white/80">
                  <li><strong>System Integrity (99.9%):</strong> Menunjukkan status kesehatan sistem secara keseluruhan, berdasarkan integrasi aktif yang terhubung.</li>
                  <li><strong>Total Integrasi:</strong> Jumlah akun marketplace, sistem inti (database, email, payment), dan integrasi kustom yang sedang aktif.</li>
                </ul>
              </div>
            ),
            icon: ShieldCheck
          },
          {
            title: 'Grafik & Log Transaksi Terkini',
            content: (
              <div className="space-y-2">
                <p>Bagian bawah dashboard menampilkan dua panel:</p>
                <ul className="list-disc list-inside space-y-1 ml-2 text-white/80">
                  <li><strong>Anomaly Risk Chart:</strong> Visualisasi grafik distribusi risiko dari seluruh transaksi yang terdeteksi (sukses, refund, mencurigakan, gagal).</li>
                  <li><strong>Log Transaksi Terkini:</strong> Daftar 15 transaksi terakhir dari semua marketplace yang terhubung, lengkap dengan status dan nominal.</li>
                </ul>
              </div>
            ),
            icon: LineChart
          }
        ]
      }
    },
    {
      id: 'anomali-terdeteksi',
      title: 'Anomali Terdeteksi',
      desc: 'Tinjau semua kasus ancaman, lihat log aktivitas mencurigakan, dan jalankan tindakan mitigasi langsung dari sini.',
      icon: ShieldAlert,
      color: '#FCA5A5',
      details: {
        subtitle: 'Pusat Penanganan Ancaman',
        description: 'Halaman ini adalah command center keamanan kamu. Semua insiden yang terdeteksi oleh sistem — baik dari sisi jaringan maupun transaksi — dikumpulkan di sini untuk ditindaklanjuti.',
        sections: [
          {
            title: 'Ringkasan Metrik Risiko',
            content: (
              <div className="space-y-2">
                <p>Di bagian atas halaman, kamu akan melihat tiga card metrik:</p>
                <ul className="list-disc list-inside space-y-1 ml-2 text-white/80">
                  <li><span className="text-red-400 font-semibold">High Risk</span> — Jumlah kasus yang memerlukan tindakan segera.</li>
                  <li><span className="text-yellow-400 font-semibold">Medium Risk</span> — Kasus yang perlu dipantau dan diinvestigasi lebih lanjut.</li>
                  <li><span className="text-blue-300 font-semibold">Low Risk</span> — Aktivitas minor yang tercatat namun belum kritis.</li>
                </ul>
              </div>
            ),
            icon: AlertTriangle
          },
          {
            title: 'Modal Log Aktivitas Mencurigakan',
            content: (
              <div className="space-y-2">
                <p>Klik <strong>"Tinjau Log Aktivitas"</strong> untuk membuka modal log yang berisi dua tab:</p>
                <ul className="list-disc list-inside space-y-1 ml-2 text-white/80">
                  <li><strong>Tab Keamanan:</strong> Log insiden jaringan (Akses File Sensitif, Brute-Force, Geographical Anomaly). Bisa langsung <em>Blokir IP</em>, tandai <em>Under Review</em>, atau <em>Abaikan</em>.</li>
                  <li><strong>Tab Transaksi:</strong> Daftar kasus transaksi bermasalah per marketplace. Tersedia tombol <em>Buka Toko Marketplace</em> untuk verifikasi langsung di sumbernya.</li>
                </ul>
              </div>
            ),
            icon: Eye
          },
          {
            title: 'Tindakan Mitigasi Cepat',
            content: (
              <div className="space-y-2">
                <p>Klik <strong>"Tindakan Mitigasi"</strong> untuk langsung membuka log dan menerapkan aksi:</p>
                <ul className="list-disc list-inside space-y-1 ml-2 text-white/80">
                  <li><strong>Blokir IP / Akun:</strong> Masukkan sumber ancaman ke blacklist firewall sistem.</li>
                  <li><strong>Mark as Review:</strong> Tandai insiden sebagai sedang diinvestigasi tim.</li>
                  <li><strong>Abaikan:</strong> Tutup insiden yang terkonfirmasi bukan ancaman nyata.</li>
                </ul>
              </div>
            ),
            icon: ShieldCheck
          }
        ]
      }
    },
    {
      id: 'manajemen-integrasi',
      title: 'Manajemen Integrasi',
      desc: 'Hubungkan dan kelola akun marketplace (Shopee, Tokopedia, dll), sistem inti, dan integrasi kustom bisnis kamu.',
      icon: Link2,
      color: '#93C5FD',
      details: {
        subtitle: 'Koneksi Ekosistem Bisnismu',
        description: 'Semua koneksi eksternal yang dipantau oleh CyberSecure dikelola di halaman ini. Terdapat tiga kategori integrasi yang bisa dikonfigurasi.',
        sections: [
          {
            title: 'Integrasi Marketplace',
            content: (
              <div className="space-y-2">
                <p>Hubungkan akun seller kamu di platform:</p>
                <ul className="list-disc list-inside space-y-1 ml-2 text-white/80">
                  <li><strong>Tokopedia, Shopee, Lazada, Blibli, Bukalapak</strong></li>
                </ul>
                <p>Cara menghubungkan:</p>
                <ol className="list-decimal list-inside space-y-1 ml-2 text-white/80">
                  <li>Klik tombol <strong>Hubungkan</strong> di samping nama marketplace.</li>
                  <li>Masukkan <em>API Token</em> dan <em>Client ID</em> dari Seller Center marketplace tersebut.</li>
                  <li>Klik Simpan — status akan berubah menjadi <span className="text-green-400">Connected</span>.</li>
                </ol>
                <p className="text-white/60 text-xs mt-1">Data transaksi dari marketplace yang terhubung akan otomatis muncul di Dashboard dan Reports.</p>
              </div>
            ),
            icon: ShoppingBag
          },
          {
            title: 'Sistem Inti (Core Systems)',
            content: (
              <div className="space-y-2">
                <p>Lima sistem inti bisnis yang bisa dihubungkan untuk pemantauan lebih luas:</p>
                <ul className="list-disc list-inside space-y-1 ml-2 text-white/80">
                  <li><strong>Email Server Utama</strong> (Gmail, Outlook, SendGrid)</li>
                  <li><strong>Database Keuangan</strong> (PostgreSQL, MySQL, Oracle)</li>
                  <li><strong>Sistem Pembayaran</strong> (Midtrans, Xendit, DANA, ShopeePay)</li>
                  <li><strong>Aplikasi Mobile</strong></li>
                  <li><strong>Web Portal</strong> (Nginx, Apache, Cloudflare)</li>
                </ul>
                <p className="text-white/60 text-xs mt-1">Status koneksi setiap sistem inti tersimpan secara lokal di browser kamu.</p>
              </div>
            ),
            icon: Settings
          },
          {
            title: 'Integrasi Kustom',
            content: (
              <div className="space-y-2">
                <p>Selain marketplace dan sistem inti bawaan, kamu bisa menambahkan integrasi custom sesuai kebutuhan spesifik bisnismu — misalnya ERP internal, sistem logistik, atau platform lain yang belum tersedia di daftar default.</p>
                <p className="text-white/60 text-xs mt-1">Status integrasi kustom ikut dihitung dalam total integrasi aktif di Dashboard.</p>
              </div>
            ),
            icon: Link2
          }
        ]
      }
    },
    {
      id: 'log-transaksi',
      title: 'Log Transaksi',
      desc: 'Lacak semua transaksi marketplace secara detail — pemasukan, refund, pembatalan, dan status mencurigakan.',
      icon: BarChart2,
      color: '#86EFAC',
      details: {
        subtitle: 'Rekam Jejak Transaksi Bisnis',
        description: 'Setiap transaksi dari marketplace yang terhubung direkam dan dikategorikan secara otomatis. Kamu bisa filter, cari, dan export data kapan saja.',
        sections: [
          {
            title: 'Kategori Status Transaksi',
            content: (
              <div className="space-y-2">
                <p>Setiap transaksi memiliki satu dari lima status berikut:</p>
                <ul className="list-disc list-inside space-y-1 ml-2 text-white/80">
                  <li><span className="text-green-400 font-semibold">Success</span> — Transaksi selesai dan pembayaran diterima.</li>
                  <li><span className="text-blue-300 font-semibold">Pending</span> — Menunggu konfirmasi pembayaran dari pembeli.</li>
                  <li><span className="text-red-400 font-semibold">Refund</span> — Dana dikembalikan ke pembeli atas permintaan retur.</li>
                  <li><span className="text-orange-400 font-semibold">Failed</span> — Transaksi gagal diproses.</li>
                  <li><span className="text-yellow-400 font-semibold">Suspicious</span> — Terdeteksi pola tidak wajar, memerlukan investigasi.</li>
                </ul>
              </div>
            ),
            icon: Activity
          },
          {
            title: 'Filter & Pencarian',
            content: (
              <div className="space-y-2">
                <p>Gunakan filter untuk mempersempit tampilan transaksi:</p>
                <ul className="list-disc list-inside space-y-1 ml-2 text-white/80">
                  <li>Filter berdasarkan <strong>Marketplace</strong> (Shopee, Tokopedia, Blibli, dll).</li>
                  <li>Filter berdasarkan <strong>Status</strong> transaksi.</li>
                  <li>Filter berdasarkan <strong>Rentang Tanggal</strong>.</li>
                  <li>Cari berdasarkan <strong>nama produk</strong> atau <strong>nominal transaksi</strong>.</li>
                </ul>
              </div>
            ),
            icon: Filter
          },
          {
            title: 'Export Data',
            content: (
              <div className="space-y-2">
                <p>Data transaksi bisa diunduh untuk keperluan rekonsiliasi atau audit:</p>
                <ul className="list-disc list-inside space-y-1 ml-2 text-white/80">
                  <li>Klik tombol <strong>Export</strong> di halaman Log Transaksi.</li>
                  <li>Data diunduh dalam format <strong>CSV</strong> yang bisa dibuka di Excel atau Google Sheets.</li>
                  <li>Hasil export menyesuaikan filter aktif — hanya data yang sedang ditampilkan yang diunduh.</li>
                </ul>
              </div>
            ),
            icon: Download
          }
        ]
      }
    },
    {
      id: 'laporan-bulanan',
      title: 'Laporan Bulanan',
      desc: 'Analisis profit, financial loss, dan tren penjualan per bulan dengan grafik interaktif dan ekspor PDF.',
      icon: FileText,
      color: '#FCD34D',
      details: {
        subtitle: 'Analisis Keuangan Per Periode',
        description: 'Halaman Reports menyajikan ringkasan keuangan bisnis kamu per bulan — mulai dari total profit, kerugian akibat refund dan anomali, hingga tren penjualan secara visual.',
        sections: [
          {
            title: 'Card Profit & Financial Loss',
            content: (
              <div className="space-y-2">
                <p>Dua card utama di bagian atas menampilkan:</p>
                <ul className="list-disc list-inside space-y-1 ml-2 text-white/80">
                  <li><span className="text-red-400 font-semibold">Financial Loss:</span> Total kerugian dari refund, transaksi mencurigakan, dan pesanan gagal di bulan yang dipilih — lengkap dengan persentase perubahan vs bulan sebelumnya.</li>
                  <li><span className="text-green-400 font-semibold">Profit:</span> Total pemasukan bersih dari transaksi sukses di bulan yang dipilih.</li>
                </ul>
              </div>
            ),
            icon: LineChart
          },
          {
            title: 'Grafik Tren Penjualan',
            content: (
              <div className="space-y-2">
                <p>Grafik interaktif <strong>Sales Trend Chart</strong> menampilkan fluktuasi transaksi harian dalam satu bulan penuh:</p>
                <ul className="list-disc list-inside space-y-1 ml-2 text-white/80">
                  <li>Sumbu X: Tanggal dalam bulan terpilih.</li>
                  <li>Sumbu Y: Nominal transaksi (dalam jutaan Rupiah).</li>
                  <li>Lonjakan tajam di grafik bisa menandakan flash sale normal atau aktivitas bot — bandingkan dengan data anomali untuk kepastian.</li>
                </ul>
                <p className="text-white/60 text-xs mt-1">Klik tab bulan di bagian Monthly Revenue Breakdown untuk berpindah periode.</p>
              </div>
            ),
            icon: BarChart2
          },
          {
            title: 'Export PDF Laporan',
            content: (
              <div className="space-y-2">
                <p>Setiap laporan bulanan bisa diunduh sebagai file PDF:</p>
                <ol className="list-decimal list-inside space-y-1 ml-2 text-white/80">
                  <li>Pilih bulan yang ingin diunduh.</li>
                  <li>Klik tombol <strong>Download PDF</strong> di bagian Sales Summary.</li>
                  <li>File PDF akan langsung terunduh dengan nama <code className="bg-[#0A2640] px-1.5 py-0.5 rounded text-xs text-[#B8DDF5]">ringkasan-penjualan-[bulan].pdf</code>.</li>
                </ol>
                <p className="text-white/60 text-xs mt-1">Data yang ada di PDF mencakup ringkasan metrik, tabel transaksi, dan breakdown per marketplace.</p>
              </div>
            ),
            icon: Download
          }
        ]
      }
    },
    {
      id: 'notifikasi',
      title: 'Notifikasi Transaksi',
      desc: 'Terima dan kelola pemberitahuan real-time untuk setiap pemasukan, refund, dan pembatalan dari seluruh marketplace.',
      icon: Bell,
      color: '#C4B5FD',
      details: {
        subtitle: 'Pusat Pemberitahuan Bisnis',
        description: 'Halaman Notifikasi menampilkan semua pemberitahuan transaksi dari marketplace yang terhubung, diurutkan dari yang belum dibaca ke yang sudah dibaca.',
        sections: [
          {
            title: 'Kategori Notifikasi',
            content: (
              <div className="space-y-2">
                <p>Notifikasi dikelompokkan menjadi empat jenis:</p>
                <ul className="list-disc list-inside space-y-1 ml-2 text-white/80">
                  <li><span className="text-green-400 font-semibold">Pemasukan (Dana Masuk):</span> Konfirmasi pembayaran berhasil diterima.</li>
                  <li><span className="text-red-400 font-semibold">Pengembalian Dana (Refund/Retur):</span> Notifikasi permintaan retur atau refund dari pembeli.</li>
                  <li><span className="text-violet-300 font-semibold">Transaksi Dibatalkan:</span> Pembeli membatalkan pesanan sebelum diproses.</li>
                  <li><span className="text-amber-400 font-semibold">Sinkronisasi:</span> Status proses sinkronisasi data dari marketplace.</li>
                </ul>
              </div>
            ),
            icon: Bell
          },
          {
            title: 'Filter & Tandai Dibaca',
            content: (
              <div className="space-y-2">
                <p>Cara mengelola notifikasi kamu:</p>
                <ul className="list-disc list-inside space-y-1 ml-2 text-white/80">
                  <li>Gunakan tombol <strong>Filter</strong> untuk menyaring jenis notifikasi yang ingin dilihat.</li>
                  <li>Centang satu atau lebih notifikasi yang <em>belum dibaca</em> menggunakan checkbox di sisi kanan.</li>
                  <li>Klik <strong>"Tandai Sudah Dibaca"</strong> — notifikasi akan langsung bergeser ke bawah dan berubah menjadi abu-abu tanpa perlu refresh halaman.</li>
                </ul>
              </div>
            ),
            icon: CheckCircle
          },
          {
            title: 'Indikator Belum Dibaca',
            content: (
              <div className="space-y-2">
                <p>Notifikasi yang belum dibaca ditandai dengan:</p>
                <ul className="list-disc list-inside space-y-1 ml-2 text-white/80">
                  <li>Badge <span className="bg-[#4AA9FF]/20 text-[#4AA9FF] px-1.5 py-0.5 rounded text-xs font-bold">Baru</span> di samping judul.</li>
                  <li>Border biru <code className="text-[#69C3FF]">#69C3FF</code> dan latar sedikit lebih terang.</li>
                  <li>Angka merah di sebelah judul halaman menunjukkan total notifikasi yang belum dibaca.</li>
                </ul>
                <p className="text-white/60 text-xs mt-1">Data notifikasi dari backend diperbarui setiap kali kamu membuka halaman atau menekan tombol Refresh.</p>
              </div>
            ),
            icon: XCircle
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
              <span>Baca Panduan</span>
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
          />

          {/* Modal Content */}
          <div className="relative w-full max-w-[95vw] lg:max-w-5xl bg-gradient-to-b from-[#164E75] to-[#0D2D44] rounded-2xl p-5 sm:p-8 md:p-10 shadow-2xl border border-white/10 animate-slideUp max-h-[90vh] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
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
                <h2 className="text-xl sm:text-3xl font-bold text-white mb-0.5 sm:mb-1">{selectedFeature.title}</h2>
                <h3 className="text-sm sm:text-lg text-[#B8DDF5] font-semibold">{selectedFeature.details.subtitle}</h3>
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
                Tutup Panduan
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