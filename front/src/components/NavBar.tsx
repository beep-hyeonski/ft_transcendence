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
  alram: {
    backgroundColor: 'white',
    width: '15vw',
    height: '10vh',
    position: 'absolute',
    left: '1%',
    top: '89%',
    alignContent: 'center',
  },
  alarmText: {
    margin: '5px',
    fontSize: '15px',
  },
  Button: {
    color: '#F4F3FF',
    fontSize: '12px',
    width: '6vw',
    height: '3.5vh',
    margin: '5px',
    backgroundColor: '#282E4E',
    '&:hover': {
      backgroundColor: '#1C244F',
    },
    '&:focus': {
      backgroundColor: '#3F446E',
    },
  },
});

const NavBar = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const mydata = useSelector((state: RootState) => state.userModule);
  const [data, setData] = useState({
    status: 'WAITING',
    matchData: {
      status: '',
      gameName: '',
      sendUserIndex: -1,
      ballSpeed: '',
    },
  });
  const socket = useSelector((state: RootState) => state.socketModule);
  const history = useHistory();

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

  // const onClickAccept = () => {
  //   if (data.status === 'REQUEST_MATCH') {
  //     console.log(data.matchData);
  //     socket?.socket?.emit('matchResponse', {
  //       status: 'ACCEPT',
  //       gameName: data.matchData.gameName,
  //       sendUserIndex: data.matchData.sendUserIndex,
  //       ballSpeed: data.matchData.ballSpeed,
  //     });
  //     history.push('/game');
  //   }
  // };

  useEffect(() => {
    socket?.socket?.on('matchRequest', (gamedata) => {
      setData({
        status: gamedata.status,
        matchData: gamedata,
      });
      console.log(gamedata);
    });
  }, [data, socket]);

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
      { data.status !== 'WAITING' && <MatchAlarm data={data} setData={setData} /> }
      {/* <Paper variant="outlined" className={classes.alram}>
        <div className={classes.alarmText}>
          대결 요청이 들어왔습니다.
          <br />
          수락하시겠습니까?
        </div>
        <Button
          variant="contained"
          size="large"
          className={classes.Button}
          onClick={onClickAccept}
        >
          수락
        </Button>
        <Button
          variant="contained"
          size="large"
          className={classes.Button}
          onClick={onClickAccept}
        >
          거절
        </Button>
      </Paper> */}
    </>
  );
};

export default React.memo(NavBar);
