import React from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { Avatar } from '@material-ui/core';
import JoinedUserMenu from './JoinedUserMenu';

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
    menuIconLocation: {
      width: '1rem',
      height: '1rem',
      position: 'absolute',
      marginTop: '1.8rem',
      marginLeft: '19.2rem',
    },
    menuIcon: {
      fontSize: '2rem',
      color: 'black',
    },
  }),
);

interface UserdataProps {
  avatar: string;
  index: number;
  nickname: string;
  username: string;
  status: string;
}

interface UserData {
  user: UserdataProps;
  isInRoom: boolean;
  isOwner: boolean;
  isManager: boolean;
}

const ChatJoinedUser = ({
  user,
  isInRoom,
  isOwner,
  isManager,
}: UserData): JSX.Element => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Avatar className={classes.image} src={user.avatar} />
      <div className={classes.username}>{user.nickname}</div>
      {isInRoom ? (
        <JoinedUserMenu
          key={user.index}
          user={user}
          isOwner={isOwner}
          isManager={isManager}
        />
      ) : null}
    </div>
  );
};

export default React.memo(ChatJoinedUser);
