/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import React from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import { Menu, MenuItem } from '@material-ui/core';
import ListItemText from '@material-ui/core/ListItemText';
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

function FollowList({ user }: any): JSX.Element {
  const classes = useStyles();
  const [menuAnchor, setMenuAnchor] = React.useState<null | any>(null);
  const menu = Boolean(menuAnchor);

  const rightClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setMenuAnchor(e.currentTarget);
  };

  const clickDM = (e: React.MouseEvent<HTMLLIElement>) => {
    e.preventDefault();
    console.log('DM');
    setMenuAnchor(null);
  };

  const clickBlock = (e: React.MouseEvent<HTMLLIElement>) => {
    e.preventDefault();
    console.log('Block');
    setMenuAnchor(null);
  };

  return (
    <ListItem button key={user.nickname} onContextMenu={rightClick}>
      <DrawAvatar
        type="sideBarImage"
        username={user.nickname}
        src={user.avatar}
        status={user.status}
      />
      <ListItemText primary={user.nickname} className={classes.usernameMargin} />
      <StatusIcon status={user.status} />
      <Menu
        id="menu"
        open={menu}
        anchorEl={menuAnchor}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        onClose={() => setMenuAnchor(null)}
      >
        <MenuItem onClick={clickDM}>DM</MenuItem>
        <MenuItem onClick={clickBlock}>Block</MenuItem>
      </Menu>
    </ListItem>
  );
}

export default React.memo(FollowList);
