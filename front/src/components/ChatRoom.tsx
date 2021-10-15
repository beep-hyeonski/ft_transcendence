/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import SendIcon from '@material-ui/icons/Send';
import { useDispatch, useSelector } from 'react-redux';
import {
  IconButton, Menu, MenuItem,
  ThemeProvider, unstable_createMuiStrictModeTheme,
} from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import axios from 'axios';
import { SettingsOutlined } from '@material-ui/icons';
import ChattingList from './ChattingList';
import { RootState } from '../modules';
import { exitChatRoom, joinChatRoom } from '../modules/chat';
import { getUsermeChat } from '../utils/Requests';
import { updateUser } from '../modules/user';
import ChatUserMenu from './ChatUserMenu';
import ChatSettingMenu from './ChatSettingMenu';
import ChatBannedUserMenu from './ChatBannedUserMenu';
import { logoutSequence } from '../utils/logoutSequence';

const useStyles = makeStyles(() => ({
  root: {
    width: '100%',
  },
  messages: {
    height: '95vh',
    width: '100%',
    display: 'flex',
    flexDirection: 'column-reverse',
    overflow: 'auto',
  },
  chatInput: {
    border: '2px solid black',
    borderRadius: '10px',
    marginTop: 'auto',
    marginLeft: '20px',
    paddingLeft: '10px',
    backgroundColor: 'white',
    width: '70%',
    height: '33px',
    fontSize: '20px',
    letterSpacing: '1px',
    boxShadow: '1px 1px 1px gray',
  },
  title: {
    position: 'absolute',
    fontSize: '50px',
    transform: 'translateY(-50%)',
    color: '#F4F3FF',
    width: '1rem',
    marginTop: '30px',
    marginLeft: '7rem',
    whiteSpace: 'nowrap',
  },
  titlebar: {
    width: '100%',
    height: '4rem',
    backgroundColor: '#3f446e',
  },
  sendIcon: {
    marginLeft: '10px',
  },
  backButtonLocation: {
    marginTop: '18px',
    marginLeft: '10px',
    width: '10px',
    height: '10px',
  },
  backButton: {
    fontSize: '3.5rem',
    color: 'black',
  },
  settingIconLocation: {
    width: '2rem',
    height: '2rem',
    position: 'absolute',
    marginTop: '14.5px',
    marginLeft: '60px',
  },
  settingIcon: {
    fontSize: '3rem',
    color: 'black',
  },
  menu: {
    transform: 'translateY(-42%)',
    marginLeft: '2rem',
  },
  userMenu: {
    backgroundColor: 'green',
  },
}));

interface MessageProps {
  timestamp: Date;
  sendUser: {
    username: string;
    nickname: string;
    avatar: string;
  };
  messageContent: string;
}

export default function ChatRoom(): JSX.Element {
  const classes = useStyles();
  const chatData = useSelector((state: RootState) => state.chatModule);
  const { socket } = useSelector((state: RootState) => state.socketModule);
  const mydata = useSelector((state: RootState) => state.userModule);
  const [isOwner, setIsOwner] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const dispatch = useDispatch();
  const theme = unstable_createMuiStrictModeTheme();

  const [messages, setMsg] = useState<MessageProps[]>([]);
  const [inputs, setInputs] = useState('');
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const menu = Boolean(menuAnchor);
  const [openJoinedMenu, setOpenJoinedMenu] = useState(false);
  const [openSettingMenu, setOpenSettingMenu] = useState(false);
  const [openBannedMenu, setOpenBannedMenu] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(`/chat/${chatData.index}/messages`);
        const msgs = data.map((message: any) => ({
          timestamp: new Date(message.createdAt),
          sendUser: {
            username: message.sendUser.username,
            nickname: message.sendUser.nickname,
            avatar: message.sendUser.avatar,
          },
          messageContent: message.messageContent,
        }));
        setMsg(() =>
          msgs.filter(
            (message: MessageProps) =>
              !mydata.blockings.find(
                (block: any) => block.username === message.sendUser.username,
              ),
          ),
        );
      } catch (error: any) {
        if (error.response.data.message === 'Permission Denied') {
          alert('권한이 없습니다.');
        }
        if (error.response.data.message === 'Not Found') {
          alert('존재하지 않는 채팅방입니다.');
        }
        dispatch(exitChatRoom());
      }
    })();
    socket?.emit('join', {
      chatIndex: chatData.index,
    });
  
    socket?.on('onMessage', ({ sendUser, message }) => {
      const msg = {
        timestamp: new Date(),
        sendUser: {
          username: sendUser.username,
          nickname: sendUser.nickname,
          avatar: sendUser.avatar,
        },
        messageContent: message,
      };
      if (
        !mydata.blockings.find(
          (block: any) => block.username === msg.sendUser.username,
        )
      )
        setMsg((prev) => prev.concat(msg));
    });

    socket?.on('chatException', async (payload) => {
      if (payload.message === 'User has been muted from this chat')
        alert('채팅 금지 상태입니다.');
      if (payload.message === 'User Not Joined in the Chat Socket') {
        alert('채팅방에서 추방되었습니다.');
        dispatch(exitChatRoom());
        return;
      }
      if (payload.message === 'User Banned from the Chat') {
        alert('채팅방에서 추방되었습니다.');
        try {
          const res = await getUsermeChat();
          dispatch(updateUser(res));
          dispatch(exitChatRoom());
        } catch (error: any) {
          if (error.response.data.message === 'User Not Found') {
            alert('로그인 정보가 유효하지 않습니다. 다시 로그인 해주세요');
            logoutSequence(dispatch);
            window.location.href = '/';
          }
        }
      }
      if (payload.message === 'User Not Joined in the Chat') {
        alert(
          '채팅방에 입장된 상태가 아닙니다. 새로고침 후 다시 시도해 주세요',
        );
        dispatch(exitChatRoom());
      }
      if (payload.message === 'Chat Not Found') {
        alert('존재하지 않는 채팅방입니다.');
        try {
          const res = await getUsermeChat();
          dispatch(updateUser(res));
          dispatch(exitChatRoom());
        } catch (error: any) {
          if (error.response.data.message === 'User Not Found') {
            alert('로그인 정보가 유효하지 않습니다. 다시 로그인 해주세요');
            logoutSequence(dispatch);
            window.location.href = '/';
          }
        }
      }
    });

    socket?.on('deleteChat', async () => {
      alert('존재하지 않는 채팅방입니다.');
      try {
        const res = await getUsermeChat();
        dispatch(updateUser(res));
        dispatch(exitChatRoom());
      } catch (error: any) {
        if (error.response.data.message === 'User Not Found') {
          alert('로그인 정보가 유효하지 않습니다. 다시 로그인 해주세요');
          logoutSequence(dispatch);
          window.location.href = '/';
        }
      }
    });

    return () => {
      socket?.off('onMessage');
      socket?.off('chatException');
      socket?.off('deleteChat');
      socket?.emit('leave', {
        chatIndex: chatData.index,
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatData.index, socket]);

  useEffect(() => {
    const index = chatData.adminUsers.find((user: any) => user.index === mydata.index);
    setIsAdmin(Boolean(index));
    setIsOwner(chatData.ownerUser === mydata.username);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatData.ownerUser, mydata.username]);

  const onChange = (e: any) => {
    setInputs(e.target.value);
  };

  // 내 정보 + 메세지
  const handleKeyPress = (e: any) => {
    if (inputs === '') {
      return;
    }
    const data = {
      chatIndex: chatData.index,
      message: inputs,
    };
    if (e.key === 'Enter') {
      // socket으로 input 넘겨주기
      socket?.emit('onMessage', data);
      setInputs('');
    }
  };

  const sendClick = () => {
    if (inputs === '') {
      return;
    }
    const data = {
      chatIndex: chatData.index,
      message: inputs,
    };
    socket?.emit('onMessage', data);
    setInputs('');
  };

  const onClickBackButton = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    dispatch(exitChatRoom());
  };

  const onClickSettingButton = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setMenuAnchor(e.currentTarget);
  };

  const onClickMenuExit = async (e: React.MouseEvent<HTMLLIElement>) => {
    e.preventDefault();
    try {
      await axios.post(`/chat/${chatData.index}/leave`);
      dispatch(exitChatRoom());
      setMenuAnchor(null);
    } catch (err: any) {
      if (err.response.data.message === 'User Not Entered this chat') {
        alert('이미 나간 채팅방입니다.');
      }
      if (err.response.data.message === 'Not Found') {
        alert('존재하지 않는 채팅방입니다.');
      }
    }
    try {
      const data = await getUsermeChat();
      dispatch(updateUser(data));
    } catch (err: any) {
      if (err.response.data.message === 'User Not Found') {
        alert('로그인 정보가 유효하지 않습니다. 다시 로그인 해주세요');
        logoutSequence(dispatch);
        window.location.href = '/';
      }
    }
  };

  const onClickMenuUser = async (e: React.MouseEvent<HTMLLIElement>) => {
    e.preventDefault();
    try {
      const { data } = await axios.get(`/chat/${chatData.index}`);
      dispatch(
        joinChatRoom({
          roomTitle: data.title,
          roomIndex: data.index,
          roomStatus: data.status,
          roomJoinedUsers: data.joinUsers,
          roomAdmins: data.adminUsers,
          roomBannedUsers: data.bannedUsers,
          roomMuted: data.mutedUsers,
          roomOwner: data.ownerUser.username,
        }),
      );
      setOpenJoinedMenu(true);
      setMenuAnchor(null);
    } catch (error: any) {
      if (error.response.data.message === 'Not Found') {
        alert('존재하지 않는 채팅방입니다.');
        window.location.reload();
      }
    }
  };

  const onClickMenuRoom = (e: React.MouseEvent<HTMLLIElement>) => {
    e.preventDefault();
    setOpenSettingMenu(true);
    setMenuAnchor(null);
  };

  const onClickBannedUser = (e: React.MouseEvent<HTMLLIElement>) => {
    e.preventDefault();
    setOpenBannedMenu(true);
    setMenuAnchor(null);
  };
  return (
    <ThemeProvider theme={theme}>
      <AppBar position="fixed" className={classes.titlebar}>
        <IconButton
          className={classes.backButtonLocation}
          onClick={onClickBackButton}
        >
          <ArrowBackIcon className={classes.backButton} />
        </IconButton>
        <IconButton
          className={classes.settingIconLocation}
          onClick={onClickSettingButton}
        >
          <SettingsOutlined className={classes.settingIcon} />
        </IconButton>
        <Menu
          id="menu"
          open={menu}
          anchorEl={menuAnchor}
          onClose={() => setMenuAnchor(null)}
        >
          {isOwner ? (
            <MenuItem onClick={onClickMenuRoom}>채팅방 관리</MenuItem>
          ) : null}
          <MenuItem onClick={onClickMenuUser}>유저 정보</MenuItem>
          {isOwner || isAdmin ? (
            <MenuItem onClick={onClickBannedUser}>추방 유저 관리</MenuItem>
          ) : null}
          <MenuItem onClick={onClickMenuExit}>나가기</MenuItem>
        </Menu>
        <Typography className={classes.title}>{chatData.title}</Typography>
      </AppBar>
      <div className={classes.messages}>
        <List>
          {messages.map((data) => (
            <ChattingList key={data.timestamp.toISOString()} data={data} />
          ))}
        </List>
      </div>
      <input
        name="message"
        type="text"
        autoComplete="off"
        className={classes.chatInput}
        onChange={onChange}
        onKeyPress={handleKeyPress}
        value={inputs}
      />
      <Button
        variant="contained"
        color="primary"
        className={classes.sendIcon}
        onClick={sendClick}
        endIcon={<SendIcon />}
      >
        Send
      </Button>
      <ChatUserMenu
        open={openJoinedMenu}
        setOpen={setOpenJoinedMenu}
        isOwner={isOwner}
      />
      <ChatSettingMenu open={openSettingMenu} setOpen={setOpenSettingMenu} />
      <ChatBannedUserMenu open={openBannedMenu} setOpen={setOpenBannedMenu} />
    </ThemeProvider>
  );
}
