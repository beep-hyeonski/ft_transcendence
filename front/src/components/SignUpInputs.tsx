import React, { useState } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme: Theme) => createStyles({
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
    paddingLeft: '5px',
    backgroundColor: 'white',
    width: '500px',
    height: '60px',
    fontSize: '24px',
    letterSpacing: '1px',
    boxShadow: '1px 1px 1px gray',
  },
  email: {
    border: '2px solid black',
    borderRadius: '10px',
    margin: '40px 20px 0px 30px',
    paddingLeft: '5px',
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
}));

interface UserSignUpProps {
  onSubmit: (form: { nickname: string; email: string; }) => void;
  buttonName: string;
}

function SignUpInputs({ onSubmit, buttonName } : UserSignUpProps) {
  const classes = useStyles();

  const [form, setForm] = useState({
    nickname: '',
    email: '',
  });

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
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
          placeholder="Nickname"
          type="text"
          name="nickname"
          onChange={onChange}
        />
        <InputBase
          className={classes.email}
          placeholder="Email"
          type="text"
          name="email"
          onChange={onChange}
        />
        <Button type="submit" className={classes.signUpButton} variant="text">
          {buttonName}
        </Button>
      </form>
    </Paper>
  );
}

export default React.memo(SignUpInputs);
