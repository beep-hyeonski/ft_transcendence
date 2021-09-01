/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/no-unknown-property */
import React, { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import qs from 'qs';
import Avatar from '@material-ui/core/Avatar';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import SignUpInputs from './SignUpInputs';

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

interface UserSignUpProps {
  clickSignUpButton: (form: { nickname: string; email: string; }) => void
}

function SignUpPage() {
  const classes = useStyles();
  const history = useHistory();

  const coo = qs.parse(document.cookie, { ignoreQueryPrefix: true });

  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  axios.defaults.headers.common.Authorization = `Bearer ${String(coo.p_auth)}`;

  // https://cdn.topstarnews.net/news/photo/201810/494999_155091_4219.jpg
  const [image, setImage] = useState('https://cdn.topstarnews.net/news/photo/201810/494999_155091_4219.jpg');

  const clickSignUpButton = async (form: { nickname: string; email: string; }) => {
    const signupForm = {
      nickname: form.nickname,
      email: form.email,
      avatar: image,
    };
    try {
      const data = await axios.post(`${String(process.env.REACT_APP_API_URL)}/auth/signup`, signupForm);
      history.push('/auth?type=success');
    } catch (error) {
      alert('이미 사용중인 닉네임입니다');
    }
  };

  const changeImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    const file = event.target?.files?.[0];
    const formData = new FormData();

    if (file) {
      formData.set('image', file);
    }
    const ret = await axios.post(`${String(process.env.REACT_APP_API_URL)}/images`, formData);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
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
