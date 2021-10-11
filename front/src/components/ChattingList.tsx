/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import DrawAvatar from './Avatar';

const useStyles = makeStyles(() => ({
  root: {
    marginLeft: '15px',
  },
}));

interface ChattingListProps {
  data: {
    messageContent: string;
    sendUser: {
      nickname: string;
      avatar: string;
    };
    timestamp: string;
  };
}

function ChattingList({ data }: ChattingListProps): JSX.Element {
  const classes = useStyles();

  return (
    <ListItem>
      <DrawAvatar
        type="sideBarImage"
        username={data.sendUser.nickname}
        src={data.sendUser.avatar}
        status="online"
      />
      <ListItemText
        className={classes.root}
        primary={data.sendUser.nickname}
        secondary={data.messageContent}
      />
    </ListItem>
  );
}

export default React.memo(ChattingList);
