import React, { useState, useEffect, useCallback } from 'react';
import { X, FileSpreadsheet, FileText, RefreshCw } from 'lucide-react';
import { transactionService } from '../api/transactions';
import { formatIDR, getTxKind } from '../utils/transactions';
import { downloadSalesSummaryPdf } from '../utils/exportSalesPdf';

const TransactionSummaryModal = ({ open, onClose, initialStore, initialProduct }) => {
  const [store, setStore] = useState('all');
  const [product, setProduct] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(null);
  const [data, setData] = useState({
    transactions: [],
    summary: { income_total: 0, refund_total: 0, net_total: 0, transaction_count: 0 },
    filter_options: { marketplaces: [], products: [] },
  });

  const fetchSummary = useCallback(async () => {
    setLoading(true);
    try {
      const result = await transactionService.getSummary({
        marketplace: store,
        product,
        dateFrom,
        dateTo,
      });
      setData(result);
    } catch (err) {
      console.error('Gagal memuat summary:', err);
      setData({
        transactions: [],
        summary: { income_total: 0, refund_total: 0, net_total: 0, transaction_count: 0 },
        filter_options: { marketplaces: [], products: [] },
      });
    } finally {
      setLoading(false);
    }
  }, [store, product, dateFrom, dateTo]);

  useEffect(() => {
    if (!open) return;
    setStore(initialStore && initialStore !== 'all' ? initialStore : 'all');
    setProduct(initialProduct && initialProduct !== 'all' ? initialProduct : 'all');
    setDateFrom('');
    setDateTo('');
  }, [open, initialStore, initialProduct]);

  useEffect(() => {
    if (!open) return;
    fetchSummary();
  }, [open, fetchSummary]);

  const downloadBlob = (blob, filename) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportCsv = async () => {
    setExporting('csv');
    try {
      const res = await transactionService.exportSummary('csv', {
        marketplace: store,
        product,
        dateFrom,
        dateTo,
      });
      downloadBlob(new Blob([res.data], { type: 'text/csv;charset=utf-8;' }), `ringkasan-penjualan-${Date.now()}.csv`);
    } catch (err) {
      console.error('Export CSV gagal:', err);
    } finally {
      setExporting(null);
    }
  };

  const handleExportPdf = async () => {
    setExporting('pdf');
    try {
      await downloadSalesSummaryPdf({
        transactions: data.transactions,
        summary: data.summary,
        filters: { marketplace: store, product, dateFrom, dateTo },
      });
    } catch (err) {
      console.error('Export PDF gagal:', err);
    } finally {
      setExporting(null);
    }
  };

  if (!open) return null;

  const { transactions, summary, filter_options: options } = data;
  const storeOpts = options?.marketplaces || [];
  const productOpts = options?.products || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div
        className="w-full max-w-3xl max-h-[90vh] overflow-hidden rounded-2xl sm:rounded-3xl border border-white/15 bg-gradient-to-b from-[#1F5E88] to-[#123A57] shadow-2xl flex flex-col text-white"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 p-5 sm:p-6 border-b border-white/10 shrink-0">
          <div>
            <h2 className="text-lg sm:text-xl font-bold">Riwayat Summary Penjualan</h2>
            <p className="text-white/60 text-xs sm:text-sm mt-1">
              Filter toko, produk, dan periode — unduh PDF atau spreadsheet
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-white/10 transition-colors cursor-pointer shrink-0"
            aria-label="Tutup"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="space-y-1.5">
              <span className="text-[10px] uppercase font-bold text-white/50 tracking-wider">Toko</span>
              <select
                value={store}
                onChange={(e) => setStore(e.target.value)}
                className="w-full bg-white/10 border border-white/15 rounded-xl px-3 py-2.5 text-sm font-semibold outline-none focus:ring-2 focus:ring-[#69C3FF]/40"
              >
                <option value="all" className="text-[#0D2C3D]">Semua toko</option>
                {storeOpts.map((name) => (
                  <option key={name} value={name} className="text-[#0D2C3D]">
                    {name}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-1.5">
              <span className="text-[10px] uppercase font-bold text-white/50 tracking-wider">Produk</span>
              <select
                value={product}
                onChange={(e) => setProduct(e.target.value)}
                className="w-full bg-white/10 border border-white/15 rounded-xl px-3 py-2.5 text-sm font-semibold outline-none focus:ring-2 focus:ring-[#69C3FF]/40"
              >
                <option value="all" className="text-[#0D2C3D]">Semua produk</option>
                {productOpts.map((name) => (
                  <option key={name} value={name} className="text-[#0D2C3D]">
                    {name}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-1.5">
              <span className="text-[10px] uppercase font-bold text-white/50 tracking-wider">Dari tanggal</span>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-full bg-white/10 border border-white/15 rounded-xl px-3 py-2.5 text-sm font-semibold outline-none focus:ring-2 focus:ring-[#69C3FF]/40"
              />
            </label>
            <label className="space-y-1.5">
              <span className="text-[10px] uppercase font-bold text-white/50 tracking-wider">Sampai tanggal</span>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-full bg-white/10 border border-white/15 rounded-xl px-3 py-2.5 text-sm font-semibold outline-none focus:ring-2 focus:ring-[#69C3FF]/40"
              />
            </label>
          </div>

          <button
            type="button"
            onClick={fetchSummary}
            disabled={loading}
            className="text-xs font-bold text-[#B8DDF5] flex items-center gap-1.5 hover:text-white disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            Terapkan filter
          </button>

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

          <div className="rounded-xl border border-white/10 overflow-hidden max-h-52 overflow-y-auto bg-white/5">
            {loading ? (
              <div className="p-8 text-center text-white/50 text-sm">Memuat data...</div>
            ) : (
              <table className="w-full text-xs">
                <thead className="bg-white/10 sticky top-0">
                  <tr>
                    <th className="text-left p-2.5 font-bold text-white/80">Toko</th>
                    <th className="text-left p-2.5 font-bold text-white/80">Produk</th>
                    <th className="text-right p-2.5 font-bold text-white/80">Nominal</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="p-6 text-center text-white/50">
                        Tidak ada transaksi untuk filter ini.
                      </td>
                    </tr>
                  ) : (
                    transactions.map((tx) => {
                      const isRefund = getTxKind(tx) === 'refund';
                      return (
                        <tr key={tx.id} className="border-t border-white/5 hover:bg-white/5">
                          <td className="p-2.5 align-middle">{tx.marketplace_name}</td>
                          <td className="p-2.5 truncate max-w-[120px] align-middle">{tx.product_name}</td>
                          <td
                            className={`p-2.5 text-right font-bold align-middle whitespace-nowrap ${
                              isRefund ? 'text-red-400' : 'text-green-400'
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
            )}
          </div>
        </div>

        <div className="p-5 sm:p-6 border-t border-white/10 flex flex-wrap gap-2 shrink-0">
          <button
            type="button"
            onClick={handleExportPdf}
            disabled={!!exporting}
            className="flex items-center justify-center gap-2 bg-[#B8DDF5] text-[#1F5E88] font-bold text-xs px-4 py-3 rounded-xl hover:bg-white transition-all cursor-pointer min-w-[140px] disabled:opacity-60"
          >
            <FileText size={16} />
            {exporting === 'pdf' ? 'Mengunduh...' : 'Unduh PDF'}
          </button>
          <button
            type="button"
            onClick={handleExportCsv}
            disabled={!!exporting}
            className="flex items-center justify-center gap-2 bg-white/10 text-white font-bold text-xs px-4 py-3 rounded-xl border border-white/20 hover:bg-white/15 cursor-pointer min-w-[140px] disabled:opacity-60"
          >
            <FileSpreadsheet size={16} />
            {exporting === 'csv' ? 'Mengunduh...' : 'Unduh Spreadsheet'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="ml-auto text-white/70 font-bold text-xs px-4 py-3 hover:text-white cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionSummaryModal;
