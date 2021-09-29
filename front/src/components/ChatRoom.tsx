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
import { IconButton, Menu, MenuItem } from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import axios from 'axios';
import { SettingsOutlined } from '@material-ui/icons';
import { useDispatch, useSelector } from 'react-redux';
import ChattingList from './ChattingList';
import { RootState } from '../modules';
import { exitChatRoom } from '../modules/chat';
import { getUserme } from '../utils/Requests';
import { updateUser } from '../modules/user';
import ChatUserMenu from './ChatUserMenu';
import ChatSettingMenu from './ChatSettingMenu';

const useStyles = makeStyles(() => ({
  root: {
    width: '100%',
  },
  messages: {
    height: '95vh',
    width: '100%',
    display: 'flex',
    flexDirection: 'column-reverse',
    overflowY: 'auto',
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
  timestamp: string;
  sendUser: {
    nickname: string;
    avatar: string;
  };
  messageContent: string;
}

export default function ChatRoom() {
  const classes = useStyles();
  const chatData = useSelector((state: RootState) => state.chatModule);
  const { socket } = useSelector((state: RootState) => state.socketModule);
  const dispatch = useDispatch();

  // setMsg => chat/{index}/messages
  const [messages, setMsg] = useState<MessageProps[]>([]);
  const [inputs, setInputs] = useState('');
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const menu = Boolean(menuAnchor);
  const [openJoinedMenu, setOpenJoinedMenu] = useState(false);
  const [openSettingMenu, setOpenSettingMenu] = useState(false);

  useEffect(() => {
    try {
      (async () => {
        const { data } = await axios.get(`${String(process.env.REACT_APP_API_URL)}/chat/${chatData.index}/messages`);
        const msgs = data.map((message: any) => ({
          timestamp: message.createdAt,
          sendUser: {
            nickname: message.sendUser.nickname,
            avatar: message.sendUser.avatar,
          },
          messageContent: message.messageContent,
        }));
        setMsg(() => msgs);

        socket?.emit('join', {
          chatIndex: chatData.index,
        });

        socket?.on('onMessage', ({ sendUser, message }) => {
          const msg = {
            timestamp: new Date().toUTCString(),
            sendUser: {
              nickname: sendUser.nickname,
              avatar: sendUser.avatar,
            },
            messageContent: message,
          };
          setMsg((prev) => prev.concat(msg));
        });
      })();
    } catch (error) {
      console.log(error);
    }

    return () => {
      socket?.off('onMessage');
      socket?.emit('leave', {
        chatIndex: chatData.index,
      });
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatData.index]);

  const onChange = (e: any) => {
    setInputs(e.target.value);
  };

  // 내 정보 + 메세지
  const handleKeyPress = (e: any) => {
    if (inputs === '') { return; }
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
    if (inputs === '') { return; }
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
    console.log(chatData);
    setMenuAnchor(e.currentTarget);
  };

  const onClickMenuExit = async (e: React.MouseEvent<HTMLLIElement>) => {
    e.preventDefault();
    try {
      await axios.post(`${String(process.env.REACT_APP_API_URL)}/chat/${chatData.index}/leave`);
      dispatch(exitChatRoom());
      const { data } = await getUserme();
      dispatch(updateUser(data));
      setMenuAnchor(null);
    } catch (err) {
      console.log(err);
    }
  };

  const onClickMenuUser = (e: React.MouseEvent<HTMLLIElement>) => {
    e.preventDefault();
    setOpenJoinedMenu(true);
    setMenuAnchor(null);
  };

  const onClickMenuRoom = (e: React.MouseEvent<HTMLLIElement>) => {
    e.preventDefault();
    setOpenSettingMenu(true);
    setMenuAnchor(null);
  };

  return (
    <>
      <AppBar position="fixed" className={classes.titlebar}>
        <IconButton className={classes.backButtonLocation} onClick={onClickBackButton}>
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
          <MenuItem onClick={onClickMenuRoom}>채팅방 관리</MenuItem>
          <MenuItem onClick={onClickMenuUser}>유저 정보</MenuItem>
          <MenuItem onClick={onClickMenuExit}>나가기</MenuItem>
        </Menu>
        <Typography className={classes.title}>
          {chatData.title}
        </Typography>
      </AppBar>
      <div className={classes.messages}>
        <List>
          {messages.map((data) => (
            <ChattingList data={data} />
          ))}
        </List>
      </div>
      <input
        name="message"
        type="text"
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
      <ChatUserMenu open={openJoinedMenu} setOpen={setOpenJoinedMenu} />
      <ChatSettingMenu open={openSettingMenu} setOpen={setOpenSettingMenu} />
    </>
  );
}
