import React from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import { WbSunnyRounded } from '@material-ui/icons';
import ListItemText from '@material-ui/core/ListItemText';
import DrawAvatar from './Avatar';

const useStyles = makeStyles(() => createStyles({
  usernameMargin: {
    marginLeft: '10px',
  },
}));

interface UserdataProps {
  user : {
    nickname: string,
    avatar: string,
    status: string,
  }
}

function LobyUserList({ user } : UserdataProps): JSX.Element {
  const classes = useStyles();

  if (user.status === 'offline') return <></>;

  return (
    <ListItem button key={user.nickname}>
      <DrawAvatar
        type="sideBarImage"
        username={user.nickname}
        src={user.avatar}
        status={user.status}
      />
      <ListItemText primary={user.nickname} className={classes.usernameMargin} />
      <WbSunnyRounded style={{ color: '#FFFA66' }} />
    </ListItem>
  );
}

export default React.memo(LobyUserList);
