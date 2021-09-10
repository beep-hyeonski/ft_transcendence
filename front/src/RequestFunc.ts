import axios from 'axios';

export const getUserme = async () => {
  axios.defaults.headers.common.Authorization = localStorage.getItem('p_auth');
  const response = await axios.get(`${String(process.env.REACT_APP_API_URL)}/users/me`);
  return response;
};

export async function getUsers() {
  axios.defaults.headers.common.Authorization = localStorage.getItem('p_auth');
  const users = await axios.get(`${String(process.env.REACT_APP_API_URL)}/users/`);
  return users.data;
}
