import React from 'react';
import List from '@material-ui/core/List';
import { Drawer } from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import ChatRoomList from './ChatRoomList';
import ChatPublicModal from './ChatPublicModal';

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

function ChatTable() {
  const classes = useStyles();

  const userdata = [roomdata1, roomdata2, roomdata3, roomdata1, roomdata2, roomdata3,
    roomdata1, roomdata2, roomdata3, roomdata1, roomdata2, roomdata3];

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
      <ChatPublicModal />
    </>
  );
}

export default React.memo(ChatTable);
