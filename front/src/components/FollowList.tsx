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

interface SideBarProps {
  userdata: DrawAvatarProps;
}

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

function FollowList({ userdata }: SideBarProps): JSX.Element {
  const classes = useStyles();

  return (
    <ListItem button key={userdata.username}>
      <DrawAvatar
        type={userdata.type}
        username={userdata.username}
        src={userdata.src}
        status={userdata.status}
      />
      <ListItemText primary={userdata.username} className={classes.usernameMargin} />
      <StatusIcon status={userdata.status} />
    </ListItem>
  );
}

export default React.memo(FollowList);
