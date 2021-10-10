import React, { useEffect, useState } from 'react';
import MenuIcon from '@material-ui/icons/Menu';
import axios from 'axios';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { IconButton, Menu, MenuItem } from '@material-ui/core';
import { BannedUserHandler } from '../utils/errorHandler';

const useStyles = makeStyles(() =>
  createStyles({
    menuIconLocation: {
      width: '1rem',
      height: '1rem',
			position: 'absolute',
			right: '10%',
			marginTop: '2.5vh',
    },
    menuIcon: {
      fontSize: '2rem',
      color: 'black',
    },
  }),
);

interface ChatDataProps {
  index: number;
  title: string;
  status: string;
  joinUsers: any[];
  bannedUsers: any[];
  adminUsers: string[];
  ownerUser: {
    nickname: string;
  }
  mutedUsers: string[];
};

interface UserdataProps {
  avatar: string;
  index: number;
  nickname: string;
  status: string;
}

interface UserData {
  user: UserdataProps;
  isOwner: boolean;
  chatData: ChatDataProps;
  setChatData: React.Dispatch<React.SetStateAction<ChatDataProps>>;
}

const AdminJoinUserMenu = ({ user, isOwner, chatData, setChatData }: UserData) => {
  const classes = useStyles();
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    const adminUser = chatData.adminUsers.find(
      (admin: any) => admin.nickname === user.nickname,
    );
    setIsAdmin(adminUser !== undefined);
  }, [chatData.adminUsers, user, menuAnchor]);

  const onClickMenu = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setMenuAnchor(e.currentTarget);
  };

	const onClickAddAdmin = async (e: React.MouseEvent<HTMLLIElement>) => {
		e.preventDefault();
    try {
      const { data } = await axios.post(
        `${String(process.env.REACT_APP_API_URL)}/chat/${chatData.index}/admin`,
        { nickname: user.nickname },
      );
      setChatData(data);
    } catch (error: any) {
      console.log(error.response);
      if (error.response.data.message === 'User is Banned') {
        BannedUserHandler();
      }
    }
    setMenuAnchor(null);
	};

  const onClickDeleteAdmin = async (e: React.MouseEvent<HTMLLIElement>) => {
		e.preventDefault();
    try {
      const { data } = await axios.delete(
        `${String(process.env.REACT_APP_API_URL)}/chat/${chatData.index}/admin`,
        { data: { nickname: user.nickname } },
      );
      setChatData(data);
    } catch (error: any) {
      console.log(error.response);
      if (error.response.data.message === 'User is Banned') {
        BannedUserHandler();
      }
    }
    setMenuAnchor(null);
	};

  function adminMenu() {
    return (
      <>
        {!isAdmin && <MenuItem onClick={onClickAddAdmin}>채널 관리자 권한 부여</MenuItem>}
        {isAdmin && <MenuItem onClick={onClickDeleteAdmin}>채널 관리자 권한 해제</MenuItem>}
      </>
    )
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
        {!isOwner && adminMenu()}
      </Menu>
    </>
  );
};

export default React.memo(AdminJoinUserMenu);
