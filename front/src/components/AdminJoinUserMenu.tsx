import React, { useEffect, useState } from 'react';
import MenuIcon from '@material-ui/icons/Menu';
import axios from 'axios';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import {
  IconButton,
  Menu,
  MenuItem,
  ThemeProvider,
  unstable_createMuiStrictModeTheme,
} from '@material-ui/core';

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
    username: string;
  };
  mutedUsers: string[];
}

interface UserdataProps {
  avatar: string;
  index: number;
  nickname: string;
  username: string;
  status: string;
}

interface UserData {
  user: UserdataProps;
  chatData: ChatDataProps;
  setChatData: React.Dispatch<React.SetStateAction<ChatDataProps>>;
}

const AdminJoinUserMenu = ({
  user,
  chatData,
  setChatData,
}: UserData) => {
  const classes = useStyles();
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const theme = unstable_createMuiStrictModeTheme();

  useEffect(() => {
    const adminUser = chatData.adminUsers.find(
      (admin: any) => admin.username === user.username,
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
      const { data } = await axios.post(`/chat/${chatData.index}/admin`, {
        username: user.username,
      });
      setChatData(data);
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
    setMenuAnchor(null);
  };

  const onClickDeleteAdmin = async (e: React.MouseEvent<HTMLLIElement>) => {
    e.preventDefault();
    try {
      const { data } = await axios.delete(`/chat/${chatData.index}/admin`, {
        data: { username: user.username },
      });
      setChatData(data);
    } catch (error: any) {
      if (error.response.data.message === 'User is not admin') {
        alert('관리자가 아닌 유저입니다.');
      }
      if (error.response.data.message === 'Owner cannot be removed from admin') {
        alert('오너 유저는 권한 제거가 불가능 합니다.');
      }
      if (error.response.data.message === 'Permission Denied') {
        alert('권한이 없습니다.');
      }
      if (error.response.data.message === 'Not Found') {
        alert('존재하지 않습니다.');
      }
    }
    setMenuAnchor(null);
  };

  return (
    <ThemeProvider theme={theme}>
      <IconButton className={classes.menuIconLocation} onClick={onClickMenu}>
        <MenuIcon className={classes.menuIcon} />
      </IconButton>
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={() => setMenuAnchor(null)}
      >
        {!isAdmin && (
          <MenuItem onClick={onClickAddAdmin}>채널 관리자 권한 부여</MenuItem>
        )}
        {isAdmin && (
          <MenuItem onClick={onClickDeleteAdmin}>
            채널 관리자 권한 해제
          </MenuItem>
        )}
      </Menu>
    </ThemeProvider>
  );
};

export default React.memo(AdminJoinUserMenu);
