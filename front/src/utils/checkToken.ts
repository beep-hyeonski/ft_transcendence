import { Dispatch } from 'redux';
import axios from 'axios';
import { loginUser, updateUser } from '../modules/user';
import { getUserme } from './Requests';
import { loginCheck } from '../modules/auth';
import { deleteUser } from '../modules/profile';

async function checkToken(dispatch: Dispatch): Promise<void> {
  const token = localStorage.getItem('p_auth');
  if (!token) {
    dispatch(deleteUser());
    dispatch(loginCheck());
    return;
  }

  try {
    axios.defaults.headers.common.Authorization = `Bearer ${String(token)}`;
    const response = await getUserme();
    dispatch(loginUser());
    dispatch(updateUser(response.data));
    dispatch(loginCheck());
  } catch (e) {
    dispatch(deleteUser());
    localStorage.removeItem('p_auth');
    dispatch(loginCheck());
  }
}

export default checkToken;
