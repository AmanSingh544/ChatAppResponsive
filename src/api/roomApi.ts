import { ApiResponse, Room, RoomCreationData, RoomMembers } from '@/types/chat';
import { API_CONSTANTS } from '../constants/apiEndpoints';
import apiClient from './apiClient';

const createRoom = async (roomData: RoomCreationData): Promise<Room> => {
    const response = await apiClient.post<ApiResponse<Room>>(
        API_CONSTANTS.API_ENDPOINTS.CREATE_ROOM, 
        roomData
    );
    return response.data?.data;
};

const getRooms = async (): Promise<Room[]> => {
    const response = await apiClient.get<ApiResponse<Room[]>>(API_CONSTANTS.API_ENDPOINTS.GET_ROOMS, {});
    return response.data?.data;
};

const getRoomById = async (roomId: string): Promise<Room> => {
    const response = await apiClient.get<ApiResponse<Room>>(API_CONSTANTS.API_ENDPOINTS.GET_ROOM_BY_ID(roomId), {});
    return response.data?.data;
}

const joinRoom = async (roomId: string): Promise<Room>=> {
    const response = await apiClient.post<ApiResponse<Room>>(API_CONSTANTS.API_ENDPOINTS.JOIN_ROOM(roomId), {});
    return response.data?.data;
}

const addMembers = async (membersData: RoomMembers): Promise<Room> => {
    const response = await apiClient.put<ApiResponse<Room>>(API_CONSTANTS.API_ENDPOINTS.ADD_MEMBER, {membersData});
    return response.data?.data;
}

const getAvailableRooms = async (): Promise<Room[]> => {
    const response = await apiClient.get<ApiResponse<Room[]>>(API_CONSTANTS.API_ENDPOINTS.AVAILABLE_ROOMS, {});
    return response.data?.data;
}

export const roomsApi = {
    createRoom,
    getRooms,
    getRoomById,
    joinRoom,
    addMembers,
    getAvailableRooms
};
