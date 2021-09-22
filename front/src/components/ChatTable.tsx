import React, { useEffect, useState } from 'react';
import axios from 'axios';
import List from '@material-ui/core/List';
import { Drawer } from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import ChatRoomList from './ChatRoomList';
import ChatPublicModal from './ChatPublicModal';
import ChatProtectedModal from './ChatProtectedModal';

const useStyles = makeStyles(() => createStyles({
  root: {
    position: 'absolute',
    top: '54%',
    left: '41.5%',
    transform: 'translate(-50%, -50%)',
    width: '78%',
    height: '81%',
  },
  drawerPaper: {
    backgroundColor: 'white',
    width: '100%',
    height: '100%',
    borderRadius: '3px',
    boxShadow: '3.5px 3.5px 3px gray',
    display: 'flex',
  },
}));

async function getChats() {
  const response = await axios.get(`${String(process.env.REACT_APP_API_URL)}/chat`);
  return response.data;
}

// index: -1,
// ownerUser: {
//   avatar: '',
//   defeat: -1,
//   email: '',
//   index: -1,
//   nickname: '',
//   score: -1,
//   status: '',
//   twoFAToken: null,
//   useTwoFA: false,
//   username: '',
//   victory: -1,
// },
// password: '',
// status: '',
// title: '',

function ChatTable() {
  const classes = useStyles();
  const [modal, setModal] = useState({
    open: false,
    status: '',
    title: '',
    joinUsers: [],
    password: '',
    // bannedUsers: [],
    // mutedUsers: [],
  });
  const [chats, setChats] = useState([]);

  useEffect(() => {
    getChats().then((res) => {
      console.log(res);
      setChats(res);
    }).catch((err) => {
      console.log(err);
    });
  }, []);

  return (
    <>
      <Drawer
        className={classes.root}
        variant="permanent"
        classes={{ paper: classes.drawerPaper }}
      >
        <List>
          {chats.map((roomdata) => (
            <ChatRoomList
              key={roomdata}
              roomdata={roomdata}
              setModal={setModal}
            />
          ))}
        </List>
      </Drawer>
      { modal.status === 'public' ? <ChatPublicModal modal={modal} setModal={setModal} /> : <ChatProtectedModal modal={modal} setModal={setModal} /> }
    </>
  );
}

export default React.memo(ChatTable);
