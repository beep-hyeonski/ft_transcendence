import React, { useEffect } from 'react';
import qs from 'qs';
import { Redirect } from 'react-router-dom';
import { Cookies } from 'react-cookie';
import { io } from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux';
import checkToken from '../utils/checkToken';
import { RootState } from '../modules';
import { initSocket } from '../modules/socket';

function AuthControl() {
  const dispatch = useDispatch();
  const query = qs.parse(location.search, { ignoreQueryPrefix: true });
  const userState = useSelector((state: RootState) => state.userModule);

  useEffect(() => {
    const cookie = new Cookies();
    const token = cookie.get('p_auth');
    localStorage.setItem('p_auth', String(token));
    cookie.remove('p_auth');
    checkToken(dispatch).then(() => {});
    if (userState.isLoggedIn) {
      const socket = io(`${String(process.env.REACT_APP_SOCKET_URL)}`);
      dispatch(initSocket(socket));
    }
  }, [query, userState, dispatch]);

  switch (query.type) {
    case 'success':
      return <Redirect to="/" />;
    case 'signup':
      return <Redirect to="/signup" />;
    case 'twofa':
      return <Redirect to="/twofa" />;
    default:
      return <Redirect to="/notfound" />;
  }
}

export default React.memo(AuthControl);
