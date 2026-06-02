import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api',
    withCredentials: true,
    timeout: 120000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
});

api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    if (config.responseType === 'blob' || config.responseType === 'arraybuffer') {
        config.headers.Accept = 'application/octet-stream, */*';
        config.headers['X-Requested-With'] = 'XMLHttpRequest';
    }
    return config;
});

export default api;
