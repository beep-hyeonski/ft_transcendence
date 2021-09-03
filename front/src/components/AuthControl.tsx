/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
import React from 'react';
import qs from 'qs';
import { Redirect } from 'react-router-dom';
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

const cookies = new Cookies();

export const setCookie = (key: string, value: string) => {
  cookies.set(key, value, { path: '/' });
};

export function getCookie(key: string) {
  return String(cookies.get(key));
}

const getMyInfo = async () => {
  axios.defaults.headers.common.Authorization = getCookie('p_auth');
  const response = await axios.get(`${String(process.env.REACT_APP_API_URL)}/users/me`);
  return response;
};

function AuthControl({ location }: AuthControlProps) {
  const dispatch = useDispatch();
  const query = qs.parse(location.search, { ignoreQueryPrefix: true });

  const updateme = () => {
    getMyInfo().then((res) => {
      dispatch(updateData(res.data));
    });
  };

  if (query.token) {
    axios.defaults.headers.common.Authorization = query.token;
    setCookie('p_auth', String(query.token));
  }

  switch (query.type) {
    case 'success':
      updateme();
      return <Redirect to="/main" />;
    case 'signup':
      return <Redirect to="/signup" />;
    case 'twofa':
      return <Redirect to="/twofa" />;
    default:
      return <Redirect to="/notfound" />;
  }

  return <div>test</div>;
}

export default React.memo(AuthControl);
