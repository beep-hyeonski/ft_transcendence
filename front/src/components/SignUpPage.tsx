import React from 'react';
import axios from 'axios';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
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
  changeButton: {
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
  },
}));

interface UserSignUpProps {
  clickSignUpButton: (form: { nickname: string; email: string; }) => void
}

function SignUpPage() {
  const classes = useStyles();

  const clickSignUpButton = (form: { nickname: string; email: string; }) => {
    const signupForm = {
      nickname: 'skiZzang',
      email: 'hyeonski@student.42seoul.kr',
      avatar: 'http://cdn.intra.42.fr/users/hyeonski.jpg',
    };
    const data = axios.post('http://api.pongski.com/auth/signup', signupForm);
    console.log(data);
  };

  const clickChangeImageButton = (e: React.MouseEvent<HTMLButtonElement>) => {
    console.log('clickChangeButton');
  };

  return (
    <div className={classes.divStyle}>
      <div className={classes.title}>
        Sign Up
      </div>
      <Avatar
        className={classes.profileImage}
        alt="Remy Sharp"
        src="https://i.pinimg.com/736x/8d/47/d2/8d47d2a8b2220c562508b7bda34bb2fb.jpg"
      />
      <Button className={classes.changeButton} variant="text" onClick={clickChangeImageButton}>
        Change Image
      </Button>
      <SignUpInputs onSubmit={clickSignUpButton} buttonName="Sign Up" />
    </div>
  );
}

export default React.memo(SignUpPage);
