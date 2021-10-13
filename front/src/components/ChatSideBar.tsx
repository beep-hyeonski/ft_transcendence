import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ChatJoinedList from './ChatJoinedList';
import { RootState } from '../modules';
import { getUsermeChat } from '../utils/Requests';
import { updateUser } from '../modules/user';
import { logoutSequence } from '../utils/logoutSequence';

const drawerWidth = '17%';

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

function ChatSideBar(): JSX.Element {
  const classes = useStyles();
  const mydata = useSelector((state: RootState) => state.userModule);
  const dispatch = useDispatch();

  useEffect(() => {
    getUsermeChat()
      .then((res) => {
        dispatch(updateUser(res));
      })
      .catch((err: any) => {
        if (err.response.data.message === 'User Not Found') {
          alert('로그인 정보가 유효하지 않습니다. 다시 로그인 해주세요');
          logoutSequence(dispatch);
          window.location.href = '/';
        }
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        {mydata.joinChannels.map((channel: ChannelProps) => (
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
