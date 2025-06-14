import { ApiResponse, User } from "@/types/chat";
import { API_CONSTANTS } from "../constants/apiEndpoints"
import apiClient from "./apiClient";

const getAllUsers = async () : Promise<User[]> => {
    const response = await apiClient.get<ApiResponse<User[]>>(API_CONSTANTS.API_ENDPOINTS.GET_ALL_USERS, {});
    return response.data?.data;
}

export const userApi = {
    getAllUsers,
}