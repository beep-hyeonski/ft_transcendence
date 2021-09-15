/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import React, { useEffect, useState } from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import InputBase from '@material-ui/core/InputBase';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import Paper from '@material-ui/core/Paper';
import { io } from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../modules';
import checkToken from '../utils/checkToken';
import { initSocket } from '../modules/socket';

const useStyles = makeStyles(() => createStyles({
  root: {
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
    textAlign: 'center',
  },
  explain: {
    transform: 'translateY(120px)',
    color: '#282E4E',
    fontSize: '70px',
    letterSpacing: '3px',
    textShadow: '1px 1px 1px gray',
  },
  inputBar: {
    transform: 'translateY(200px)',
    width: '520px',
    height: '70px',
    fontSize: '40px',
    border: '2px solid #282E4E',
    borderRadius: '6px',
    boxShadow: '1px 1px 0.5px gray',
    paddingLeft: '5px',
  },
  submitButton: {
    position: 'absolute',
    top: '70%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#282E4E',
    color: '#F4F3FF',
    width: 200,
    height: 60,
    fontSize: '25px',
    letterSpacing: '2px',
    borderRadius: '8px',
    textTransform: 'none',
    textShadow: '1px 1px 0.5px gray',
    boxShadow: '1px 1px 0.5px gray',
    '&:hover': {
      backgroundColor: '#0F1535',
    },
  },
}));

function EmailVerifyPage() {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  const { isLoggedIn } = useSelector((state: RootState) => state.userModule);

  useEffect(() => {
    if (isLoggedIn || !localStorage.getItem('p_auth')) {
      history.push('/');
    }
  }, [isLoggedIn, history]);

  const [form, setForm] = useState({
    verifyCode: '',
  });

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const twofaForm = {
      TwoFAToken: form.verifyCode,
    };
    try {
      const ret = await axios.post(`${String(process.env.REACT_APP_API_URL)}/auth/twofa`, twofaForm);
      localStorage.setItem('p_auth', String(ret.data.jwt));
      checkToken(dispatch);
      if (isLoggedIn) {
        const socket = io(`${String(process.env.REACT_APP_SOCKET_URL)}`);
        dispatch(initSocket(socket));
      }
      history.push('/');
    } catch (error) {
      alert('코드를 다시 확인해주세요.');
    }
  };

  return (
    <Paper className={classes.root}>
      <form onSubmit={handleSubmit}>
        <div className={classes.explain}>
          Please check your email.
        </div>
        <InputBase
          className={classes.inputBar}
          placeholder="Enter your verification code."
          type="text"
          name="verifyCode"
          onChange={onChange}
        />
        <Button type="submit" className={classes.submitButton}>
          Submit
        </Button>
      </form>
    </Paper>
  );
}

export default React.memo(EmailVerifyPage);
