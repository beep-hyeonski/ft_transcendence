import React from 'react';
import MenuIcon from '@material-ui/icons/Menu';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { IconButton, Menu, MenuItem } from '@material-ui/core';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../modules';
import { joinChatRoom } from '../modules/chat';

const useStyles = makeStyles(() => createStyles({
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
}));

interface UserdataProps {
  avatar: string,
  index: number,
  nickname: string,
  status: string,
}

interface UserData {
  user: UserdataProps
}

const JoinedUserMenu = ({ user }: UserData) => {
  const classes = useStyles();
  const chatData = useSelector((state: RootState) => state.chatModule);
  const dispatch = useDispatch();
  const [menuAnchor, setMenuAnchor] = React.useState<null | HTMLElement>(null);

  const onClickAddAdmin = async (e: React.MouseEvent<HTMLLIElement>) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `${String(process.env.REACT_APP_API_URL)}/chat/${chatData.index}/admin`,
        { nickname: user.nickname },
      );
      dispatch(joinChatRoom({
        roomIndex: data.index,
        roomTitle: data.title,
        roomPassword: data.password,
        roomStatus: data.status,
        roomJoinedUsers: data.joinUsers,
        roomAdmins: data.adminUsers,
        roomMuted: chatData.mutedUsers,
        roomOwner: chatData.ownerUser,
      }));
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
      dispatch(joinChatRoom({
        roomIndex: data.index,
        roomTitle: data.title,
        roomPassword: data.password,
        roomStatus: data.status,
        roomJoinedUsers: data.joinUsers,
        roomAdmins: data.adminUsers,
        roomMuted: chatData.mutedUsers,
        roomOwner: chatData.ownerUser,
      }));
      setMenuAnchor(null);
    } catch (error: any) {
      console.log(error.response);
    }
  };

  // adminUsers: [{…}]
  // createdAt: "2021-09-18T03:34:07.380Z"
  // index: 2
  // joinUsers: (3) [{…}, {…}, {…}]
  // mutedUsers: [{…}]
  // ownerUser: {index: 1, username: "joockim", nickname: "skamo", email: "joochan123123@gmail.com", avatar: "https://www.codeproject.com/KB/GDI-plus/ImageProcessing2/img.jpg", …}
  // password: ""
  // status: "public"
  // title: "testChannel"

  const onClickMuteUser = async (e: React.MouseEvent<HTMLLIElement>) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `${String(process.env.REACT_APP_API_URL)}/chat/${chatData.index}/mute`,
        { nickname: user.nickname },
      );
      dispatch(joinChatRoom({
        roomIndex: data.index,
        roomTitle: data.title,
        roomPassword: data.password,
        roomStatus: data.status,
        roomJoinedUsers: data.joinUsers,
        roomAdmins: data.adminUsers,
        roomMuted: data.mutedUsers,
        roomOwner: chatData.ownerUser,
      }));
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
      dispatch(joinChatRoom({
        roomIndex: data.index,
        roomTitle: data.title,
        roomPassword: data.password,
        roomStatus: data.status,
        roomJoinedUsers: data.joinUsers,
        roomAdmins: data.adminUsers,
        roomMuted: data.mutedUsers,
        roomOwner: chatData.ownerUser,
      }));
      setMenuAnchor(null);
    } catch (error: any) {
      console.log(error.response);
    }
  };

  return (
    <>
      <IconButton
        className={classes.menuIconLocation}
        onClick={(event: React.MouseEvent<HTMLElement>) => setMenuAnchor(event.currentTarget)}
      >
        <MenuIcon className={classes.menuIcon} />
      </IconButton>
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={() => setMenuAnchor(null)}
      >
        <MenuItem onClick={onClickAddAdmin}>관리자 권한 부여 </MenuItem>
        <MenuItem onClick={onClickDeleteAdmin}>관리자 권한 해제</MenuItem>
        <MenuItem onClick={onClickMuteUser}>채팅 금지</MenuItem>
        <MenuItem onClick={onClickUnMuteUser}>채팅 금지 해제</MenuItem>
      </Menu>
    </>
  );
};

export default React.memo(JoinedUserMenu);
