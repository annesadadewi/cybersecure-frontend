import React, { useState } from 'react';
import { FileSpreadsheet, FileText } from 'lucide-react';
import { transactionService } from '../../api/transactions';
import { formatIDR, getTxKind } from '../../utils/transactions';
import { triggerBlobDownload } from '../../utils/downloadBlob';
import { REPORT_YEAR } from '../../utils/reportMonths';

const SalesSummarySection = ({
  selectedMonth,
  isFuture,
  transactions,
  summary,
  totalInPool,
  onDownloadPdf,
  exportingPdf = false,
}) => {
  const [exportingSpreadsheet, setExportingSpreadsheet] = useState(false);

  const handleDownloadSpreadsheet = async () => {
    setExportingSpreadsheet(true);
    try {
      const res = await transactionService.exportReport(selectedMonth, 'xlsx', REPORT_YEAR);
      const filename = `ringkasan-penjualan-${selectedMonth.toLowerCase()}-${REPORT_YEAR}.xls`;
      const blob = res.data instanceof Blob ? res.data : new Blob([res.data]);
      triggerBlobDownload(blob, filename);
    } catch (e) {
      console.error('Export spreadsheet gagal:', e);
      alert(e?.message || 'Gagal mengunduh spreadsheet.');
    } finally {
      setExportingSpreadsheet(false);
    }
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-[#B8DDF5]/15 to-[#B8DDF5]/5 p-5 sm:p-6 shadow-xl space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold text-white">Tabel Summary Penjualan Utama</h3>
          <p className="text-white/60 text-xs sm:text-sm mt-0.5">
            Sumber data sama dengan log transaksi dashboard · bulan {selectedMonth}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onDownloadPdf(selectedMonth)}
            disabled={exportingPdf || exportingSpreadsheet || isFuture || transactions.length === 0 || !onDownloadPdf}
            className="flex items-center gap-2 bg-[#B8DDF5] hover:bg-white text-[#1F5E88] font-bold text-xs px-4 py-2.5 rounded-xl disabled:opacity-50 cursor-pointer shadow-lg transition-all"
          >
            <FileText size={15} />
            {exportingPdf ? 'Mengunduh...' : 'Unduh PDF'}
          </button>
          <button
            type="button"
            onClick={handleDownloadSpreadsheet}
            disabled={exportingPdf || exportingSpreadsheet || isFuture || transactions.length === 0}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/15 text-white font-bold text-xs px-4 py-2.5 rounded-xl border border-white/20 disabled:opacity-50 cursor-pointer transition-all"
          >
            <FileSpreadsheet size={15} />
            {exportingSpreadsheet ? 'Mengunduh...' : 'Unduh Spreadsheet'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {[
          { label: 'Pemasukan', val: formatIDR(summary.income_total), color: '#10B981' },
          { label: 'Pengembalian', val: formatIDR(summary.refund_total), color: '#EF4444' },
          { label: 'Net', val: formatIDR(summary.net_total), color: '#69C3FF' },
        ].map((item) => (
          <div key={item.label} className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
            <p className="text-[9px] uppercase font-bold text-white/50">{item.label}</p>
            <p className="text-sm font-black mt-0.5" style={{ color: item.color }}>
              {item.val}
            </p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-white/10 overflow-hidden bg-white/5">
        {isFuture ? (
          <div className="py-12 text-center text-white/50 text-sm font-medium">Periode mendatang — belum ada data.</div>
        ) : (
          <div className="max-h-64 overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="bg-white/10 sticky top-0">
                <tr>
                  <th className="text-left py-3 px-4 font-bold text-white/80 text-xs uppercase tracking-wide">Toko</th>
                  <th className="text-left py-3 px-4 font-bold text-white/80 text-xs uppercase tracking-wide">Produk</th>
                  <th className="text-left py-3 px-4 font-bold text-white/80 text-xs uppercase tracking-wide hidden sm:table-cell">
                    Tanggal
                  </th>
                  <th className="text-center py-3 px-4 font-bold text-white/80 text-xs uppercase tracking-wide">Jenis</th>
                  <th className="text-right py-3 px-4 font-bold text-white/80 text-xs uppercase tracking-wide">Nominal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-10 text-center text-white/50 text-sm">
                      Tidak ada transaksi pada bulan {selectedMonth}.
                      {totalInPool > 0 && (
                        <span className="block mt-1 text-[#69C3FF] text-xs">
                          Pilih tab bulan dengan indikator hijau ({totalInPool} transaksi tersedia).
                        </span>
                      )}
                    </td>
                  </tr>
                ) : (
                  transactions.map((tx) => {
                    const isRefund = getTxKind(tx) === 'refund';
                    return (
                      <tr key={tx.id} className="hover:bg-white/5 transition-colors">
                        <td className="py-3 px-4 text-white font-medium align-middle">{tx.marketplace_name}</td>
                        <td className="py-3 px-4 text-white/90 align-middle max-w-[140px] truncate">{tx.product_name}</td>
                        <td className="py-3 px-4 text-white/60 text-xs align-middle hidden sm:table-cell">
                          {new Date(tx.transaction_date).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </td>
                        <td className="py-3 px-4 text-center align-middle">
                          <span
                            className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                              isRefund ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'
                            }`}
                          >
                            {isRefund ? 'Refund' : 'Masuk'}
                          </span>
                        </td>
                        <td
                          className={`py-3 px-4 text-right font-bold align-middle whitespace-nowrap ${
                            isRefund ? 'text-red-400' : 'text-[#10B981]'
                          }`}
                        >
                          {isRefund ? '-' : '+'}
                          {formatIDR(tx.amount)}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default SalesSummarySection;
