import React from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme: Theme) => createStyles({
  buttonLocation: {
    position: 'absolute',
    left: '50%',
    top: '70%',
    transform: 'translate(-50%, -50%)',
  },
  loginButton: {
    position: 'absolute',
    left: '50%',
    top: '70%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#282E4E',
    color: '#F4F3FF',
    width: 500,
    height: 50,
    textTransform: 'none',
    textShadow: '1px 1px 0.5px gray',
    boxShadow: '1px 1px 0.5px gray',
    '&:hover': {
      backgroundColor: '#1c244f',
    },
  },
  loginLogo: {
    position: 'absolute',
    left: '50%',
    top: '40%',
    transform: 'translate(-50%, -50%)',
    height: '400px',
    width: '400px',
    boxShadow: '1.5px 1.5px 1.5px gray',
  },
}));

function LoginPage() {
  const classes = useStyles();

  return (
    <>
      <Avatar
        className={classes.loginLogo}
        alt="Remy Sharp"
        src="http://www.economytalk.kr/news/photo/201909/197343_74419_2755.jpg"
      />
      <Button className={classes.loginButton} variant="contained" href="http://api.pongski.com/auth/login">
        42 Login
      </Button>
    </>
  );
}

export default React.memo(LoginPage);
