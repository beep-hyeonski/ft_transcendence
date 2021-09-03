/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import React from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { WbSunnyRounded, NightsStayRounded, AdbRounded } from '@material-ui/icons';
import DrawAvatar, { DrawAvatarProps } from './Avatar';

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

function FollowList({ user }: any): JSX.Element {
  const classes = useStyles();

  return (
    <ListItem button key={user.nickname}>
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
