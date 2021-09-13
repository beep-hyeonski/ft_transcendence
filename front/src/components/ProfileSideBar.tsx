import React, { useEffect } from 'react';
import {
  createStyles,
  makeStyles,
} from '@material-ui/core/styles';
import { List } from '@material-ui/core';
import Drawer from '@material-ui/core/Drawer';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { getUserme } from '../RequestFunc';
import { updateMyData } from '../modules/userme';
import { RootState } from '../modules';
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

function ProfileSideBar() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();

  // useEffect(() => {
  //   getUserme().then((res) => {
  //     dispatch(updateMyData(res.data));
  //   }).catch((err) => {
  //     console.log(err);
  //     localStorage.removeItem('p_auth');
  //     alert('인증 정보가 유효하지 않습니다');
  //     history.push('/');
  //   });
  // }, [dispatch, history]);

  const mydata = useSelector((state: RootState) => state.usermeModule);

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
        {mydata.followings.map((user) => (
          <FollowList user={user} />
        ))}
      </List>
    </Drawer>
  );
}

export default React.memo(ProfileSideBar);
