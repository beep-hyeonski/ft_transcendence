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
  const dispatch = useDispatch();
  const history = useHistory();
  const [menuAnchor, setMenuAnchor] = React.useState<null | HTMLElement>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const onClickAddAdmin = async (e: React.MouseEvent<HTMLLIElement>) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `${String(process.env.REACT_APP_API_URL)}/chat/${chatData.index}/admin`,
        { nickname: user.nickname },
      );
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
      console.log(error.response);
    }
  };

  const onClickDeleteAdmin = async (e: React.MouseEvent<HTMLLIElement>) => {
    e.preventDefault();
    try {
      const { data } = await axios.delete(
        `${String(process.env.REACT_APP_API_URL)}/chat/${chatData.index}/admin`,
        { data: { nickname: user.nickname } },
      );
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
      console.log(error.response);
    }
  };

  const onClickMuteUser = async (e: React.MouseEvent<HTMLLIElement>) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `${String(process.env.REACT_APP_API_URL)}/chat/${chatData.index}/mute`,
        { nickname: user.nickname },
      );
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
      console.log(error.response);
    }
  };

  const onClickUnMuteUser = async (e: React.MouseEvent<HTMLLIElement>) => {
    e.preventDefault();
    try {
      const { data } = await axios.delete(
        `${String(process.env.REACT_APP_API_URL)}/chat/${chatData.index}/mute`,
        { data: { nickname: user.nickname } },
      );
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
      console.log(error.response);
    }
  };

  const onClickMenu = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setMenuAnchor(e.currentTarget);
  };

  useEffect(() => {
    const adminUser = chatData.adminUsers?.find(
      (admin: any) => admin.nickname === user.nickname,
    );
    setIsAdmin(adminUser === undefined);
    const mutedUser = chatData.mutedUsers?.find(
      (muted: any) => muted.nickname === user.nickname,
    );
    setIsMuted(mutedUser === undefined);
  }, [chatData.adminUsers, chatData.mutedUsers, menuAnchor, user.nickname]);

  function adminMenu() {
    if (isAdmin) {
      return <MenuItem onClick={onClickAddAdmin}>관리자 권한 부여 </MenuItem>;
    }
    return <MenuItem onClick={onClickDeleteAdmin}>관리자 권한 해제</MenuItem>;
  }

  function muteMenu() {
    if (isMuted) {
      return <MenuItem onClick={onClickMuteUser}>채팅 금지</MenuItem>;
    }
    return <MenuItem onClick={onClickUnMuteUser}>채팅 금지 해제</MenuItem>;
  }

  const onClickProfile = () => {
    dispatch(changeSideBar({ type: FOLLOW }));
    history.push(`/profile/${user.nickname}`);
  };

  const onClickBan = async (e: React.MouseEvent<HTMLLIElement>) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${String(process.env.REACT_APP_API_URL)}/chat/${chatData.index}/ban`,
      {nickname: user.nickname}
      )
      dispatch(joinChatRoom({
        roomTitle: data.title,
        roomIndex: data.index,
        roomStatus: data.status,
        roomJoinedUsers: data.joinUsers,
        roomBannedUsers: data.bannedUsers,
        roomAdmins: data.adminUsers,
        roomMuted: data.mutedUsers,
        roomOwner: data.ownerUser.nickname,
      }));
    } catch (error: any) {
      console.log(error.response);
    }
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
        {isOwner && chatData.ownerUser !== user.nickname ? adminMenu() : null}
        {chatData.ownerUser !== user.nickname && isAdmin && isManager
          ? muteMenu()
          : null}
        {isOwner && chatData.ownerUser !== user.nickname && isAdmin && isManager ?
        <MenuItem onClick={onClickBan}>유저 추방</MenuItem> : null}
      </Menu>
    </>
  );
};

export default React.memo(JoinedUserMenu);
