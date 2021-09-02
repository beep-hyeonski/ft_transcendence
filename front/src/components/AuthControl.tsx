import React from 'react';
import qs from 'qs';
import { Redirect } from 'react-router-dom';
import { Cookies } from 'react-cookie';
import axios from 'axios';

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

function AuthControl({ location }: AuthControlProps) {
  const query = qs.parse(location.search, { ignoreQueryPrefix: true });

  if (query.token) {
    alert(query.token);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    axios.defaults.headers.common.Authorization = query.token;
    setCookie('p_auth', String(query.token));
  }

  switch (query.type) {
    case 'success':
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
