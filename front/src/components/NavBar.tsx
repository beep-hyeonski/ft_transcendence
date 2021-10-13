import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Drawer, List, ListItem, ListItemIcon } from '@material-ui/core';
import { SportsEsports, Person, Chat } from '@material-ui/icons';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import SettingsIcon from '@material-ui/icons/Settings';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../modules';
import { exitChatRoom } from '../modules/chat';
import { logoutSequence } from '../utils/logoutSequence';

const useStyles = makeStyles({
  ListItemIconNoWidth: {
    'min-width': 0,
    color: '#F4F3FF',
  },
  ListDownAlign: {
    position: 'sticky',
    top: '100%',
  },
  fontsizeManager: {
    fontSize: 40,
  },
  paper: {
    backgroundColor: '#282E4E',
  },
});

const NavBar = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const mydata = useSelector((state: RootState) => state.userModule);

  const onClickLogout = async () => {
    await axios.post(`/auth/logout`);
    logoutSequence(dispatch);
  };

  const onClickChat = () => {
    dispatch(exitChatRoom());
  };

  return (
    <Drawer
      variant="permanent"
      anchor="right"
      classes={{ paper: classes.paper }}
    >
      <List
        component="nav"
        disablePadding
        aria-label="navigation bar"
        className={classes.ListDownAlign}
      >
        <Link to="/">
          <ListItem button alignItems="center">
            <ListItemIcon className={classes.ListItemIconNoWidth}>
              <SportsEsports className={classes.fontsizeManager} />
            </ListItemIcon>
          </ListItem>
        </Link>
        <Link to={`/profile/?username=${mydata.username}`}>
          <ListItem button>
            <ListItemIcon className={classes.ListItemIconNoWidth}>
              <Person className={classes.fontsizeManager} />
            </ListItemIcon>
          </ListItem>
        </Link>
        <Link to="/chat">
          <ListItem button onClick={onClickChat}>
            <ListItemIcon className={classes.ListItemIconNoWidth}>
              <Chat className={classes.fontsizeManager} />
            </ListItemIcon>
          </ListItem>
        </Link>
        <Link to="/setting">
          <ListItem button>
            <ListItemIcon className={classes.ListItemIconNoWidth}>
              <SettingsIcon className={classes.fontsizeManager} />
            </ListItemIcon>
          </ListItem>
        </Link>
        <Link to="/">
          <ListItem button>
            <ListItemIcon
              className={classes.ListItemIconNoWidth}
              onClick={onClickLogout}
            >
              <ExitToAppIcon className={classes.fontsizeManager} />
            </ListItemIcon>
          </ListItem>
        </Link>
      </List>
    </Drawer>
  );
};

export default React.memo(NavBar);
