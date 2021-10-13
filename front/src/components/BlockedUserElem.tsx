import React from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import { Avatar, Button } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import { updateUser } from '../modules/user';

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      width: '22rem',
      height: '5rem',
      margin: '1rem',
      display: 'flex',
      border: '1px solid black',
      borderRadius: '1rem',
      boxShadow: '1px 1px 1px gray',
      backgroundColor: '#3f446e',
      color: '#F4F3FF',
    },
    image: {
      width: '4rem',
      height: '4rem',
      marginTop: '0.5rem',
      marginLeft: '0.5rem',
      boxShadow: '1px 1px 1.5px gray',
    },
    username: {
      fontSize: '2rem',
      marginTop: '18px',
      marginLeft: '1rem',
      textShadow: '1px 1px 1px white',
    },
    unblockedButton: {
      position: 'absolute',
      marginTop: '2.6rem',
      marginLeft: '19rem',
      fontSize: '1rem',
      fontStyle: 'border',
      transform: 'translate(-50%, -50%)',
      boxShadow: '1px 1px 1px gray',
      borderRadius: '6px',
      backgroundColor: '#CE6F84',
      '&:hover': {
        backgroundColor: '#cc6b80',
      },
    },
  }),
);

interface UserdataProps {
  avatar: string;
  index: number;
  nickname: string;
  status: string;
  username: string;
}

interface UserData {
  user: UserdataProps;
}

const BlockedUserElem = ({ user }: UserData): JSX.Element => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const UnBlockButton = async () => {
    try {
      const res = await axios.delete(`/block`, {
        data: { blockedUser: user.username },
      });
      dispatch(updateUser(res.data));
    } catch (err: any) {
      if (err.response.data.message === 'Not Found') {
        window.location.reload();
      }
    }
  };

  return (
    <div className={classes.root}>
      <Avatar className={classes.image} src={user.avatar} />
      <div className={classes.username}>{user.nickname}</div>
      <Button className={classes.unblockedButton} onClick={UnBlockButton}>
        차단 해제
      </Button>
    </div>
  );
};

export default React.memo(BlockedUserElem);
