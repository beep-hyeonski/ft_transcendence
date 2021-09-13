/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import React from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import DrawAvatar, { DrawAvatarProps } from './Avatar';

const useStyles = makeStyles(() => ({
  root: {
    marginLeft: '15px',
  },
}));

function ChattingList({ data }: any): JSX.Element {
  const classes = useStyles();

  return (
    <ListItem>
      <DrawAvatar
        type="sideBarImage"
        username={data.sender}
        src={data.src}
        status="online"
      />
      <ListItemText
        className={classes.root}
        primary={data.sender}
        secondary={data.message}
      />
    </ListItem>
  );
}

export default React.memo(ChattingList);
