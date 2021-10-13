import React from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import { Avatar, Button } from '@material-ui/core';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { RootState } from '../modules';
import { getBanUsers } from '../utils/Requests';

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      width: '30%',
      height: '5rem',
      margin: '1rem',
      display: 'flex',
      border: '1px solid black',
      borderRadius: '1rem',
      boxShadow: '1px 1px 1px gray',
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
      textShadow: '0.5px 0.5px 1px gray',
    },
    unblockedButton: {
      position: 'absolute',
      marginTop: '2.6rem',
      marginLeft: '16.5rem',
      fontSize: '1rem',
      fontStyle: 'border',
      transform: 'translate(-50%, -50%)',
      borderRadius: '6px',
      boxShadow: '1px 1px 1px gray',
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
  username: string;
  status: string;
  role: string;
}

interface UserData {
  banUser: UserdataProps;
  setBanUsers: React.Dispatch<React.SetStateAction<UserdataProps[]>>;
}

const AdminBannedUserElem = ({
  banUser,
  setBanUsers,
}: UserData): JSX.Element => {
  const classes = useStyles();
  const mydata = useSelector((state: RootState) => state.userModule);
  const history = useHistory();

  if (mydata.username === banUser.username) {
    return <></>;
  }

  const UnBlockButton = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      await axios.delete(`/users/ban/${banUser.username}`);
      const newBanUsers = await getBanUsers();
      setBanUsers(newBanUsers);
    } catch (err: any) {
      if (err.response.data.message === 'You are not admin') {
        alert('권한이 없습니다.');
        history.push('/');
      }
      if (err.response.data.message === 'User Not Found') {
        window.location.reload();
      }
    }
  };

  return (
    <div className={classes.root}>
      <Avatar className={classes.image} src={banUser.avatar} />
      <div className={classes.username}>{banUser.nickname}</div>
      <Button className={classes.unblockedButton} onClick={UnBlockButton}>
        차단 해제
      </Button>
    </div>
  );
};

export default React.memo(AdminBannedUserElem);
