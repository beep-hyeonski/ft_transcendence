import React from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { Avatar } from '@material-ui/core';
import AdminJoinUserMenu from './AdminJoinUserMenu';

const useStyles = makeStyles(() => createStyles({
  root: {
    width: '90%',
		height: '100%',
		padding: '3px',
    margin: '1rem',
    display: 'flex',
    border: '1px solid black',
    borderRadius: '1rem',
    boxShadow: '1px 1px 1px gray',
  },
  image: {
    width: '4rem',
    height: '4rem',
		margin: '1%',
    boxShadow: '1px 1px 1.5px gray',
  },
  username: {
    fontSize: '2rem',
		marginTop: '5%',
		marginLeft: '2%',
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

const AdminChannelJoinUserElem = ({ user } : UserData) : JSX.Element => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Avatar className={classes.image} src={user.avatar} />
      <div className={classes.username}>
        {user.nickname}
      </div>
			<AdminJoinUserMenu user={user} />
    </div>
  );
};

export default React.memo(AdminChannelJoinUserElem);
