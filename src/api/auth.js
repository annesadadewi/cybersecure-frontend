import api from './axios';

export const authService = {
    // Fungsi untuk Login
    login: async (credentials) => {
        // Step 1: CSRF Cookie (Wajib jika menggunakan Sanctum)
        try {
            await api.get('/csrf-cookie', { baseURL: 'http://127.0.0.1:8000' });
        } catch (e) {
            console.error('CSRF Cookie fail', e);
        }
        
        // Step 2: Login request
        const response = await api.post('/login', credentials);
        return response.data;
    },

    // Fungsi untuk Register
    register: async (userData) => {
        const response = await api.post('/register', userData);
        return response.data;
    },

    // Fungsi untuk Logout
    logout: async () => {
        await api.post('/logout');
        localStorage.removeItem('token');
    },

    // Mendapatkan data user yang sedang login
    me: async () => {
        const response = await api.get('/user');
        return response.data;
    }
};
