import React from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import ListItemText from '@material-ui/core/ListItemText';
import { ChatBubbleOutlineRounded } from '@material-ui/icons';
import { joinChatRoom } from '../modules/chat';

const useStyles = makeStyles(() => createStyles({
  usernameMargin: {
    marginLeft: '10px',
  },
}));

interface SideBarProps {
  index: number,
  title: string,
}

function ChatJoinedList({ index, title }: SideBarProps): JSX.Element {
  const classes = useStyles();
  const dispatch = useDispatch();

  const clickTest = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    axios.get(`${String(process.env.REACT_APP_API_URL)}/chat/${index}`).then((res) => {
      console.log(res.data);
      dispatch(joinChatRoom({
        roomTitle: res.data.title,
        roomIndex: res.data.index,
        roomUsers: res.data.joinUsers,
      }));
    }).catch((err) => {
      console.log(err.response);
    });
  };

  return (
    <ListItem button key={index} onClick={clickTest}>
      <ChatBubbleOutlineRounded style={{ fontSize: 40 }} />
      <ListItemText primary={title} className={classes.usernameMargin} />
      {/* 나가기 버튼 */}
    </ListItem>
  );
}

export default React.memo(ChatJoinedList);
