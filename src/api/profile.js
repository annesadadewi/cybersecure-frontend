import api from './axios';

export const profileService = {
  get: async () => {
    const response = await api.get('/profile');
    return response.data;
  },

  update: async (payload) => {
    const response = await api.put('/profile', payload);
    return response.data;
  },

    updatePhoto: async (file) => {
    const formData = new FormData();
    formData.append('photo', file);
    const response = await api.post('/profile/photo', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  deletePhoto: async () => {
    const response = await api.delete('/profile/photo');
    return response.data;
  },

  updatePassword: async (payload) => {
    const response = await api.put('/profile/password', payload);
    return response.data;
  },
};
