import axios from 'axios';

export const getUserme = async () => {
  const response = await axios.get(`${String(process.env.REACT_APP_API_URL)}/users/me`);
  return response;
};

export async function getUsers() {
  const users = await axios.get(`${String(process.env.REACT_APP_API_URL)}/users`);
  return users.data;
}
