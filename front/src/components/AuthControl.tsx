import React from 'react';
import qs from 'qs';
import { Cookies } from 'react-cookie';
import { Redirect } from 'react-router';

interface AuthControlProps {
  location: {
    hash: string;
    pathname: string;
    search: string;
    state: string;
  }
}

const cookies = new Cookies();

export const setCookie = (name: string, value: string, option?: any) => {
  cookies.set(name, value, { ...option });
};

export const getCookie = (name: string) => {
  cookies.get(name);
};

function AuthControl(props: any) {
  // const query = qs.parse(location.search, { ignoreQueryPrefix: true });
  // console.log(query);

  // switch (query.type) {
  //   case 'success':
  //     return <Redirect to="/main" />;
  //   case 'signup':
  //     return <Redirect to="/signup" />;
  //   case 'twofa':
  //     return <Redirect to="/twofa" />;
  //   default:
  //     return <Redirect to="/notfound" />;
  // }

  return <div>test</div>;
}

export default React.memo(AuthControl);
