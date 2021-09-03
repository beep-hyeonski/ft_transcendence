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
import SettingsIcon from '@material-ui/icons/Settings';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../modules';
import { changeUser } from '../modules/profile';

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

  const onClickProfile = () => {
    dispatch(changeUser({ avatar: mydata.avatar }));
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
        <Link to="/main">
          <ListItem
            button
            alignItems="center"
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
          <ListItem button>
            <ListItemIcon
              className={classes.ListItemIconNoWidth}
            >
              <Chat className={classes.fontsizeManager} />
            </ListItemIcon>
          </ListItem>
        </Link>
        <Link to="/setting">
          <ListItem button>
            <ListItemIcon
              className={classes.ListItemIconNoWidth}
            >
              <SettingsIcon className={classes.fontsizeManager} />
            </ListItemIcon>
          </ListItem>
        </Link>
      </List>
    </Drawer>
  );
};

export default React.memo(NavBar);
