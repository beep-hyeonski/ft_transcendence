import React, { useEffect, useState } from 'react';
import MenuIcon from '@material-ui/icons/Menu';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { IconButton, Menu, MenuItem } from '@material-ui/core';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../modules';
import { joinChatRoom } from '../modules/chat';
import { changeSideBar, FOLLOW } from '../modules/sidebar';
import { ingGame, settingGame } from '../modules/gamestate';
import { setGameData } from '../modules/gamedata';

const useStyles = makeStyles(() =>
  createStyles({
    menuIconLocation: {
      width: '1rem',
      height: '1rem',
      position: 'absolute',
      marginTop: '1.8rem',
      marginLeft: '19.2rem',
    },
    menuIcon: {
      fontSize: '2rem',
      color: 'black',
    },
  }),
);

interface UserdataProps {
  avatar: string;
  index: number;
  nickname: string;
  username: string;
  status: string;
}

interface UserData {
  user: UserdataProps;
  isOwner: boolean;
  isManager: boolean;
}

const JoinedUserMenu = ({ user, isOwner, isManager }: UserData) => {
  const classes = useStyles();
  const chatData = useSelector((state: RootState) => state.chatModule);
  const mydata = useSelector((state: RootState) => state.userModule);
  const { gamestate } = useSelector(
    (state: RootState) => state.gameStateMoudle,
  );
  const { socket } = useSelector((state: RootState) => state.socketModule);
  const dispatch = useDispatch();
  const history = useHistory();
  const [menuAnchor, setMenuAnchor] = React.useState<null | HTMLElement>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const onClickAddAdmin = async (e: React.MouseEvent<HTMLLIElement>) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`/chat/${chatData.index}/admin`, {
        username: user.username,
      });
      dispatch(
        joinChatRoom({
          roomIndex: data.index,
          roomTitle: data.title,
          roomStatus: data.status,
          roomJoinedUsers: data.joinUsers,
          roomBannedUsers: chatData.bannedUsers,
          roomAdmins: data.adminUsers,
          roomMuted: chatData.mutedUsers,
          roomOwner: chatData.ownerUser,
        }),
      );
      setMenuAnchor(null);
    } catch (error: any) {
      if (error.response.data.message === 'User is not in the chat') {
        alert('채팅방에 참여하지 않은 유저입니다.');
        window.location.reload();
      }
      if (error.response.data.message === 'User is already admin') {
        alert('조작할 수 없는 유저입니다.');
        window.location.reload();
      }
      if (error.response.data.message === 'Permission Denied') {
        alert('권한이 없습니다.');
        window.location.reload();
      }
      if (error.response.data.message === 'Not Found') {
        alert('존재하지 않습니다.');
        window.location.reload();
      }
    }
  };

  const onClickDeleteAdmin = async (e: React.MouseEvent<HTMLLIElement>) => {
    e.preventDefault();
    try {
      const { data } = await axios.delete(`/chat/${chatData.index}/admin`, {
        data: { username: user.username },
      });
      dispatch(
        joinChatRoom({
          roomIndex: data.index,
          roomTitle: data.title,
          roomStatus: data.status,
          roomJoinedUsers: data.joinUsers,
          roomBannedUsers: chatData.bannedUsers,
          roomAdmins: data.adminUsers,
          roomMuted: chatData.mutedUsers,
          roomOwner: chatData.ownerUser,
        }),
      );
      setMenuAnchor(null);
    } catch (error: any) {
      if (error.response.data.message === 'User is not admin') {
        alert('관리자가 아닌 유저입니다.');
      }
      if (
        error.response.data.message === 'Owner cannot be removed from admin'
      ) {
        alert('오너 유저는 권한 제거가 불가능 합니다.');
      }
      if (error.response.data.message === 'Permission Denied') {
        alert('권한이 없습니다.');
        window.location.reload();
      }
      if (error.response.data.message === 'Not Found') {
        alert('존재하지 않습니다.');
        window.location.reload();
      }
    }
  };

  const onClickMuteUser = async (e: React.MouseEvent<HTMLLIElement>) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`/chat/${chatData.index}/mute`, {
        username: user.username,
      });
      dispatch(
        joinChatRoom({
          roomIndex: data.index,
          roomTitle: data.title,
          roomStatus: data.status,
          roomJoinedUsers: data.joinUsers,
          roomBannedUsers: chatData.bannedUsers,
          roomAdmins: data.adminUsers,
          roomMuted: data.mutedUsers,
          roomOwner: chatData.ownerUser,
        }),
      );
      setMenuAnchor(null);
    } catch (error: any) {
      if (error.response.data.message === 'Impossible to mute owner or admin') {
        alert('관리자는 채팅 금지할 수 없습니다.');
      }
      if (error.response.data.message === 'User have already been muted') {
        alert('이미 채팅이 금지된 유저입니다.');
      }
      if (error.response.data.message === 'User is not in the chat') {
        alert('채팅방에 있지 않은 유저입니다.');
      }
      if (error.response.data.message === 'Permission Denied') {
        alert('권한이 없습니다.');
      }
      if (error.response.data.message === 'Not Found') {
        alert('존재하지 않습니다.');
      }
    }
  };

  const onClickUnMuteUser = async (e: React.MouseEvent<HTMLLIElement>) => {
    e.preventDefault();
    try {
      const { data } = await axios.delete(`/chat/${chatData.index}/mute`, {
        data: { username: user.username },
      });
      dispatch(
        joinChatRoom({
          roomIndex: data.index,
          roomTitle: data.title,
          roomStatus: data.status,
          roomJoinedUsers: data.joinUsers,
          roomBannedUsers: chatData.bannedUsers,
          roomAdmins: data.adminUsers,
          roomMuted: data.mutedUsers,
          roomOwner: chatData.ownerUser,
        }),
      );
      setMenuAnchor(null);
    } catch (error: any) {
      if (error.response.data.message === 'User have not been muted') {
        alert('채팅 금지되어있지 않은 유저입니다.');
      }
      if (error.response.data.message === 'Permission Denied') {
        alert('권한이 없습니다.');
      }
      if (error.response.data.message === 'Not Found') {
        alert('존재하지 않습니다.');
      }
    }
  };

  const onClickMenu = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setMenuAnchor(e.currentTarget);
  };

  useEffect(() => {
    const adminUser = chatData.adminUsers?.find(
      (admin: any) => admin.username === user.username,
    );
    setIsAdmin(adminUser !== undefined);
    const mutedUser = chatData.mutedUsers?.find(
      (muted: any) => muted.username === user.username,
    );
    setIsMuted(mutedUser !== undefined);
  }, [chatData.adminUsers, chatData.mutedUsers, menuAnchor, user.username]);

  function adminMenu(): JSX.Element {
    if (isAdmin) {
      return <MenuItem onClick={onClickDeleteAdmin}>관리자 권한 해제</MenuItem>;
    }
    return <MenuItem onClick={onClickAddAdmin}>관리자 권한 부여 </MenuItem>;
  }

  function muteMenu(): JSX.Element {
    if (isMuted) {
      return <MenuItem onClick={onClickUnMuteUser}>채팅 금지 해제</MenuItem>;
    }
    return <MenuItem onClick={onClickMuteUser}>채팅 금지</MenuItem>;
  }

  const onClickProfile = () => {
    dispatch(changeSideBar({ type: FOLLOW }));
    history.push(`/profile/?username=${user.username}`);
  };

  const onClickBan = async (e: React.MouseEvent<HTMLLIElement>) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`/chat/${chatData.index}/ban`, {
        username: user.username,
      });
      dispatch(
        joinChatRoom({
          roomTitle: data.title,
          roomIndex: data.index,
          roomStatus: data.status,
          roomJoinedUsers: data.joinUsers,
          roomBannedUsers: data.bannedUsers,
          roomAdmins: data.adminUsers,
          roomMuted: data.mutedUsers,
          roomOwner: data.ownerUser.username,
        }),
      );
    } catch (error: any) {
      if (error.response.data.message === 'Impossible to ban owner or admin') {
        alert('관리자는 추방할 수 없습니다.');
      }
      if (error.response.data.message === 'User have already been banned') {
        alert('이미 추방된 유저입니다.');
      }
      if (error.response.data.message === 'User is not in the chat') {
        alert('채팅방에 있지 않은 유저입니다.');
      }
      if (error.response.data.message === 'Permission Denied') {
        alert('권한이 없습니다.');
      }
      if (error.response.data.message === 'Not Found') {
        alert('존재하지 않습니다.');
      }
    }
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

    socket?.on('matchComplete', (payload: any) => {
      if (payload.status === 'GAME_START') {
        dispatch(setGameData(payload));
        dispatch(ingGame());
      }
    });
    socket?.emit('observeMatch', {
      matchInUserIndex: user.index,
    });
    return () => {
      socket?.off('matchComplete');
    };
  };

  return (
    <>
      <IconButton className={classes.menuIconLocation} onClick={onClickMenu}>
        <MenuIcon className={classes.menuIcon} />
      </IconButton>
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={() => setMenuAnchor(null)}
      >
        <MenuItem onClick={onClickProfile}>프로필 보기</MenuItem>
        {user.username !== mydata.username &&
          gamestate === 'WAIT' &&
          user.status === 'online' && (
            <MenuItem onClick={clickPVP}>PVP 신청</MenuItem>
          )}
        {user.username !== mydata.username &&
          gamestate === 'WAIT' &&
          user.status === 'ingame' && (
            <MenuItem onClick={clickObserve}>관전하기</MenuItem>
          )}
        {isOwner && chatData.ownerUser !== user.username ? adminMenu() : null}
        {chatData.ownerUser !== user.username && !isAdmin && isManager
          ? muteMenu()
          : null}
        {isManager && chatData.ownerUser !== user.username && !isAdmin ? (
          <MenuItem onClick={onClickBan}>유저 추방</MenuItem>
        ) : null}
      </Menu>
    </>
  );
};

export default React.memo(JoinedUserMenu);
