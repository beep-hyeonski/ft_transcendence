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
import { IconButton } from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import ChattingList from './ChattingList';
import { RootState } from '../modules';

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
}));

interface MessageProps {
  timestamp: string;
  sendUser: {
    nickname: string;
    avatar: string;
  };
  messageContent: string;
}

export default function DMRoom(): JSX.Element {
  const classes = useStyles();
  const chatData = useSelector((state: RootState) => state.chatModule);
  const { socket } = useSelector((state: RootState) => state.socketModule);
  const mydata = useSelector((state: RootState) => state.userModule);
  const dispatch = useDispatch();
	const history = useHistory();

  const [messages, setMsg] = useState<MessageProps[]>([]);
  const [inputs, setInputs] = useState('');

  useEffect(() => {
    try {
      (async () => {
        const { data } = await axios.get(
          `${String(process.env.REACT_APP_API_URL)}/chat/${
            chatData.index
          }/messages`,
        );
        const msgs = data.map((message: any) => ({
          timestamp: message.createdAt,
          sendUser: {
            nickname: message.sendUser.nickname,
            avatar: message.sendUser.avatar,
          },
          messageContent: message.messageContent,
        }));
        setMsg(() =>
          msgs.filter(
            (message: MessageProps) =>
              !mydata.blockings.find(
                (block: any) => block.nickname === message.sendUser.nickname,
              ),
          ),
        );

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
          if (
            !mydata.blockings.find(
              (block: any) => block.nickname === msg.sendUser.nickname,
            )
          )
            setMsg((prev) => prev.concat(msg));
        });

        socket?.on('exception', (payload) => {
          console.log(payload);
        });
      })();
    } catch (error) {
      console.log(error);
    }

    return () => {
      socket?.off('onMessage');
      socket?.off('exception');
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
		history.goBack();
  };

  return (
    <>
      <AppBar position="fixed" className={classes.titlebar}>
        <IconButton
          className={classes.backButtonLocation}
          onClick={onClickBackButton}
        >
          <ArrowBackIcon className={classes.backButton} />
        </IconButton>
        <Typography className={classes.title}>{chatData.title}</Typography>
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
    </>
  );
}
