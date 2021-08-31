import React from 'react';
import {
  createStyles,
  makeStyles,
} from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ChatRoomList from './ChatRoomList';

const drawerWidth = 250;

const useStyles = makeStyles(() => createStyles({
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
}));

const data1 = {
  type: 'private',
  title: 'hello world',
};

const data2 = {
  type: 'public',
  title: 'hi world',
};

const data3 = {
  type: 'private',
  title: 'bye world',
};

function ChatSideBar() {
  const classes = useStyles();

  const userdata = [data1, data2, data3];

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
        {userdata.map((user) => (
          <ChatRoomList roomdata={user} />
        ))}
      </List>
    </Drawer>
  );
}

export default React.memo(ChatSideBar);
