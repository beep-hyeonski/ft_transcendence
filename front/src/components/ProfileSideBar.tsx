import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { List } from '@material-ui/core';
import Drawer from '@material-ui/core/Drawer';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../modules';
import FollowList from './FollowList';
import { deleteUser, updateUser } from '../modules/user';
import { getUserme } from '../utils/Requests';
import { logout } from '../modules/auth';
import { deleteSideData } from '../modules/sidebar';

const drawerWidth = '17%';

const useStyles = makeStyles(() =>
  createStyles({
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
  }),
);

function ProfileSideBar(): JSX.Element {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const mydata = useSelector((state: RootState) => state.userModule);
  const [isSubscribed, setSubscribed] = useState<boolean>(false);

  useEffect(() => {
    setSubscribed(true);
    getUserme()
      .then((res) => {
        if (isSubscribed) dispatch(updateUser(res));
      })
      .catch((err: any) => {
        if (err.response.data.message === 'User Not Found') {
          alert('로그인 정보가 유효하지 않습니다. 다시 로그인 해주세요');
          localStorage.removeItem('p_auth');
          dispatch(logout());
          dispatch(deleteUser());
          dispatch(deleteSideData());
          history.push('/');
        }
      });
    return () => setSubscribed(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        {mydata.followings.map((user: any) => (
          <FollowList key={user.index} user={user} />
        ))}
      </List>
    </Drawer>
  );
}

export default React.memo(ProfileSideBar);
