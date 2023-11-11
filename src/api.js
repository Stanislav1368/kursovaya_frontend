import axios from "axios";
const BASE_URL = "http://localhost:5000"; // Базовый URL API

export async function Login(data) {
  const response = await axios.post(`${BASE_URL}/auth/login`, data);

  const token = response.data.token;
  localStorage.setItem("token", token);
}
export async function Registration(data) {
  await axios.post(`${BASE_URL}/auth/registration`, data);
}
export const fetchUsersByBoard = async (boardId) => {
  const response = await axios.get(`${BASE_URL}/users/byBoardId/${boardId}`);
  return response.data;
};
export async function AddUserInBoard(userId, boardId) {
  await axios.post(`${BASE_URL}/users/${userId}/boards/${boardId}`);
}
export async function AddBoard(data, userId) {
  await axios.post(`${BASE_URL}/users/${userId}/boards`, data);
}

export async function AddState(data, userId, boardId) {
  await axios.post(`${BASE_URL}/users/${userId}/boards/${boardId}/states`, data);
}

export async function AddTask(data, userId, boardId, stateId) {
  await axios.post(`${BASE_URL}/users/${userId}/boards/${boardId}/states/${stateId}/tasks`, data);
}
export async function DeleteTask(userId, boardId, stateId, taskId) {
  await axios.delete(`${BASE_URL}/users/${userId}/boards/${boardId}/states/${stateId}/tasks/${taskId}`);
}
export async function DeleteState(userId, boardId, stateId) {
  await axios.delete(`${BASE_URL}/users/${userId}/boards/${boardId}/states/${stateId}`);
}

export async function DeleteBoard(userId, boardId) {
  await axios.delete(`${BASE_URL}/users/${userId}/boards/${boardId}`);
}

export async function UpdateTask(userId, boardId, stateId, taskId, newState, newOrderNum) {
  await axios.put(`${BASE_URL}/users/${userId}/boards/${boardId}/states/${stateId}/tasks/${taskId}`, { newStateId: newState});
}
export async function UpdateTaskIsCompleted(userId, boardId, stateId, taskId, updatedIsCompleted) {
  console.log(updatedIsCompleted)
  await axios.put(`${BASE_URL}/users/${userId}/boards/${boardId}/states/${stateId}/tasks/${taskId}/isCompleted`, updatedIsCompleted);
}

export async function UpdateTaskTitle(userId, boardId, stateId, taskId, data) {
  console.log(data)
  await axios.put(`${BASE_URL}/users/${userId}/boards/${boardId}/states/${stateId}/tasks/${taskId}`, { newStateId: newState, newOrder: newOrderNum});
}

export async function UpdateBoard(userId, boardId, updatedData) {
  await axios.put(`${BASE_URL}/users/${userId}/boards/${boardId}`, updatedData);
}
export const fetchBoards = async (userId) => {
  const response = await axios.get(`${BASE_URL}/users/${userId}/boards`);
  return response.data;
};

export const fetchBoardById = async (userId, boardId) => {
  const response = await axios.get(`${BASE_URL}/users/${userId}/boards/${boardId}`);
  return response.data;
};

export const fetchStates = async (userId, boardId) => {
  const response = await axios.get(`${BASE_URL}/users/${userId}/boards/${boardId}/states`);

  return response.data;
};

export async function fetchUserId() {
  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };
  const response = await axios.get(`${BASE_URL}/users/currentUser`, {
    headers,
  });

  return response.data.id;
}

export async function fetchUser() {
  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };
  const response = await axios.get(`${BASE_URL}/users/currentUser`, {
    headers,
  });
  return response.data;
}
export const getRoleByBoardId = async (userId, boardId) => {
  const response = await axios.get(`${BASE_URL}/users/${userId}/roleByBoardId/${boardId}`);
  return response.data;
};
export const getCurrentRole = async (userId, boardId) => {
  const response = await axios.get(`${BASE_URL}/users/${userId}/roleOnBoard/${boardId}`);

  return response.data;
};
export const updateRoleByBoardId = async (userId, boardId, updatedData) => {
  const response = await axios.put(`${BASE_URL}/users/${userId}/roleByBoardId/${boardId}`, { newPrivilege: updatedData });
  return response.data;
};

export const getRoles = async (boardId) => {
  const response = await axios.get(`${BASE_URL}/boards/${boardId}/roles`);

  return response.data;
};

export const getRole = async (boardId, roleId) => {
  const response = await axios.get(`${BASE_URL}/boards/${boardId}/roles/${roleId}`);
  return response.data;
};
export async function createRole(data, boardId) {
  await axios.post(`${BASE_URL}/boards/${boardId}/roles`, data);
}
export async function updateRole(userId, boardId, updatedData) {
  await axios.put(`${BASE_URL}/users/${userId}/roleOnBoard/${boardId}`, updatedData);
}
export const getTasks = async (userId, boardId, stateId) => {
  const response = await axios.get(`${BASE_URL}/users/${userId}/boards/${boardId}/states/${stateId}/tasks`);
  return response.data;
};
export const getTask = async (userId, boardId, stateId, taskId) => {
  console.log(userId, boardId, stateId, taskId)
  const response = await axios.get(`${BASE_URL}/users/${userId}/boards/${boardId}/states/${stateId}/tasks/${taskId}`);
  return response.data;
};
export const getPriorities = async (boardId) => {
  const response = await axios.get(`${BASE_URL}/boards/${boardId}/priorities`);

  return response.data;
};
export const getPriority = async (boardId, priorityId) => {
  const response = await axios.get(`${BASE_URL}/boards/${boardId}/priorities/${priorityId}`);
  return response.data;
};
export async function createPriority(data, boardId) {

  await axios.post(`${BASE_URL}/boards/${boardId}/priorities`, data);
}