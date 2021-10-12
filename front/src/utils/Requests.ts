import axios from 'axios';

export const getUserme = async (): Promise<any> => {
  const response = await axios.get(`/users/me`);
  return response.data;
};

export async function getUsers(): Promise<any> {
  const users = await axios.get(`/users`);
  return users.data;
}

export async function getUsermeChat(): Promise<any> {
  const response = await axios.get(`/users/me/chat`);
  return response.data;
}

export async function getBlock(): Promise<any> {
  const response = await axios.get(`/block`);
  return response.data;
}

export async function getChats(): Promise<any> {
  const response = await axios.get(`/chat`);
  return response.data;
}

export async function getChatInfo(index: number): Promise<any> {
  const response = await axios.get(`/chat/${index}`);
  return response.data;
}

export async function getBanUsers(): Promise<any> {
  const response = await axios.get(`/users/ban`);
  return response.data;
}
