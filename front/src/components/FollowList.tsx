/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import React from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { useHistory } from 'react-router-dom';
import { WbSunnyRounded, NightsStayRounded, AdbRounded } from '@material-ui/icons';
import DrawAvatar from './Avatar';

const useStyles = makeStyles(() => createStyles({
  usernameMargin: {
    marginLeft: '10px',
  },
}));

interface StatusIconProps {
  status: string
}

function StatusIcon({ status }: StatusIconProps): JSX.Element {
  if (status === 'offline') {
    return (
      <NightsStayRounded style={{ color: '#666666' }} />
    );
  }
  if (status === 'ingame') {
    return (
      <AdbRounded style={{ color: '#DAADFF' }} />
    );
  }
  return (
    <WbSunnyRounded style={{ color: '#FFFA66' }} />
  );
}

interface UserdataProps {
  user : {
    nickname: string,
    avatar: string,
    status: string,
  }
}

function FollowList({ user }: UserdataProps): JSX.Element {
  const classes = useStyles();
  const history = useHistory();

  const onClickFollowUser = () => {
    history.push(`/profile/${user.nickname}`);
  };

  return (
    <ListItem button key={user.nickname} onClick={onClickFollowUser}>
      <DrawAvatar
        type="sideBarImage"
        username={user.nickname}
        src={user.avatar}
        status={user.status}
      />
      <ListItemText primary={user.nickname} className={classes.usernameMargin} />
      <StatusIcon status={user.status} />
    </ListItem>
  );
}

export default React.memo(FollowList);
