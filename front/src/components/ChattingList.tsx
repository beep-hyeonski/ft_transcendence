/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import DrawAvatar from './Avatar';

const useStyles = makeStyles(() => ({
  root: {
    width: '80%',
    borderTop: '1px solid #e0e0e0',
  },
  textArea: {
    top: '0%',
    marginLeft: '15px',
  },
  timestamp: {
    fontSize: '10px',
    position: 'absolute',
    right: '3%',
    bottom:'10%',
  },
}));

interface ChattingListProps {
  data: {
    messageContent: string;
    sendUser: {
      username: string;
      nickname: string;
      avatar: string;
    };
    timestamp: Date;
  };
}

function ChattingList({ data }: ChattingListProps): JSX.Element {
  const classes = useStyles();

  return (
    <ListItem className={classes.root}>
      <DrawAvatar
        type="sideBarImage"
        username={data.sendUser.username}
        src={data.sendUser.avatar}
        status="online"
        nickname={data.sendUser.nickname}
      />
      <ListItemText
        className={classes.textArea}
        primary={data.sendUser.nickname}
        secondary={data.messageContent}
      />
      <ListItemText
        classes={{ primary: classes.timestamp }}
        primary={data.timestamp.toLocaleString()}
      />
    </ListItem>
  );
}

export default React.memo(ChattingList);
