import api from './axios';

export const marketplaceService = {
    // 1. Fetch connected marketplaces
    getMarketplaces: async () => {
        const response = await api.get('/marketplaces');
        return response.data;
    },

    // 2. Add/connect new marketplace account
    addMarketplace: async (data) => {
        const response = await api.post('/marketplaces', data);
        return response.data;
    },

    // 3. Disconnect marketplace account (marks as disconnected)
    disconnectMarketplace: async (id) => {
        const response = await api.delete(`/marketplaces/${id}`);
        return response.data;
    },

    // 4. Fetch transactions for connected marketplaces
    getTransactions: async () => {
        const response = await api.get('/marketplace/transactions');
        return response.data;
    },

    // 5. Main account: Request OTP
    forgotPassword: async (email) => {
        const response = await api.post('/forgot-password', { email });
        return response.data;
    },

    // 6. Main account: Verify OTP
    verifyOtp: async (email, otp) => {
        const response = await api.post('/verify-otp', { email, otp });
        return response.data;
    },

    // 7. Main account: Reset password
    resetPassword: async (email, otp, password, password_confirmation) => {
        const response = await api.post('/reset-password', {
            email,
            otp,
            password,
            password_confirmation
        });
        return response.data;
    },

    // 8. Marketplace account: Request OTP
    forgotMarketplacePassword: async (marketplace_name, marketplace_email) => {
        const response = await api.post('/marketplaces/forgot-password', {
            marketplace_name,
            marketplace_email
        });
        return response.data;
    },

    // 9. Marketplace account: Reset password/token
    resetMarketplacePassword: async (marketplace_name, marketplace_email, otp, password) => {
        const response = await api.post('/marketplaces/reset-password', {
            marketplace_name,
            marketplace_email,
            otp,
            password
        });
        return response.data;
    }
};
