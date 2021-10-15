/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Dispatch } from 'redux';
import axios from 'axios';
import { io } from 'socket.io-client';
import { updateUser } from '../modules/user';
import { getUserme } from './Requests';
import { loginCheck, loginSuccess } from '../modules/auth';
import { deleteUser } from '../modules/profile';
import { bannedUserHandler, tokenErrorHandler } from './errorHandler';
import { initSocket } from '../modules/socket';
import { logoutSequence } from './logoutSequence';

async function checkToken(dispatch: Dispatch, history: any): Promise<void> {
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
          'Invalid user',
        ];
        if (!error.response) {
          history.push('/server_error');
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
      autoConnect: false,
    });
    socketInstance.connect();

    socketInstance.on('exception', ({ message }) => {
      if (message === 'User is banned') {
        bannedUserHandler(dispatch);
      } else if (message === 'Already Connected User') {
        logoutSequence(dispatch);
        alert('이미 접속한 사용자입니다. 이전 연결을 해제해주세요.');
      }
    });
    dispatch(initSocket(socketInstance));
  } catch (err: any) {
    dispatch(deleteUser());
    if (err.response.status !== 403) {
      localStorage.removeItem('p_auth');
    }
    if (err.response.data.message === 'User Not Found') {
      alert('로그인 정보가 유효하지 않습니다. 다시 로그인 해주세요');
      logoutSequence(dispatch);
      history.push('/');
    }
    dispatch(loginCheck());
  }
}

export default checkToken;
