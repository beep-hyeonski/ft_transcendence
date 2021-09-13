import React from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { updateMyData } from './modules/userme';
import { getUserme } from './RequestFunc';
import { updateLogin } from './modules/login';

function CheckToken() {
  const history = useHistory();
  const dispatch = useDispatch();
  if (!localStorage.getItem('p_auth') && location.pathname === '/') {
    return;
  }
  console.log('test');
  getUserme().then((res) => {
    dispatch(updateMyData(res.data));
  }).catch((err) => {
    console.log(err);
    dispatch(updateLogin(false));
    localStorage.removeItem('p_auth');
    alert('인증 정보가 유효하지 않습니다');
    history.push('/');
  });
}

export default CheckToken;
