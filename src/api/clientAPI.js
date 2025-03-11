import apiClient from '@/plugins/axios';

export const fetchClients = async () => {
    try {
        const response = await apiClient.get('/clients');
        return response.data;
    } catch (error) {
        console.error('Error al obtener los clientes:', error);
        throw error;
    }
};

export const addClient = async (client) => {
    try {
        const response = await apiClient.post('/clients', client);
        return response.data;
    } catch (error) {
        console.error('Error al agregar el cliente:', error);
        throw error;
    }
};

export const editClient = async (clientId, updatedData) => {
    try {
        const response = await apiClient.put(`${'/clients'}/${clientId}`, updatedData);
        return response.data;
    } catch (error) {
        console.error(`Error al editar el cliente con ID ${clientId}:`, error);
        throw error;
    }
};

export const deleteClient = async (clientId) => {
    try {
        await apiClient.delete(`${'/clients'}/${clientId}`);
    } catch (error) {
        console.error(`Error al eliminar el cliente con ID ${clientId}:`, error);
        throw error;
    }
};
