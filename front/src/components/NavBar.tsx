import React, { useEffect, useState } from 'react';
import {
  makeStyles,
} from '@material-ui/core/styles';
import {
  Drawer, List, ListItem, ListItemIcon,
} from '@material-ui/core';
import {
  SportsEsports, Person, Chat,
} from '@material-ui/icons';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import SettingsIcon from '@material-ui/icons/Settings';
import axios from 'axios';
import { Link, useHistory } from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../modules';
import { deleteUser } from '../modules/user';
import {
  changeSideBar, deleteSideData, CHAT, FOLLOW,
  MAIN,
} from '../modules/sidebar';
import { logout } from '../modules/auth';
import MatchAlarm from './MatchAlarm';

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

  const onClickMain = () => {
    dispatch(changeSideBar({ type: MAIN }));
  };

  const onClickProfile = () => {
    dispatch(changeSideBar({ type: FOLLOW }));
  };

  const onClickChat = () => {
    dispatch(changeSideBar({ type: CHAT }));
  };

  const onClickSetting = () => {
    dispatch(changeSideBar({ type: FOLLOW }));
  };

  const onClickLogout = async () => {
    try {
      await axios.post(`${String(process.env.REACT_APP_API_URL)}/auth/logout`);
      localStorage.removeItem('p_auth');
      dispatch(deleteUser());
      dispatch(logout());
      dispatch(deleteSideData());
    } catch (error: any) {
      console.log(error.response);
    }
  };

  return (
    <>
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
            <ListItem
              button
              alignItems="center"
              onClick={onClickMain}
            >
              <ListItemIcon
                className={classes.ListItemIconNoWidth}
              >
                <SportsEsports className={classes.fontsizeManager} />
              </ListItemIcon>
            </ListItem>
          </Link>
          <Link to={`/profile/${mydata.nickname}`}>
            <ListItem button onClick={onClickProfile}>
              <ListItemIcon
                className={classes.ListItemIconNoWidth}
              >
                <Person className={classes.fontsizeManager} />
              </ListItemIcon>
            </ListItem>
          </Link>
          <Link to="/chat">
            <ListItem button onClick={onClickChat}>
              <ListItemIcon
                className={classes.ListItemIconNoWidth}
              >
                <Chat className={classes.fontsizeManager} />
              </ListItemIcon>
            </ListItem>
          </Link>
          <Link to="/setting">
            <ListItem button onClick={onClickSetting}>
              <ListItemIcon
                className={classes.ListItemIconNoWidth}
              >
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
    </>
  );
};

export default React.memo(NavBar);
