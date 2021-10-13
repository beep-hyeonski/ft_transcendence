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
import { useHistory, RouteComponentProps } from 'react-router-dom';
import axios from 'axios';
import ChattingList from './ChattingList';
import { RootState } from '../modules';
import { deleteSideData } from '../modules/sidebar';
import { getUserByUsername } from '../utils/Requests';

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
    width: '80%',
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
    marginLeft: '4rem',
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
  timestamp: Date;
  sendUser: {
    username: string;
    nickname: string;
    avatar: string;
  };
  messageContent: string;
}

interface DMProps {
  username: string;
}

export default function DMRoom({
  match,
}: RouteComponentProps<DMProps>): JSX.Element {
  const classes = useStyles();
  const { socket } = useSelector((state: RootState) => state.socketModule);
  const { username } = match.params;
  const [nickname, setNickname] = useState('');
  const history = useHistory();
  const dispatch = useDispatch();
  const mydata = useSelector((state: RootState) => state.userModule);

  const [messages, setMsg] = useState<MessageProps[]>([]);
  const [inputs, setInputs] = useState('');

  useEffect(() => {
    let isSubscribed = true;
    dispatch(deleteSideData());
    (async () => {
      try {
        const { data } = await axios.get(`/dm/${username}`);
        const msgs = data.map((message: any) => ({
          timestamp: new Date(message.createdAt),
          sendUser: {
            username: message.sendUser.username,
            nickname: message.sendUser.nickname,
            avatar: message.sendUser.avatar,
          },
          messageContent: message.message,
        }));
        if (isSubscribed) setMsg(msgs);
      } catch (error: any) {
        if (error.response.data.message === 'Not Found') {
          alert('접근할 수 없습니다');
          history.goBack();
        }
      }
    })();

    (async () => {
      try {
        const data = await getUserByUsername(username);
        setNickname(data.nickname);
      } catch (error: any) {
        if (error.response.data.message === 'User Not Found') {
          alert('존재하지 않는 유저입니다');
        }
      }
    })();

    socket?.on('onDM', ({ sendUser, message }) => {
      const msg = {
        timestamp: new Date(),
        sendUser: {
          username: sendUser.username,
          nickname: sendUser.nickname,
          avatar: sendUser.avatar,
        },
        messageContent: message,
      };
      if (sendUser.username === mydata.username || sendUser.username === username)
        setMsg((prev) => prev.concat(msg));
    });

    return () => {
      isSubscribed = false;
      socket?.off('onDM');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onChange = (e: any) => {
    setInputs(e.target.value);
  };

  // 내 정보 + 메세지
  const handleKeyPress = (e: any) => {
    if (inputs === '') {
      return;
    }
    const data = {
      receiveUser: username,
      message: inputs,
    };
    if (e.key === 'Enter') {
      // socket으로 input 넘겨주기
      socket?.emit('onDM', data);
      setInputs('');
    }
  };

  const sendClick = () => {
    if (inputs === '') {
      return;
    }
    const data = {
      receiveUser: username,
      message: inputs,
    };
    socket?.emit('onDM', data);
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
        <Typography className={classes.title}>{nickname}</Typography>
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
        className={classes.chatInput}
        onChange={onChange}
        onKeyPress={handleKeyPress}
        value={inputs}
        autoComplete="off"
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
