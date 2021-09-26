/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import SendIcon from '@material-ui/icons/Send';
import { IconButton } from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { useDispatch, useSelector } from 'react-redux';
import ChattingList from './ChattingList';
import { RootState } from '../modules';
import { exitChatRoom } from '../modules/chat';

const useStyles = makeStyles(() => ({
  root: {
    width: '100%',
  },
  test: {
    height: '95vh',
    width: '100%',
    display: 'flex',
    flexDirection: 'column-reverse',
    overflowY: 'auto',
  },
  textArea: {
    fontSize: '70px',
    color: '#F4F3FF',
    letterSpacing: '0.2rem',
    marginTop: '10px',
    marginLeft: '22px',
    textShadow: '1px 1px 1.5px black',
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
  },
}));

export default function ChatRoom() {
  const classes = useStyles();
  const chatData = useSelector((state: RootState) => state.chatModule);
  const dispatch = useDispatch();

  const [messagesExample, setMsg] = useState([
    {
      id: 1,
      sender: 'hyeonski',
      src: 'https://cdn.topstarnews.net/news/photo/201810/494999_155091_4219.jpg',
      message: '아 존나 빡치네',
    },
    {
      id: 2,
      sender: 'joockim',
      src: '',
      message: '아 미안해요 ㅠㅠㅠ',
    },
    {
      id: 3,
      sender: 'hyeonski',
      src: 'https://cdn.topstarnews.net/news/photo/201810/494999_155091_4219.jpg',
      message: '저기가서 물구나무 서세요',
    },
    {
      id: 4,
      sender: 'hyeonski',
      src: 'https://cdn.topstarnews.net/news/photo/201810/494999_155091_4219.jpg',
      message: '아오 시부레탱탱볼',
    },
  ]);

  const [inputs, setInputs] = useState('');

  const onChange = (e: any) => {
    setInputs(e.target.value);
  };

  const handleKeyPress = (e: any) => {
    const data = {
      id: 5,
      sender: 'jayun',
      src: 'https://cdn.topstarnews.net/news/photo/201810/494999_155091_4219.jpg',
      message: inputs,
    };
    if (e.key === 'Enter') {
      setMsg(messagesExample.concat(data));
      setInputs('');
    }
  };

  const sendClick = () => {
    const data = {
      id: 5,
      sender: 'jayun',
      src: 'https://cdn.topstarnews.net/news/photo/201810/494999_155091_4219.jpg',
      message: inputs,
    };
    setMsg(messagesExample.concat(data));
    setInputs('');
  };

  const onClickBackButton = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    dispatch(exitChatRoom());
  };

  return (
    <>
      <AppBar position="fixed" className={classes.titlebar}>
        <IconButton className={classes.backButtonLocation} onClick={onClickBackButton}>
          <ArrowBackIcon className={classes.backButton} />
        </IconButton>
        <Typography className={classes.title}>
          {chatData.title}
        </Typography>
      </AppBar>
      <div className={classes.test}>
        <List>
          {messagesExample.map((data) => (
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
