/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ChattingList from './ChattingList';

const useStyles = makeStyles(() => ({
  root: {
    width: '100%',
  },
  title: {
    position: 'absolute',
    width: '100%',
    height: '7rem',
    backgroundColor: '#3f446e',
    border: '0px',
    display: 'inline-flex',
    fontSize: '40px',
    color: '#F4F3FF',
    letterSpacing: '0.2rem',
    justifyContent: 'center',
    alignItems: 'center',
  },
  test: {
    height: '95vh',
    width: '100%',
    display: 'flex',
    // alignItems: 'flex-end',
    flexDirection: 'column-reverse',
    // alignContent: 'flex-end',
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
    width: '90%',
    fontSize: '20px',
    letterSpacing: '1px',
    boxShadow: '1px 1px 1px gray',
  },
}));

export default function ChatRoom() {
  const classes = useStyles();

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

  return (
    <>
      <div className={classes.title}>현스키가 주킴 혼내는 방</div>
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
    </>
  );
}
