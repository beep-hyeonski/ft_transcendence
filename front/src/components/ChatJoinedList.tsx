import React from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { ChatBubbleOutlineRounded } from '@material-ui/icons';

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

function ChatJoinedList({ roomdata }: SideBarProps): JSX.Element {
  const classes = useStyles();

  return (
    <ListItem button key={roomdata.title}>
      <ChatBubbleOutlineRounded style={{ fontSize: 40 }} />
      <ListItemText primary={roomdata.title} className={classes.usernameMargin} />
      {/* 나가기 버튼 */}
    </ListItem>
  );
}

export default React.memo(ChatJoinedList);
