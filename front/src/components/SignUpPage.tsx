/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/no-unknown-property */
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import Avatar from '@material-ui/core/Avatar';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import SignUpInputs from './SignUpInputs';
import { RootState } from '../modules';
import checkToken from '../utils/checkToken';
import { initSocket } from '../modules/socket';

const useStyles = makeStyles(() => createStyles({
  title: {
    color: '#282E4E',
    fontSize: '40px',
    margin: '30px 25px',
    letterSpacing: '3px',
    textShadow: '1px 1px 1px gray',
  },
  divStyle: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    height: '650px',
    width: '1000px',
    backgroundColor: 'white',
    border: '1px solid white',
    borderRadius: '10px',
    boxShadow: '3.5px 3.5px 3px gray',
  },
  profileImage: {
    position: 'absolute',
    left: '20%',
    top: '45%',
    transform: 'translate(-50%, -50%)',
    width: '275px',
    height: '275px',
    boxShadow: '1px 1px 1.5px lightgray',
  },
  changeLabel: {
    position: 'absolute',
    left: '20%',
    top: '75%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#F4F3FF',
    color: '#282E4E',
    width: 150,
    height: 50,
    textTransform: 'none',
    textShadow: '0.5px 0.5px 0.5px gray',
    boxShadow: '1px 1px 1px gray',
    '&:hover': {
      backgroundColor: '#e3e0ff',
    },
    textAlign: 'center',
    lineHeight: '48px',
    borderRadius: '4px',
    fontSize: '15px',
  },
}));

function SignUpPage() {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  const { isLoggedIn } = useSelector((state: RootState) => state.authModule);
  const authState = useSelector((state: RootState) => state.authModule);

  useEffect(() => {
    if (!localStorage.getItem('p_auth') || isLoggedIn) {
      history.push('/');
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history]);

  // https://cdn.topstarnews.net/news/photo/201810/494999_155091_4219.jpg
  const [image, setImage] = useState('https://cdn.topstarnews.net/news/photo/201810/494999_155091_4219.jpg');

  const clickSignUpButton = async (form: { nickname: string; email: string; }) => {
    const token = localStorage.getItem('p_auth');
    if (!token) {
      alert('인증 정보가 유효하지 않습니다.');
      return;
    }
    if (form.nickname.length < 2 || form.nickname.length > 10) {
      alert('닉네임은 2~10글자로 써야합니다.');
      return;
    } if (form.nickname === 'me') {
      alert('사용할 수 없는 닉네임입니다.');
      return;
    }

    const signupForm = {
      nickname: form.nickname,
      email: form.email,
      avatar: image,
    };
    try {
      const data = await axios.post(`${String(process.env.REACT_APP_API_URL)}/auth/signup`, signupForm);
      localStorage.setItem('p_auth', String(data.data.jwt));
      checkToken(dispatch);
      if (isLoggedIn) {
        const socket = io(`${String(process.env.REACT_APP_SOCKET_URL)}`, {
          extraHeaders: {
            Authorization: `${String(authState.token)}`,
          },
        });
        dispatch(initSocket(socket));
      }
      history.push('/');
    } catch (error: any) {
      console.log(error.response);
      if (error.response.data.message === 'Duplicated Nickname') {
        alert('이미 사용중인 닉네임입니다');
      } else if (error.response.data.message[0] === 'email must be an email') {
        alert('이메일을 확인해주세요');
      } else {
        alert('오류가 발생했습니다, 다시 시도해주세요');
      }
    }
  };

  const changeImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    const token = localStorage.getItem('p_auth');
    if (!token) {
      alert('인증 정보가 유효하지 않습니다.');
      return;
    }

    const file = event.target?.files?.[0];
    const formData = new FormData();

    if (file) {
      formData.set('image', file);
    }
    const ret = await axios.post(`${String(process.env.REACT_APP_API_URL)}/images`, formData);
    setImage(ret.data.image);
  };

  // style={{ display: 'none' }}
  // jpg, jpeg, png, gif

  return (
    <div className={classes.divStyle}>
      <div className={classes.title}>
        Sign Up
      </div>
      <Avatar
        className={classes.profileImage}
        src={image}
      />
      <label className={classes.changeLabel} htmlFor="file">
        Change Image
      </label>
      <input style={{ display: 'none' }} id="file" type="file" name="profileImage" onChange={changeImage} accept=".jpg, .jpeg, .png, .gif" />
      <SignUpInputs onSubmit={clickSignUpButton} buttonName="Sign Up" />
    </div>
  );
}

export default React.memo(SignUpPage);
