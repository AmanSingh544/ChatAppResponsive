import axios from 'axios';
import { API_CONSTANTS } from '../constants/apiEndpoints';

const API_BASE_URL = API_CONSTANTS.API_BASE_URL;

const API = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const authApi = {
    login: async (credentials) => {
        try {
            const response = await API.post(API_CONSTANTS.API_ENDPOINTS.LOGIN, credentials);
            return response.data;
        }
        catch(error) {
            throw error.response ? error.response.data : error;
        }
    },

    register: async (userData) => {
        try {
            console.log(userData)
            const response = await API.post(API_CONSTANTS.API_ENDPOINTS.REGISTER, userData);
            return response.data;
        }
        catch (error) {
            throw error.response ? error.response.data : error;
        }
    },

    logout: async () => {
        try {
            const response = await API.post(API_CONSTANTS.API_ENDPOINTS.LOGOUT);
            return response.data;
        }
        catch (error) {
            throw error.response ? error.response.data : error;
        }
    },
};  