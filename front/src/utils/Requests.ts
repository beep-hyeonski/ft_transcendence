import axios from 'axios';

export const getUserme = async (): Promise<any> => {
  const response = await axios.get(
    `${String(process.env.REACT_APP_API_URL)}/users/me`,
  );
  return response.data;
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

export async function getDM(name: string): Promise<any> {
  const response = await axios.get(
    `${String(process.env.REACT_APP_API_URL)}/dm/${name}`,
  );
  return response.data;
}

export async function getChatInfo(index: number) {
  const response = await axios.get(
    `${String(process.env.REACT_APP_API_URL)}/chat/${index}`,
  );
  return response.data;
}

export async function getBanUsers() {
  const response = await axios.get(
    `${String(process.env.REACT_APP_API_URL)}/users/ban`,
  );
  return response.data;
}
