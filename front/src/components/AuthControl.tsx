import React, { useEffect } from 'react';
import qs from 'qs';
import { Redirect, useHistory } from 'react-router-dom';
import { Cookies } from 'react-cookie';
import { useDispatch } from 'react-redux';
import { updateLogin } from '../modules/login';

function AuthControl() {
  const history = useHistory();
  const dispatch = useDispatch();
  const query = qs.parse(location.search, { ignoreQueryPrefix: true });

  useEffect(() => {
    const cookie = new Cookies();
    localStorage.setItem('p_auth', String(cookie.get('p_auth')));
    cookie.remove('p_auth');
    dispatch(updateLogin(true));

    if (!localStorage.getItem('p_auth')) {
      alert('인증 정보가 유효하지 않습니다');
      history.push('/');
    }
  }, [history, query, dispatch]);

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
