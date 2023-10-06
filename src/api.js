import axios from "axios";
const BASE_URL = "http://localhost:5000"; // Базовый URL API

export async function Login(data) {
  const response = await axios.post(`${BASE_URL}/auth/login`, data);
  console.log(data);
  console.log(response.data);
  const token = response.data.token;
  localStorage.setItem("token", token);
}
export async function Registration(data) {
  await axios.post(`${BASE_URL}/auth/registration`, data);
}
export const fetchUsersByBoard = async(boardId) => {
  const response = await axios.get(
    `${BASE_URL}/users/byBoardId/${boardId}`
  );
  return response.data;
}
export async function AddUserInBoard(userId, boardId) {
  console.log(boardId)
  await axios.post(`${BASE_URL}/users/${userId}/boards/${boardId}`);
}
export async function AddBoard(data, userId) {
  await axios.post(`${BASE_URL}/users/${userId}/boards`, data);
}

export async function AddState(data, userId, boardId) {
  await axios.post(`${BASE_URL}/users/${userId}/boards/${boardId}/states`, data);
}

export async function AddTask(data, userId, boardId, stateId) {
  console.log(data);
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


export async function UpdateTask(userId, boardId, stateId, taskId, updatedData) {
  console.log(stateId, taskId, updatedData);
  await axios.put(`${BASE_URL}/users/${userId}/boards/${boardId}/states/${stateId}/tasks/${taskId}`, {newStateId: updatedData});
}

export const fetchBoards = async(userId) => {
  const response = await axios.get(
    `${BASE_URL}/users/${userId}/boards`
  );
  return response.data;
}

export const fetchBoardById = async(userId, boardId) => {
  const response = await axios.get(
    `${BASE_URL}/users/${userId}/boards/${boardId}`
  );
  return response.data;
}

export const fetchStates = async(userId, boardId) => {
  const response = await axios.get(
    `${BASE_URL}/users/${userId}/boards/${boardId}/states`
  );
  return response.data;
}

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
export const getRoleByBoardId = async(userId, boardId) => {
  const response = await axios.get(
    `${BASE_URL}/users/${userId}/getRoleByBoardId/${boardId}`
  );
  return response.data;
}