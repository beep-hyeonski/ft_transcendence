import React, { useState } from 'react';
import { ThemeProvider, createStyles, makeStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import {
  WbSunnyRounded,
  NightsStayRounded,
  AdbRounded,
  Clear,
} from '@material-ui/icons';
import { Menu, MenuItem, unstable_createMuiStrictModeTheme } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import ListItemText from '@material-ui/core/ListItemText';
import DrawAvatar from './Avatar';
import { changeSideBar, FOLLOW } from '../modules/sidebar';
import { ingGame, settingGame } from '../modules/gamestate';
import { RootState } from '../modules';
import { setGameData, IGameDataProps } from '../modules/gamedata';

const useStyles = makeStyles(() =>
  createStyles({
    usernameMargin: {
      marginLeft: '10px',
    },
  }),
);

interface UserdataProps {
  user: {
    avatar: string;
    createdAt: string;
    defeat: number;
    email: string;
    index: number;
    isBanned: boolean;
    nickname: string;
    role: string;
    score: number;
    status: string;
    twoFAToken: string;
    useTwoFA: boolean;
    username: string;
    victory: number;
  };
}

interface StatusIconProps {
  status: string;
  isBanned: boolean;
}

function StatusIcon({ status, isBanned }: StatusIconProps): JSX.Element {
  if (isBanned) {
    return <Clear style={{ color: 'red' }} />;
  }
  if (status === 'offline') {
    return <NightsStayRounded style={{ color: '#666666' }} />;
  }
  if (status === 'ingame') {
    return <AdbRounded style={{ color: '#DAADFF' }} />;
  }
  return <WbSunnyRounded style={{ color: '#FFFA66' }} />;
}

function LobyUserList({ user }: UserdataProps): JSX.Element {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const [menuAnchor, setMenuAnchor] = useState<null | any>(null);
  const { gamestate } = useSelector(
    (state: RootState) => state.gameStateMoudle,
  );
  const { socket } = useSelector((state: RootState) => state.socketModule);
  const theme = unstable_createMuiStrictModeTheme();

  const onClickLobyUser = () => {
    dispatch(changeSideBar({ type: FOLLOW }));
    history.push(`/profile/?username=${user.username}`);
  };

  const rightClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setMenuAnchor(e.currentTarget);
  };

  const clickDM = (e: React.MouseEvent<HTMLLIElement>) => {
    e.preventDefault();
    history.push(`/dm/${user.username}`);
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

    socket?.on('matchComplete', (payload: IGameDataProps) => {
      if (payload.status === 'GAME_START') {
        dispatch(setGameData(payload));
        dispatch(ingGame());
      }
    });
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
    <ThemeProvider theme={theme}>
      <ListItem
        button
        key={user.username}
        onClick={onClickLobyUser}
        onContextMenu={rightClick}
      >
        <DrawAvatar
          type="sideBarImage"
          username={user.username}
          src={user.avatar}
          status={user.status}
          nickname={user.nickname}
        />
        <ListItemText
          primary={user.nickname}
          className={classes.usernameMargin}
        />
        <StatusIcon status={user.status} isBanned={user.isBanned} />
        {!user.isBanned && (
          <Menu
            id="menu"
            open={Boolean(menuAnchor)}
            anchorEl={menuAnchor}
            getContentAnchorEl={null}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            onClose={onClose}
          >
            <MenuItem onClick={clickDM}>DM</MenuItem>
            {gamestate === 'WAIT' && user.status === 'online' && (
              <MenuItem onClick={clickPVP}>PVP 신청</MenuItem>
            )}
            {gamestate === 'WAIT' && user.status === 'ingame' && (
              <MenuItem onClick={clickObserve}>관전하기</MenuItem>
            )}
          </Menu>
        )}
      </ListItem>
    </ThemeProvider>
  );
}

export default React.memo(LobyUserList);
