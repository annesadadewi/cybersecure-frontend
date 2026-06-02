import api from './axios';

const getActiveParams = () => {
  const params = {};
  
  // Get active core systems from localStorage
  try {
    const savedCore = localStorage.getItem('cybersecure_core_systems');
    if (savedCore) {
      const coreSystems = JSON.parse(savedCore);
      if (Array.isArray(coreSystems)) {
        coreSystems.forEach(sys => {
          if (sys.status === 'Aktif') {
            params[`core_${sys.id}`] = '1';
          }
        });
      }
    }
  } catch (e) {
    console.error(e);
  }

  // Get active custom integrations
  try {
    const savedCustom = localStorage.getItem('cybersecure_custom_integrations');
    if (savedCustom) {
      const custom = JSON.parse(savedCustom);
      if (custom) {
        Object.keys(custom).forEach(type => {
          if (Array.isArray(custom[type])) {
            custom[type].forEach(item => {
              if (item.status === 'Aktif') {
                params[`custom_${type}_${item.provider || item.name}`] = '1';
              }
            });
          }
        });
      }
    }
  } catch (e) {
    console.error(e);
  }

  return params;
};

export const anomalyService = {
  getMetrics: async () => {
    const params = getActiveParams();
    const response = await api.get('/anomalies/metrics', { params });
    return response.data;
  },

  getIncidents: async (tab = 'security') => {
    const params = { tab, ...getActiveParams() };
    const response = await api.get('/anomalies', { params });
    return response.data;
  },

  updateStatus: async (id, status) => {
    const response = await api.patch(`/anomalies/${id}/status`, { status });
    return response.data;
  },
};
