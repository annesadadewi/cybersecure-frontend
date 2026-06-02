import { formatIDR, getTxKind } from './transactions';

/** Unduh PDF instan (1 klik) — dynamic import agar bundle lebih ringan */
export const downloadSalesSummaryPdf = async ({ transactions, summary, filters }) => {
  const { jsPDF } = await import('jspdf');
  const { default: autoTable } = await import('jspdf-autotable');

  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  doc.setFontSize(16);
  doc.setTextColor(31, 94, 136);
  doc.text('Ringkasan Penjualan — CyberSecure', 14, 18);

  doc.setFontSize(9);
  doc.setTextColor(100, 100, 120);
  const filterLine = [
    `Toko: ${filters.marketplace === 'all' ? 'Semua' : filters.marketplace}`,
    `Produk: ${filters.product === 'all' ? 'Semua' : filters.product}`,
    `Periode: ${filters.dateFrom || '…'} s/d ${filters.dateTo || '…'}`,
  ].join('  |  ');
  doc.text(filterLine, 14, 26);

  doc.setFontSize(10);
  doc.setTextColor(60, 60, 80);
  doc.text(`Pemasukan: ${formatIDR(summary.income_total)}`, 14, 34);
  doc.text(`Pengembalian: ${formatIDR(summary.refund_total)}`, 14, 40);
  doc.text(`Net: ${formatIDR(summary.net_total)}`, 14, 46);

  const rows = transactions.map((tx) => {
    const isRefund = getTxKind(tx) === 'refund';
    return [
      tx.marketplace_name,
      tx.product_name,
      String(tx.transaction_date).slice(0, 16),
      isRefund ? 'Pengembalian' : 'Pemasukan',
      `${isRefund ? '-' : '+'}${formatIDR(tx.amount)}`,
    ];
  });

  autoTable(doc, {
    startY: 52,
    head: [['Toko', 'Produk', 'Tanggal', 'Jenis', 'Nominal']],
    body: rows.length ? rows : [['—', 'Tidak ada data', '—', '—', '—']],
    theme: 'grid',
    headStyles: {
      fillColor: [31, 94, 136],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
    alternateRowStyles: { fillColor: [224, 242, 254] },
    styles: { fontSize: 8, cellPadding: 3 },
    columnStyles: { 4: { halign: 'right' } },
  });

  doc.save(`ringkasan-penjualan-${Date.now()}.pdf`);
};
