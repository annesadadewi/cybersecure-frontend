import api from './axios';

const buildParams = (filters = {}) => {
  const params = {};
  if (filters.marketplace && filters.marketplace !== 'all') params.marketplace = filters.marketplace;
  if (filters.product && filters.product !== 'all') params.product = filters.product;
  if (filters.type && filters.type !== 'all') params.type = filters.type;
  if (filters.dateFrom) params.date_from = filters.dateFrom;
  if (filters.dateTo) params.date_to = filters.dateTo;
  return params;
};

export const transactionService = {
  getRecent: async (limit = 15) => {
    const response = await api.get('/transactions/recent', { params: { limit } });
    return response.data;
  },

  /** Semua transaksi mock (sama sumber dengan log dashboard) */
  getAll: async () => {
    const response = await api.get('/marketplace/transactions');
    return response.data;
  },

  getSummary: async (filters = {}) => {
    const response = await api.get('/transactions/summary', { params: buildParams(filters) });
    return response.data;
  },

  getMonthlyReport: async (month, year = 2026) => {
    const response = await api.get('/reports/monthly', { params: { month, year } });
    return response.data;
  },

  getMonthsOverview: async (year = 2026) => {
    const response = await api.get('/reports/months-overview', { params: { year } });
    return response.data;
  },

  exportSummary: async (format, filters = {}) => {
    const response = await api.get('/transactions/export', {
      params: { ...buildParams(filters), format },
      responseType: format === 'pdf' ? 'text' : 'blob',
    });
    return response;
  },

  /** Unduh ringkasan penjualan bulanan — axios + blob (sama mekanisme spreadsheet) */
  exportReport: async (month, format, year = 2026) => {
    const fmt = format === 'spreadsheet' ? 'xlsx' : format;

    try {
      const response = await api.get('/reports/export', {
        params: { month, format: fmt, year },
        responseType: 'blob',
      });

      const blob = response.data;
      const contentType = response.headers['content-type'] || blob.type || '';

      if (contentType.includes('json') || (blob.size < 500 && fmt === 'pdf')) {
        const text = await blob.text();
        try {
          const err = JSON.parse(text);
          throw new Error(err.message || 'Export gagal');
        } catch (parseErr) {
          if (parseErr.message && parseErr.message !== 'Export gagal') throw parseErr;
          throw new Error(text.slice(0, 200) || 'Export gagal');
        }
      }

      if (fmt === 'pdf') {
        const header = new Uint8Array(await blob.slice(0, 5).arrayBuffer());
        const isPdf = header[0] === 0x25 && header[1] === 0x50 && header[2] === 0x44 && header[3] === 0x46;
        if (!isPdf) {
          throw new Error('Server tidak mengembalikan file PDF. Login ulang lalu coba lagi.');
        }
      }

      return response;
    } catch (err) {
      if (err.code === 'ECONNABORTED') {
        throw new Error('Unduh timeout — PDF sedang diproses, coba lagi.');
      }
      if (err.message === 'Network Error' || !err.response) {
        throw new Error(
          'Tidak bisa hubungi backend. Pastikan `php artisan serve` jalan di http://127.0.0.1:8000'
        );
      }
      if (err.response?.data instanceof Blob) {
        const text = await err.response.data.text();
        try {
          const json = JSON.parse(text);
          throw new Error(json.message || `Export gagal (${err.response.status})`);
        } catch {
          throw new Error(`Export gagal (${err.response.status})`);
        }
      }
      throw err;
    }
  },
};
