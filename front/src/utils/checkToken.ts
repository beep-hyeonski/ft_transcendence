import { Dispatch } from 'redux';
import axios from 'axios';
import { io } from 'socket.io-client';
import { updateUser } from '../modules/user';
import { getUserme } from './Requests';
import { loginCheck, loginSuccess } from '../modules/auth';
import { deleteUser } from '../modules/profile';
import { bannedUserHandler, tokenErrorHandler } from './errorHandler';
import { initSocket } from '../modules/socket';

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
    socketInstance?.on('exception', ({ message }) => {
      console.log(message);
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
    // 서버 꺼져있을 경우 에러 핸들링 필요
    dispatch(loginCheck());
  }
}

export default checkToken;
