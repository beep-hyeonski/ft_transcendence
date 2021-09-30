/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux';
import Avatar from '@material-ui/core/Avatar';
import {
  Button,
  Dialog,
  DialogTitle,
  List,
  ListItem,
  ListItemText,
} from '@material-ui/core';
import { RootState } from '../modules';
import { updateUser } from '../modules/user';
import { pvpQueueGame, ingGame } from '../modules/gamestate';
import { setGameData } from '../modules/gamedata';

const useStyles = makeStyles(() => createStyles({
  profileImage: {
    position: 'absolute',
    top: '27%',
    left: '5%',
    width: 250,
    height: 250,
    boxShadow: '1px 1px 1.5px gray',
  },
  changeImageButton: {
    position: 'absolute',
    top: '75%',
    left: '18%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#F4F3FF',
    color: '#282E4E',
    width: 230,
    height: 50,
    textTransform: 'none',
    textShadow: '1px 1px 0.5px gray',
    boxShadow: '1px 1px 0.5px gray',
    '&:hover': {
      backgroundColor: '#e3e0ff',
    },
  },
  followButton: {
    position: 'absolute',
    top: '75%',
    left: '18%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#3F446E',
    color: '#F4F3FF',
    width: 230,
    height: 50,
    textTransform: 'none',
    textShadow: '1px 1px 0.5px gray',
    boxShadow: '1px 1px 1px gray',
    '&:hover': {
      backgroundColor: '#1c244f',
    },
  },
  unfollowButton: {
    position: 'absolute',
    top: '75%',
    left: '18%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#CE6F84',
    color: '#F4F3FF',
    width: 230,
    height: 50,
    textTransform: 'none',
    textShadow: '1px 1px 0.5px gray',
    boxShadow: '1px 1px 1px gray',
    '&:hover': {
      backgroundColor: '#cc6b80',
    },
  },
  pvpButton: {
    position: 'absolute',
    top: '85%',
    left: '18%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#3F446E',
    color: '#F4F3FF',
    width: 230,
    height: 50,
    textTransform: 'none',
    textShadow: '1px 1px 0.5px gray',
    boxShadow: '1px 1px 1px gray',
    '&:hover': {
      backgroundColor: '#1c244f',
    },
  },
  obButton: {
    position: 'absolute',
    top: '85%',
    left: '18%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#3F446E',
    color: '#F4F3FF',
    width: 230,
    height: 50,
    textTransform: 'none',
    textShadow: '1px 1px 0.5px gray',
    boxShadow: '1px 1px 1px gray',
    '&:hover': {
      backgroundColor: '#1c244f',
    },
  },
}));

function GameSpeedDialog(props: any) {
  const { onClose, open } = props;
  const userdata = useSelector((state: RootState) => state.profileModule);
  const socket = useSelector((state: RootState) => state.socketModule);
  const dispatch = useDispatch();

  const handleClose = () => {
    onClose();
  };

  const handleListItemClick = (value : string) => {
    console.log(value);
    onClose(value);
    socket?.socket?.emit('matchRequest', {
      receiveUserIndex: userdata.index,
      ballSpeed: value,
    });
    dispatch(pvpQueueGame());
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>SELECT GAME SPEED</DialogTitle>
      <List>
        <ListItem button onClick={() => handleListItemClick('NORMAL')}>
          <ListItemText primary="NORMAL" />
        </ListItem>
        <ListItem button onClick={() => handleListItemClick('FAST')}>
          <ListItemText primary="FAST" />
        </ListItem>
      </List>
    </Dialog>
  );
}

function ViewBoxProfileImage(): JSX.Element {
  const classes = useStyles();
  const dispatch = useDispatch();
  const mydata = useSelector((state: RootState) => state.userModule);
  const userdata = useSelector((state: RootState) => state.profileModule);
  const [follow, setFollow] = useState(false);
  const [open, setOpen] = useState(false);
  const { gamestate } = useSelector((state: RootState) => state.gameStateMoudle);
  const { socket } = useSelector((state: RootState) => state.socketModule);

  const pvpRequestButton = () => {
    if (gamestate !== 'WAIT') {
      alert('이미 게임 중이거나 게임 큐 대기중입니다.');
      return;
    }
    setOpen(true);
  };

  const dialogClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    const isFollow = (mydata.followings
      .find((value: any) => value.nickname === userdata.nickname) !== undefined);
    setFollow(isFollow);
  }, [mydata.followings, userdata.nickname]);

  const clickFollowButton = () => {
    const followForm = {
      followedUser: userdata.username,
    };
    setFollow(true);
    axios.post(`${String(process.env.REACT_APP_API_URL)}/follow`, followForm).then((res) => {
      dispatch(updateUser(res.data));
    }, (err) => {
      console.log(err.response);
      setFollow(false);
    });
  }

  const clickUnfollowButton = () => {
    const followForm = {
      data: {
        followedUser: userdata.username,
      },
    };
    setFollow(false);
    axios.delete(`${String(process.env.REACT_APP_API_URL)}/follow`, followForm).then((res) => {
      dispatch(updateUser(res.data));
    }, (err) => {
      console.log(err.response);
      setFollow(true);
    });
  }

  const observeButton = () => {
    const callback = (payload : any) => {
      if (payload.status === 'GAME_START') {
        dispatch(setGameData(payload));
        dispatch(ingGame());
      }
    };
    socket?.on('matchComplete', callback);
    socket?.emit('observeMatch', {
      // number
      matchInUserIndex: userdata.index,
    });
    return () => {
      socket?.off('matchComplete');
    }
  }
  
  return (
    <>
      <Avatar
        className={classes.profileImage}
        src={userdata.avatar}
      />
      {userdata.nickname !== mydata.nickname && follow && (
      <Button className={classes.unfollowButton} variant="contained" onClick={clickUnfollowButton}>
        Unfollow
      </Button>
      )}
      {userdata.nickname !== mydata.nickname && !follow && (
      <Button className={classes.followButton} variant="contained" onClick={clickFollowButton}>
        Follow
      </Button>
      )}
      {userdata.nickname !== mydata.nickname && userdata.status === 'online' && (
      <Button className={classes.pvpButton} variant="contained" onClick={pvpRequestButton}>
        PVP 신청
      </Button>
      )}
      {userdata.nickname !== mydata.nickname && userdata.status === 'ingame' && (
      <Button className={classes.obButton} variant="contained" onClick={observeButton}>
        관전하기
      </Button>
      )}
      <GameSpeedDialog
        open={open}
        onClose={dialogClose}
      />
    </>
  );
}

export default React.memo(ViewBoxProfileImage);
