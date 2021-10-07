import React from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { Avatar } from '@material-ui/core';
import AdminUserMenu from './AdminUserMenu';

const useStyles = makeStyles(() => createStyles({
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
}));

interface UserdataProps {
  avatar: string,
  index: number,
  nickname: string,
  status: string,
}

interface UserData {
  user: UserdataProps
}

const AdminUsersElem = ({ user } : UserData) : JSX.Element => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Avatar className={classes.image} src={user.avatar} />
      <div className={classes.username}>
        {user.nickname}
      </div>
      <AdminUserMenu user={user} />
    </div>
  );
};

export default React.memo(AdminUsersElem);
