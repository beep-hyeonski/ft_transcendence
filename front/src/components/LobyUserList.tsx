/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
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

function LobyUserList({ userdata } : any): JSX.Element {
  const classes = useStyles();

  // eslint-disable-next-line prefer-template
  // const userdata = axios.get('/user/' + username);

  return (
    <ListItem button key={userdata.username}>
      <DrawAvatar
        type={userdata.type}
        username={userdata.username}
        src={userdata.src}
        status=""
      />
      <ListItemText primary={userdata.username} className={classes.usernameMargin} />
      <WbSunnyRounded style={{ color: '#FFFA66' }} />
    </ListItem>
  );
}

export default React.memo(LobyUserList);
