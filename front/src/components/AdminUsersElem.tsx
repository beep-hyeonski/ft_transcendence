import React from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { Avatar } from '@material-ui/core';
import { useSelector } from 'react-redux';
import AdminUserMenu from './AdminUserMenu';
import { RootState } from '../modules';

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
  user: UserdataProps;
  setUsers: React.Dispatch<React.SetStateAction<UserdataProps[]>>;
  banUsers: UserdataProps[];
  setBanUsers: React.Dispatch<React.SetStateAction<UserdataProps[]>>;
}

const AdminUsersElem = ({
  user,
  setUsers,
  banUsers,
  setBanUsers,
}: UserData): JSX.Element => {
  const classes = useStyles();
  const mydata = useSelector((state: RootState) => state.userModule);

  if (banUsers.find((banned: any) => banned.username === user.username)) {
    return <></>;
  }

  if (mydata.username === user.username) {
    return <></>;
  }

  return (
    <div className={classes.root}>
      <Avatar className={classes.image} src={user.avatar} />
      <div className={classes.username}>{user.nickname}</div>
      {user.role !== 'owner' && <AdminUserMenu
        user={user}
        setUsers={setUsers}
        setBanUsers={setBanUsers}
      />}
    </div>
  );
};

export default React.memo(AdminUsersElem);
