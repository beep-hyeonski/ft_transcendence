import { Dispatch } from 'redux';
import axios from 'axios';
import { io } from 'socket.io-client';
import { updateUser } from '../modules/user';
import { getUserme } from './Requests';
import { loginCheck, loginSuccess, logout } from '../modules/auth';
import { deleteUser } from '../modules/profile';
import { bannedUserHandler, tokenErrorHandler } from './errorHandler';
import { initSocket } from '../modules/socket';
import { deleteSideData } from '../modules/sidebar';

async function checkToken(dispatch: Dispatch): Promise<void> {
  const token = localStorage.getItem('p_auth');
  if (!token) {
    dispatch(deleteUser());
    dispatch(loginCheck());
    return;
  }

  try {
    axios.defaults.baseURL = `${String(process.env.REACT_APP_API_URL)}`;
    axios.defaults.headers.common.Authorization = `Bearer ${String(token)}`;
    axios.interceptors.response.use(
      (response) => response,
      (error) => {
        const unauthMessages = [
          'Token is not arrived',
          'Token Expired',
          'invalid token',
        ];
        if (!error.response) {
          window.location.href = '/server_error';
        }
        if (error.response.data.message === 'User is banned') {
          bannedUserHandler(dispatch);
        } else if (error.response.status === 401) {
          tokenErrorHandler(dispatch);
        } else if (unauthMessages.includes(error.response.data.message)) {
          tokenErrorHandler(dispatch);
        }
        return Promise.reject(error);
      },
    );
    const response = await getUserme();
    dispatch(loginSuccess(token));
    dispatch(updateUser(response));

    dispatch(loginCheck());

    const socketInstance = io(`${String(process.env.REACT_APP_SOCKET_URL)}`, {
      extraHeaders: { Authorization: `${String(token)}` },
    });
    if (!socketInstance) console.log('socket connection error');

    socketInstance?.on('exception', ({ message }) => {
      if (message === 'User is banned') {
        bannedUserHandler(dispatch);
      }
    });
    dispatch(initSocket(socketInstance));
  } catch (err: any) {
    dispatch(deleteUser());
    if (err?.response?.status !== 403) {
      localStorage.removeItem('p_auth');
    }
    if (err.response.data.message === 'User Not Found') {
      alert('로그인 정보가 유효하지 않습니다. 다시 로그인 해주세요');
      localStorage.removeItem('p_auth');
      dispatch(logout());
      dispatch(deleteUser());
      dispatch(deleteSideData());
      window.location.href = '/';
    }
    dispatch(loginCheck());
  }
}

export default checkToken;
