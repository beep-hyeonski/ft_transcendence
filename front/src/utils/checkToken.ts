import { Dispatch } from 'redux';
import axios from 'axios';
import { updateUser } from '../modules/user';
import { getUserme } from './Requests';
import { loginCheck, loginSuccess } from '../modules/auth';
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
    dispatch(loginSuccess(token));
    dispatch(updateUser(response));

    dispatch(loginCheck());
  } catch (err: any) {
    dispatch(deleteUser());
    if (err?.response?.status !== 403) {
      localStorage.removeItem('p_auth');
    }
    // 서버 꺼져있을 경우 에러 핸들링 필요

    dispatch(loginCheck());
  }
}

export default checkToken;
