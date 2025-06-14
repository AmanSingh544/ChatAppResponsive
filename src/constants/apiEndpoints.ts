const API_BASE_URL = 'http://localhost:3000/';
//const API_BASE_URL = 'https://chat-application-l78n.onrender.com/'; 

const API_ENDPOINTS = {
  LOGIN: `api/auth/login`,
  REGISTER: `api/auth/signup`,
  LOGOUT: `api/auth/logout`,

  GET_ALL_USERS: `api/user/alluser`,
  CREATE_ROOM: `api/user/room/create`,
  GET_ROOMS: `api/user/room/list`,
  GET_ROOM_BY_ID: (roomId) =>  `api/user/room/${roomId}`,
  JOIN_ROOM: (roomId) => `api/user/room/join/${roomId}`,
  ADD_MEMBER: `api/user/room/add_member`,
  AVAILABLE_ROOMS: `api/user/room/available_room`,
  
  UPLOAD_IMAGE: `api/user/upload-image`,
  GET_USERS: `api/user/get-users`,
  GET_USER_BY_ID: (userId) => `api/user/${userId}`,
};

export const API_CONSTANTS = {
  API_BASE_URL,
  API_ENDPOINTS,
};