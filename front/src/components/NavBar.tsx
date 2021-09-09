/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable no-restricted-globals */
import React from 'react';
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
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../modules';
import { changeUser } from '../modules/profile';
import { deleteData } from '../modules/userme';
import {
  changeStatus, deleteSideData, CHAT, FOLLOW,
  MAIN,
} from '../modules/sidebar';

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
  const mydata = useSelector((state: RootState) => state.usermeModule);

  const onClickMain = () => {
    dispatch(changeStatus({ type: MAIN }));
  };

  const onClickProfile = () => {
    dispatch(changeUser(mydata));
    dispatch(changeStatus({ type: FOLLOW }));
  };

  const onClickChat = () => {
    dispatch(changeStatus({ type: CHAT }));
  };

  const onClickSetting = () => {
    dispatch(changeStatus({ type: FOLLOW }));
  };

  const onClickLogout = async () => {
    axios.defaults.headers.common.Authorization = `Bearer ${String(localStorage.getItem('p_auth'))}`;
    localStorage.removeItem('p_auth');
    dispatch(deleteData());
    dispatch(deleteSideData());
    try {
      await axios.post(`${String(process.env.REACT_APP_API_URL)}/auth/logout`);
    } catch (error: any) {
      console.log(error.response);
    }
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
  );
};

export default React.memo(NavBar);
