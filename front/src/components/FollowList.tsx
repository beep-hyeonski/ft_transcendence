/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import React, { useState } from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import { Menu, MenuItem } from '@material-ui/core';
import ListItemText from '@material-ui/core/ListItemText';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import {
  WbSunnyRounded,
  NightsStayRounded,
  AdbRounded,
} from '@material-ui/icons';
import DrawAvatar from './Avatar';
import { ingGame, settingGame } from '../modules/gamestate';
import { RootState } from '../modules';
import { setGameData } from '../modules/gamedata';

const useStyles = makeStyles(() =>
  createStyles({
    usernameMargin: {
      marginLeft: '10px',
    },
  }),
);

interface StatusIconProps {
  status: string;
}

function StatusIcon({ status }: StatusIconProps): JSX.Element {
  if (status === 'offline') {
    return <NightsStayRounded style={{ color: '#666666' }} />;
  }
  if (status === 'ingame') {
    return <AdbRounded style={{ color: '#DAADFF' }} />;
  }
  return <WbSunnyRounded style={{ color: '#FFFA66' }} />;
}

interface UserdataProps {
  user: {
    username: string;
    nickname: string;
    avatar: string;
    status: string;
    index: number;
  };
}

function FollowList({ user }: UserdataProps): JSX.Element {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  const { gamestate } = useSelector((state: RootState) => state.gameStateMoudle);
  const [menuAnchor, setMenuAnchor] = useState<null | any>(null);
  const menu = Boolean(menuAnchor);
  const { socket } = useSelector((state: RootState) => state.socketModule);

  const onClickFollowUser = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    history.push(`/profile/${user.nickname}`);
  };

  const rightClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setMenuAnchor(e.currentTarget);
  };

  const clickDM = (e: React.MouseEvent<HTMLLIElement>) => {
    e.preventDefault();
    history.push(`/dm/${user.nickname}`);
    setMenuAnchor(null);
    e.stopPropagation();
  };

  const clickPVP = (e: React.MouseEvent<HTMLLIElement>) => {
    e.preventDefault();
    if (gamestate !== 'WAIT') {
      alert('이미 게임 중이거나 게임 큐 대기중입니다.');
      return;
    }
    dispatch(settingGame(true, user.index));
    setMenuAnchor(null);
    e.stopPropagation();
  };

  const clickObserve = (e: React.MouseEvent<HTMLLIElement>) => {
    e.preventDefault();
    setMenuAnchor(null);
    e.stopPropagation();
    const callback = (payload: any) => {
      if (payload.status === 'GAME_START') {
        dispatch(setGameData(payload));
        dispatch(ingGame());
      }
    };
    socket?.on('matchComplete', callback);
    socket?.emit('observeMatch', {
      // number
      matchInUserIndex: user.index,
    });
    return () => {
      socket?.off('matchComplete');
    };
  };


  const onClose = (event: React.MouseEvent<HTMLLIElement>) => {
    setMenuAnchor(null);
    event.stopPropagation();
  };

  return (
    <ListItem
      button
      key={user.nickname}
      onClick={onClickFollowUser}
      onContextMenu={rightClick}
    >
      <DrawAvatar
        type="sideBarImage"
        username={user.nickname}
        src={user.avatar}
        status={user.status}
      />
      <ListItemText
        primary={user.nickname}
        className={classes.usernameMargin}
      />
      <StatusIcon status={user.status} />
      <Menu
        id="menu"
        open={menu}
        anchorEl={menuAnchor}
        getContentAnchorEl={null}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        onClose={onClose}
      >
        <MenuItem onClick={clickDM}>DM</MenuItem>
        {user.status === 'online' && <MenuItem onClick={clickPVP}>PVP 신청</MenuItem>}
        {user.status === 'ingame' && <MenuItem onClick={clickObserve}>관전하기</MenuItem>}
      </Menu>
    </ListItem>
  );
}

export default React.memo(FollowList);
