/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React, { useState } from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import InputBase from '@material-ui/core/InputBase';
import Button from '@material-ui/core/Button';
import { Box } from '@material-ui/core';

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      position: 'absolute',
      left: '65%',
      top: '55%',
      transform: 'translate(-50%, -50%)',
      width: '600px',
      height: '400px',
      backgroundColor: 'inherit',
      boxShadow: 'none',
    },
    nickName: {
      border: '2px solid black',
      borderRadius: '10px',
      margin: '80px 20px 10px 30px',
      paddingLeft: '10px',
      backgroundColor: 'white',
      width: '500px',
      height: '60px',
      fontSize: '24px',
      letterSpacing: '1px',
      boxShadow: '1px 1px 1px gray',
    },
    signUpButton: {
      position: 'absolute',
      left: '80%',
      top: '80%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: '#282E4E',
      color: '#F4F3FF',
      width: 170,
      height: 60,
      fontSize: '20px',
      letterSpacing: '2px',
      borderRadius: '8px',
      textTransform: 'none',
      textShadow: '1px 1px 0.5px gray',
      boxShadow: '1px 1px 0.5px gray',
      '&:hover': {
        backgroundColor: '#0F1535',
      },
    },
    twofaButton: {
      paddingLeft: '10px',
      paddingRight: '10px',
      paddingTop: '5px',
      paddingBottom: '5px',
      borderRadius: '8px',
      border: '2px solid black',
      textShadow: '0.5px 0.5px 0.5px lightgray',
      boxShadow: '1px 1px 0.5px gray',
      margin: '40px 0px 0px 31px',
      fontSize: '30px',
    },
  }),
);

interface UserSignUpProps {
  onSubmit: (form: { nickname: string; twofa: boolean }) => void;
  buttonName: string;
  nickname: string;
  isTwofa: boolean;
}

function SignUpInputs({
  onSubmit,
  buttonName,
  nickname,
  isTwofa,
}: UserSignUpProps): JSX.Element {
  const classes = useStyles();

  const [form, setForm] = useState({
    nickname: '',
    twofa: isTwofa,
  });

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const notNum = /[^a-z0-9|ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/gi;
    if (value.search(notNum) !== -1) {
      alert('닉네임에는 특수문자를 사용할 수 없습니다.');
      setForm({
        ...form,
        nickname: value.replace(notNum, ''),
      })
      e.currentTarget.value = value.replace(notNum, '');
    } else {
      setForm({
        ...form,
        [name]: value,
      });
    }
  };

  const checkTwofa = (e: React.ChangeEvent<any>, checked: boolean) => {
    const { name } = e.target;
    setForm({
      ...form,
      [name]: checked,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <Paper className={classes.root}>
      <form onSubmit={handleSubmit}>
        <InputBase
          className={classes.nickName}
          type="text"
          name="nickname"
          placeholder={nickname}
          onChange={onChange}
        />
        <FormControlLabel
          className={classes.twofaButton}
          name="twofa"
          onChange={checkTwofa}
          control={<Checkbox color="primary" checked={form.twofa} />}
          label={
            <Box component="div" fontSize={22}>
              Two Factor Authentication &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;
            </Box>
          }
          labelPlacement="start"
        />
        <Button type="submit" className={classes.signUpButton} variant="text">
          {buttonName}
        </Button>
      </form>
    </Paper>
  );
}

export default React.memo(SignUpInputs);
