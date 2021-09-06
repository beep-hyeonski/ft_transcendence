/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
import React, { useEffect } from 'react';
import qs from 'qs';
import { Redirect, useHistory } from 'react-router-dom';
import { Cookies } from 'react-cookie';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { updateData } from '../modules/userme';

interface AuthControlProps {
  location: {
    hash: string;
    pathname: string;
    search: string;
    state: string;
  }
}

const getMyInfo = async () => {
  axios.defaults.headers.common.Authorization = localStorage.getItem('p_auth');
  const response = await axios.get(`${String(process.env.REACT_APP_API_URL)}/users/me`);
  return response;
};

function AuthControl({ location }: AuthControlProps) {
  const dispatch = useDispatch();
  const history = useHistory();
  const query = qs.parse(location.search, { ignoreQueryPrefix: true });

  useEffect(() => {
    const cookie = new Cookies();
    localStorage.setItem('p_auth', String(cookie.get('p_auth')));
    cookie.remove('p_auth');

    if (!localStorage.getItem('p_auth')) {
      alert('인증 정보가 유효하지 않습니다');
      history.push('/');
    }

    if (query.type === 'success') {
      getMyInfo().then((res) => {
        dispatch(updateData(res.data));
      }).catch((err) => {
        console.log(err);
      });
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
