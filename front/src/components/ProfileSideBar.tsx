import React from 'react';
import {
  createStyles,
  makeStyles,
} from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ChatRoomList from './ChatRoomList';
import FollowList from './FollowList';

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
  type: 'sideBarImage',
  status: 'offline',
  username: 'hyeonski',
  src: 'data:image/jpeg;base64,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',
};

const data2 = {
  type: 'sideBarImage',
  status: 'ingame',
  username: 'joockim',
  src: 'https://search.pstatic.net/common?type=a&size=120x150&quality=95&direct=true&src=http%3A%2F%2Fsstatic.naver.net%2Fpeople%2F73%2F202108181932006201.jpg',
};

const data3 = {
  type: 'sideBarImage',
  status: 'offline',
  username: 'juyang',
  src: '',
};

const data4 = {
  type: 'sideBarImage',
  status: 'offline',
  username: 'hyeyou',
  src: '',
};

const data5 = {
  type: 'sideBarImage',
  status: 'online',
  username: 'polarbear',
  src: '',
};

const data6 = {
  type: 'sideBarImage',
  status: 'ingame',
  username: 'soohchoi',
  src: '',
};

const data7 = {
  type: 'sideBarImage',
  status: 'online',
  username: 'jachoi',
  src: '',
};

function ProfileSideBar() {
  const classes = useStyles();

  const userdata = [data1, data2, data3, data4, data5, data6, data7];

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
          <FollowList userdata={user} />
        ))}
      </List>
    </Drawer>
  );
}

export default React.memo(ProfileSideBar);
