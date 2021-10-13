import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  large: {
    height: '400px',
    width: '400px',
    margin: '10px',
  },
  small: {
    height: '40px',
    width: '40px',
  },
  medium: {
    height: '200px',
    width: '200px',
  },
});

export interface DrawAvatarProps {
  username: string;
  status: string;
  src: string;
  type: string;
  nickname: string;
}

function DrawAvatar({ username, src, type, nickname }: DrawAvatarProps): JSX.Element {
  const classes = useStyles();

  if (type === 'sideBarImage') {
    return (
      <span className={classes.small}>
        <Avatar
          alt={username}
          src={src}
          component="span"
          className={classes.small}
        >
          {nickname}
        </Avatar>
      </span>
    );
  }
  return (
    <div className={classes.large}>
      <Avatar
        alt={username}
        src={src}
        component="span"
        className={classes.large}
      >
        {nickname}
      </Avatar>
    </div>
  );
}

export default React.memo(DrawAvatar);
