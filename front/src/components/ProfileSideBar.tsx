import React, { useEffect } from 'react';
import {
  createStyles,
  makeStyles,
} from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import { useDispatch } from 'react-redux';
import { getMyInfo } from './AuthControl';
import { updateData } from '../modules/userme';

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

function ProfileSideBar() {
  const classes = useStyles();
  const dispatch = useDispatch();

  useEffect(() => {
    getMyInfo().then((res) => {
      console.log('test');
      console.log(res.data);
      dispatch(updateData(res.data));
    }).catch((err) => {
      console.log(err);
    });
  }, [dispatch]);

  return (
    <Drawer
      className={classes.drawer}
      variant="permanent"
      classes={{
        paper: classes.drawerPaper,
      }}
      anchor="right"
    >
      {/* <List>
        {myFollowings.map((user) => (
          <FollowList user={user} />
        ))}
      </List> */}
    </Drawer>
  );
}

export default React.memo(ProfileSideBar);
