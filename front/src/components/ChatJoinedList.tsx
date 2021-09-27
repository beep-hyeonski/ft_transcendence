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

  const clickTest = async (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    try {
      const { data } = await axios.get(`${String(process.env.REACT_APP_API_URL)}/chat/${index}`);
      console.log(data);
      dispatch(joinChatRoom({
        roomTitle: data.title,
        roomIndex: data.index,
        roomUsers: data.joinUsers,
      }));
    } catch (error) {
      console.log(error);
    }
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
