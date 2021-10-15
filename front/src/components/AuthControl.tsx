import React, { useEffect } from 'react';
import qs from 'qs';
import { Redirect } from 'react-router-dom';
import { useHistory } from 'react-router';
import { Cookies } from 'react-cookie';
import { useDispatch } from 'react-redux';
import checkToken from '../utils/checkToken';

function AuthControl(): JSX.Element {
  const dispatch = useDispatch();
  const query = qs.parse(location.search, { ignoreQueryPrefix: true });
  const history = useHistory();

  useEffect(() => {
    const cookie = new Cookies();
    if (query.type === 'banned') {
      alert('접근 권한이 유효하지 않습니다. 다시 로그인 해주세요');
      cookie.remove('p_auth');
      localStorage.removeItem('p_auth');
      history.push('/');
    }
    const token = cookie.get('p_auth');
    localStorage.setItem('p_auth', String(token));
    cookie.remove('p_auth');
    checkToken(dispatch, history);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  switch (query.type) {
    case 'success':
      return <Redirect to="/" />;
    case 'signup':
      return <Redirect to="/signup" />;
    case 'twofa':
      return <Redirect to="/twofa" />;
    default:
      return <Redirect to="/server_error" />;
  }
}

export default React.memo(AuthControl);
