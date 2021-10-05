import axios, { AxiosResponse } from 'axios';

export const getUserme = async (): Promise<AxiosResponse<any>> => {
  const response = await axios.get(
    `${String(process.env.REACT_APP_API_URL)}/users/me`,
  );
  return response;
};

export async function getUsers(): Promise<any> {
  const users = await axios.get(
    `${String(process.env.REACT_APP_API_URL)}/users`,
  );
  return users.data;
}

export async function getUsermeChat(): Promise<any> {
  const response = await axios.get(
    `${String(process.env.REACT_APP_API_URL)}/users/me/chat`,
  );
  return response.data;
}

export async function getBlock(): Promise<any> {
  const response = await axios.get(
    `${String(process.env.REACT_APP_API_URL)}/block`,
  );
  return response.data;
}

export async function getChats(): Promise<any> {
  const response = await axios.get(
    `${String(process.env.REACT_APP_API_URL)}/chat`,
  );
  return response.data;
}
