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

interface SideBarProps {
  title: string,
}

function ChatJoinedList({ title }: SideBarProps): JSX.Element {
  const classes = useStyles();

  const clickTest = () => {
    console.log('test');
  };

  return (
    <ListItem button key={title} onClick={clickTest}>
      <ChatBubbleOutlineRounded style={{ fontSize: 40 }} />
      <ListItemText primary={title} className={classes.usernameMargin} />
      {/* 나가기 버튼 */}
    </ListItem>
  );
}

export default React.memo(ChatJoinedList);
