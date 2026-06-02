export const formatIDR = (num) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(Math.abs(Number(num) || 0));

export const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return '-';
  return d.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatDateShort = (dateStr) => {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return '-';
  return d.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const getTxKind = (tx) => {
  if (tx.type === 'refund') return 'refund';
  const raw = String(tx.type || tx.transaction_type || tx.status || '').toLowerCase();
  if (raw.includes('refund') || raw.includes('pengembalian') || raw.includes('return')) {
    return 'refund';
  }
  if (Number(tx.amount) < 0) return 'refund';
  return 'income';
};

export const getTxAmount = (tx) => {
  const n = Number(tx.amount) || 0;
  return getTxKind(tx) === 'refund' ? -Math.abs(n) : Math.abs(n);
};

export const filterTransactions = (transactions, { store, product, dateFrom, dateTo }) => {
  return transactions.filter((tx) => {
    if (store && store !== 'all' && tx.marketplace_name !== store) return false;
    if (product && product !== 'all' && tx.product_name !== product) return false;
    if (dateFrom || dateTo) {
      const d = new Date(tx.transaction_date);
      if (Number.isNaN(d.getTime())) return false;
      if (dateFrom) {
        const from = new Date(dateFrom);
        from.setHours(0, 0, 0, 0);
        if (d < from) return false;
      }
      if (dateTo) {
        const to = new Date(dateTo);
        to.setHours(23, 59, 59, 999);
        if (d > to) return false;
      }
    }
    return true;
  });
};

export const buildChartData = (transactions) => {
  const chartGroup = {};
  transactions.forEach((tx) => {
    if (getTxKind(tx) === 'refund') return;
    const d = new Date(tx.transaction_date);
    const dayKey = d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
    chartGroup[dayKey] = (chartGroup[dayKey] || 0) + Math.abs(Number(tx.amount));
  });
  const sortedDates = Object.keys(chartGroup).sort((a, b) => {
    const parseKey = (key) => {
      const parts = key.split(' ');
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
      const monthIdx = months.findIndex((m) => key.includes(m));
      return new Date(new Date().getFullYear(), monthIdx >= 0 ? monthIdx : 0, parseInt(parts[0], 10) || 1);
    };
    return parseKey(a) - parseKey(b);
  });
  return sortedDates.map((dateKey) => ({ name: dateKey, Omzet: chartGroup[dateKey] }));
};

export const buildTransactionNotifications = (transactions) => {
  return [...transactions]
    .sort((a, b) => new Date(b.transaction_date) - new Date(a.transaction_date))
    .map((tx, i) => {
      const kind = getTxKind(tx);
      const isRefund = kind === 'refund';
      return {
        id: tx.id ?? `tx-${i}-${tx.transaction_date}`,
        type: isRefund ? 'Pengembalian Dana' : 'Pemasukan',
        message: isRefund
          ? `Pengembalian dana: ${tx.product_name} (${tx.marketplace_name})`
          : `Transaksi masuk: ${tx.product_name} (${tx.marketplace_name})`,
        amount: getTxAmount(tx),
        time: formatDateShort(tx.transaction_date),
        rawDate: tx.transaction_date,
        unread: i < 5,
        isRefund,
      };
    });
};

export const downloadCsv = (rows, filename) => {
  const csv = rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');
  const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

export const downloadPdfSummary = ({ store, product, dateFrom, dateTo, rows, totals }) => {
  const title = 'Ringkasan Penjualan — CyberSecure';
  const filterLines = [
    store && store !== 'all' ? `Toko: ${store}` : 'Toko: Semua',
    product && product !== 'all' ? `Produk: ${product}` : 'Produk: Semua',
    dateFrom || dateTo
      ? `Periode: ${dateFrom || '…'} s/d ${dateTo || '…'}`
      : 'Periode: Semua',
  ].join(' | ');

  const tableRows = rows
    .map(
      (tx) => `
      <tr>
        <td>${tx.marketplace_name}</td>
        <td>${tx.product_name}</td>
        <td>${formatDate(tx.transaction_date)}</td>
        <td>${getTxKind(tx) === 'refund' ? 'Pengembalian' : 'Pemasukan'}</td>
        <td style="text-align:right">${formatIDR(getTxAmount(tx))}</td>
      </tr>`
    )
    .join('');

  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"/><title>${title}</title>
    <style>
      body{font-family:Arial,sans-serif;padding:24px;color:#0D2C3D}
      h1{font-size:20px;margin-bottom:8px}
      .meta{font-size:12px;color:#555;margin-bottom:20px}
      table{width:100%;border-collapse:collapse;font-size:12px}
      th,td{border:1px solid #ccc;padding:8px}
      th{background:#1F5E88;color:#fff}
      .totals{margin-top:16px;font-size:14px}
    </style></head><body>
    <h1>${title}</h1>
    <p class="meta">${filterLines}</p>
    <table>
      <thead><tr><th>Toko</th><th>Produk</th><th>Tanggal</th><th>Jenis</th><th>Nominal</th></tr></thead>
      <tbody>${tableRows || '<tr><td colspan="5">Tidak ada data</td></tr>'}</tbody>
    </table>
    <div class="totals">
      <p><strong>Total Pemasukan:</strong> ${formatIDR(totals.income)}</p>
      <p><strong>Total Pengembalian:</strong> ${formatIDR(totals.refund)}</p>
      <p><strong>Net:</strong> ${formatIDR(totals.net)}</p>
      <p><strong>Jumlah transaksi:</strong> ${totals.count}</p>
    </div>
    </body></html>`;

  const win = window.open('', '_blank');
  if (!win) return;
  win.document.write(html);
  win.document.close();
  win.focus();
  win.print();
};
