import React, { useEffect } from 'react';
import qs from 'qs';
import { Redirect } from 'react-router-dom';
import { Cookies } from 'react-cookie';
import { useDispatch } from 'react-redux';
import checkToken from '../utils/checkToken';

function AuthControl() {
  const dispatch = useDispatch();
  const query = qs.parse(location.search, { ignoreQueryPrefix: true });

  useEffect(() => {
    const cookie = new Cookies();
    const token = cookie.get('p_auth');
    localStorage.setItem('p_auth', String(token));
    cookie.remove('p_auth');
    checkToken(dispatch).then(() => {});
  }, [query, dispatch]);

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
