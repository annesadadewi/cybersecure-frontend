import { getTxKind } from './transactions';



export const REPORT_YEAR = 2026;

const MONTHS_LIST = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

const MONTH_MAP = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11 };



export const getMonthKey = (dateStr) => {

  const date = new Date(dateStr);

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  return months[date.getMonth()];

};



/** Transaksi yang dihitung sebagai kerugian: refund, anomali, gagal, pending berisiko */

export const isLossTransaction = (tx) => {

  if (getTxKind(tx) === 'refund') return true;



  const status = String(tx.status || '').toLowerCase();

  const type = String(tx.type || tx.transaction_type || '').toLowerCase();



  if (type.includes('refund') || status.includes('refund')) return true;



  return ['suspicious', 'failed', 'pending', 'anomaly', 'risky'].includes(status);

};



/** Pemasukan bersih sukses (bukan refund / anomali) */

export const isProfitTransaction = (tx) => {

  if (isLossTransaction(tx)) return false;



  const status = String(tx.status || 'success').toLowerCase();

  return !status || status === 'success';

};



export const computeFinancialLoss = (transactions) => {

  let total = 0;

  (transactions || []).forEach((tx) => {

    if (isLossTransaction(tx)) total += Math.abs(Number(tx.amount) || 0);

  });

  return total;

};



export const computeProfit = (transactions) => {

  let total = 0;

  (transactions || []).forEach((tx) => {

    if (isProfitTransaction(tx)) total += Math.abs(Number(tx.amount) || 0);

  });

  return total;

};



export const isFutureMonth = (monthName, year = REPORT_YEAR) => {

  const now = new Date();

  if (year > now.getFullYear()) return true;

  if (year < now.getFullYear()) return false;



  const idx = MONTH_MAP[monthName];

  if (idx === undefined) return false;



  // Juni 2026: data partial (sampai tgl 7) — tetap bisa dilihat, bukan "periode mendatang"
  if (monthName === 'Jun' && year === REPORT_YEAR) {
    return false;
  }

  return idx > now.getMonth();
};



export const getDefaultReportMonth = (overviewMonths) => {

  if (overviewMonths) {

    const withData = MONTHS_LIST.filter((m) => overviewMonths[m]?.has_data);

    if (withData.length > 0) return withData[withData.length - 1];

  }

  return MONTHS_LIST[new Date().getMonth()] || 'Jan';

};



export const getMonthDateRange = (monthName, year = REPORT_YEAR) => {

  const monthIndex = MONTH_MAP[monthName];

  if (monthIndex === undefined) return { dateFrom: '', dateTo: '' };

  const dateFrom = new Date(year, monthIndex, 1);

  const lastDay = monthName === 'Jun' && year === REPORT_YEAR ? 7 : new Date(year, monthIndex + 1, 0).getDate();

  const dateTo = new Date(year, monthIndex, lastDay);

  const fmt = (d) =>

    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

  return { dateFrom: fmt(dateFrom), dateTo: fmt(dateTo) };

};



export const filterTransactionsByMonth = (transactions, monthName) =>

  (transactions || []).filter((tx) => getMonthKey(tx.transaction_date) === monthName);



export const computeSummaryFromTransactions = (transactions) => {

  let income = 0;

  let refund = 0;

  (transactions || []).forEach((tx) => {

    const amt = Math.abs(Number(tx.amount) || 0);

    if (getTxKind(tx) === 'refund') refund += amt;

    else if (isProfitTransaction(tx)) income += amt;

  });

  return {

    income_total: income,

    refund_total: refund,

    net_total: income - refund,

    transaction_count: transactions?.length || 0,

  };

};



export const buildMonthChartData = (transactions) => {

  const group = {};

  (transactions || []).forEach((tx) => {

    if (!isProfitTransaction(tx)) return;

    const d = new Date(tx.transaction_date);

    const day = d.getDate();

    group[day] = (group[day] || 0) + Math.abs(Number(tx.amount));

  });

  return Object.keys(group)

    .map((k) => ({ name: `Tgl ${k}`, Omzet: group[Number(k)] }))

    .sort((a, b) => parseInt(a.name.replace(/\D/g, ''), 10) - parseInt(b.name.replace(/\D/g, ''), 10));

};



export const formatTrendPercent = (value) => {

  if (value === null || value === undefined) return '—';

  const abs = Math.abs(value).toFixed(1);

  return value >= 0 ? `${abs}%` : `-${abs}%`;

};



export { MONTHS_LIST, MONTH_MAP };

