import axios from 'axios';
import { API_CONSTANTS } from '../constants/apiEndpoints';

const apiClient = axios.create({
    baseURL: API_CONSTANTS.API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.request.use(config => {
    const token = localStorage.getItem('token'); // Assuming token is stored in localStorage
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
});

export default apiClient;