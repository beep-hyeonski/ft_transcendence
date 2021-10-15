import React, { useEffect, useState } from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import LobyUserList from './LobyUserList';
import { getUsers } from '../utils/Requests';
import checkToken from '../utils/checkToken';
import { RootState } from '../modules';

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

function LobySideBar(): JSX.Element {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  const [users, setUsers] = useState<any[]>([]);
  const { index } = useSelector((state: RootState) => state.userModule);

  useEffect(() => {
    let isSubscribed = true;
    (async () => {
      try {
        const data: any[] = await getUsers();
        const onlineUsers = data.filter(
          (user: any) => user.index !== index && user.status !== 'offline',
        );
        if (isSubscribed) setUsers(onlineUsers);
      } catch (err: any) {
        checkToken(dispatch, history);
        alert('인증 정보가 유효하지 않습니다');
        history.push('/');
      }
    })();
    return () => {isSubscribed = false};
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
        {users.map((user: any) => (
          <LobyUserList key={user.index} user={user} />
        ))}
      </List>
    </Drawer>
  );
}

export default React.memo(LobySideBar);
