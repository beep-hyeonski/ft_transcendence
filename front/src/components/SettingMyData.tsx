import React, { useState } from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { Avatar } from '@material-ui/core';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { RootState } from '../modules';
import SettingInputs from './SettingInputs';
import { updateUser } from '../modules/user';
import { logoutSequence } from '../utils/logoutSequence';

const useStyles = makeStyles(() =>
  createStyles({
    title: {
      color: '#282E4E',
      fontSize: '40px',
      margin: '30px 25px',
      letterSpacing: '3px',
      textShadow: '1px 1px 1px gray',
    },
    divStyle: {
      position: 'absolute',
      left: '41%',
      top: '50%',
      transform: 'translate(-50%, -50%)',
      height: '650px',
      width: '1000px',
      backgroundColor: 'white',
      border: '1px solid white',
      borderRadius: '0px 10px 10px 10px',
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
  }),
);

function SettingMyData(): JSX.Element {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();

  const mydata = useSelector((state: RootState) => state.userModule);
  const [image, setImage] = useState(mydata.avatar);

  const changeImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    const file = event.target?.files?.[0];
    const formData = new FormData();

    if (file) {
      formData.set('image', file);
    }
    try {
      const ret = await axios.post(`/images`, formData);
      setImage(ret.data.image);
    } catch (err: any) {
      alert('파일 형식을 지켜주세요');
    }
  };

  const clickSaveButton = async (form: {
    nickname: string;
    twofa: boolean;
  }) => {
    if (
      form.nickname !== '' &&
      (form.nickname.length < 2 ||
        form.nickname === 'me' ||
        form.nickname.length > 10)
    ) {
      alert('닉네임은 2~10글자로 써야합니다.');
      return;
    }
    const inputForm = {
      nickname: form.nickname === '' ? mydata.nickname : form.nickname,
      avatar: image,
      useTwoFA: form.twofa,
    };
    try {
      const ret = await axios.patch(`/users/me`, inputForm);
      dispatch(updateUser(ret.data));
      alert('저장되었습니다.');
    } catch (error: any) {
      if (error.response.data.message === 'User Not Found') {
        alert('로그인 정보가 유효하지 않습니다. 다시 로그인 해주세요');
        logoutSequence(dispatch);
        window.location.href = '/';
      }
      if (error.response.data.message === 'Duplicated Nickname') {
        alert('이미 사용중인 닉네임입니다');
      } else {
        localStorage.removeItem('p_auth');
        alert('인증 정보가 유효하지 않습니다');
        history.push('/');
      }
    }
  };

  return (
    <>
      <div className={classes.title}>Setting</div>
      <Avatar className={classes.profileImage} src={image} />
      <label className={classes.changeLabel} htmlFor="file">
        Change Image
      </label>
      <input
        style={{ display: 'none' }}
        id="file"
        type="file"
        name="profileImage"
        onChange={changeImage}
        accept=".jpg, .jpeg, .png"
      />
      <SettingInputs
        onSubmit={clickSaveButton}
        buttonName="Save"
        nickname={mydata.nickname}
        isTwofa={mydata.useTwoFA}
      />
    </>
  );
}

export default React.memo(SettingMyData);
