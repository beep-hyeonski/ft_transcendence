import React from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { LockRounded, LockOpenRounded, ChatBubbleOutlineRounded } from '@material-ui/icons';

const useStyles = makeStyles(() => createStyles({
  usernameMargin: {
    marginLeft: '10px',
  },
}));

interface ChatRoomProps{
  type: string;
  title: string;
}

interface SideBarProps {
  roomdata: ChatRoomProps;
}

interface StatusIconProps {
  status: string
}

function StatusIcon({ status }: StatusIconProps): JSX.Element {
  if (status === 'private') {
    return (
      <LockRounded style={{ color: '#666666' }} />
    );
  }
  return (
    <LockOpenRounded style={{ color: '#FFFFFF' }} />
  );
}

function ChatRoomList({ roomdata }: SideBarProps): JSX.Element {
  const classes = useStyles();

  return (
    <ListItem button key={roomdata.title}>
      <ChatBubbleOutlineRounded style={{ fontSize: 40 }} />
      <ListItemText primary={roomdata.title} className={classes.usernameMargin} />
      <StatusIcon status={roomdata.type} />
    </ListItem>
  );
}

export default React.memo(ChatRoomList);
