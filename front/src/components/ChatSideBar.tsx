import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ChatJoinedList from './ChatJoinedList';
import { RootState } from '../modules';
import { getUsermeChat } from '../utils/Requests';
import { updateUser } from '../modules/user';

const drawerWidth = 250;

const useStyles = makeStyles(() =>
  createStyles({
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
    },
    drawerPaper: {
      marginRight: '73.1px',
      backgroundColor: '#3f446e',
      color: '#F4F3FF',
      width: drawerWidth,
    },
    usernameMargin: {
      margin: '15px',
    },
    statusCircle: {
      backgroundColor: '#FF0000',
      color: '#FF0000',
      width: '10px',
      height: '10px',
      borderRadius: '50%',
    },
    changeButton: {
      margin: '7.5px',
      backgroundColor: '#F4F3FF',
      fontSize: 20,
      color: '#282E4E',
      width: 230,
      height: 40,
      textTransform: 'none',
      textShadow: '0.5px 0.5px 0.5px gray',
      boxShadow: '1px 1px 0.5px gray',
      '&:hover': {
        backgroundColor: '#e3e0ff',
      },
    },
  }),
);

interface ChannelProps {
  index: number;
  title: string;
}

// TODO: 채팅 채널 입장 또는 퇴장 시 sidebar 업데이트 안되는 문제 잡기
function ChatSideBar(): JSX.Element {
  const classes = useStyles();
  const { joinChannels } = useSelector((state: RootState) => state.userModule);
  const dispatch = useDispatch();

  useEffect(() => {
    getUsermeChat()
      .then((res) => {
        dispatch(updateUser(res.data));
      })
      .catch((err) => {
        console.log(err.response);
      });
  }, [dispatch]);

  return (
    <Drawer
      className={classes.drawer}
      variant="permanent"
      classes={{
        paper: classes.drawerPaper,
      }}
      anchor="right"
    >
      <List>
        {joinChannels.map((channel: ChannelProps) => (
          <ChatJoinedList
            key={channel.index}
            index={channel.index}
            title={channel.title}
          />
        ))}
      </List>
    </Drawer>
  );
}

export default React.memo(ChatSideBar);
