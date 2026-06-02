import api from './axios';

export const notificationService = {
  getAll: async (type = 'all', limit = 50) => {
    const response = await api.get('/notifications', { params: { type, limit } });
    return response.data;
  },

  bulkMarkRead: async (ids, type = 'all', limit = 50) => {
    const response = await api.post(
      '/notifications/mark-read',
      { ids },
      { params: { type, limit } }
    );
    return response.data;
  },
};
