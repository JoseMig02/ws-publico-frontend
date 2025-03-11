import apiClient from '@/plugins/axios';

export const fetchLogStats = async () => {
    try {
        const response = await apiClient.get('/logs/stats');
        return response.data;
    } catch (error) {
        console.error('Error al obtener estadísticas de logs:', error);
        throw error;
    }
};

export const fetchLogs = async (params) => {
    try {
        const response = await apiClient.get('/logs', {
            params: params
        });
        return response.data;
    } catch (error) {
        console.error('Error al obtener los logs:', error);
        throw error;
    }
};
