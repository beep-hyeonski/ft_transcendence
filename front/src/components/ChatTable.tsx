import React, { useEffect, useState } from 'react';
import axios from 'axios';
import List from '@material-ui/core/List';
import { Drawer } from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import ChatRoomList from './ChatRoomList';
import ChatPublicModal from './ChatPublicModal';
import ChatPrivateModal from './ChatPrivateModal';

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

const roomdata1 = {
  index: 0,
  type: 'private',
  title: 'hello world',
};

const roomdata2 = {
  index: 1,
  type: 'public',
  title: 'hello world',
};

const roomdata3 = {
  index: 2,
  type: 'private',
  title: 'anjnjsjka',
};

async function getChats() {
  const response = await axios.get(`${String(process.env.REACT_APP_API_URL)}/chat`);
  return response.data;
}

function ChatTable() {
  const classes = useStyles();
  const [modal, setModal] = useState({
    open: false,
    type: '',
  });

  const userdata = [roomdata1, roomdata2, roomdata3, roomdata1, roomdata2, roomdata3,
    roomdata1, roomdata2, roomdata3, roomdata1, roomdata2, roomdata3];

  useEffect(() => {
    getChats().then((res) => {
      console.log(res);
    }).catch((err) => {
      console.log(err);
    });
  });

  return (
    <>
      <Drawer
        className={classes.root}
        variant="permanent"
        classes={{ paper: classes.drawerPaper }}
      >
        <List>
          {userdata.map((roomdata) => (
            <ChatRoomList key={roomdata.index} roomdata={roomdata} />
          ))}
        </List>
      </Drawer>
      { modal.open && (
        modal.type === 'public' ? <ChatPublicModal open={modal.open} setModal={setModal} /> : <ChatPrivateModal open={modal.open} setModal={setModal} />
      )}
    </>
  );
}

export default React.memo(ChatTable);
