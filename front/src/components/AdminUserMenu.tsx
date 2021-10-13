import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MenuIcon from '@material-ui/icons/Menu';
import { useHistory } from 'react-router';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';
import { IconButton, Menu, MenuItem, ThemeProvider, unstable_createMuiStrictModeTheme } from '@material-ui/core';
import { getBanUsers, getUsers } from '../utils/Requests';
import { RootState } from '../modules';

const useStyles = makeStyles(() =>
  createStyles({
    menuIconLocation: {
      width: '1rem',
      height: '1rem',
      marginLeft: '26%',
      marginTop: '2.6vh',
      position: 'absolute',
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
  role: string;
}

interface UserData {
  user: UserdataProps;
  setUsers: React.Dispatch<React.SetStateAction<UserdataProps[]>>;
  setBanUsers: React.Dispatch<React.SetStateAction<UserdataProps[]>>;
}

const AdminUserMenu = ({ user, setUsers, setBanUsers }: UserData) => {
  const classes = useStyles();
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [isOwner, setIsOwner] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const mydata = useSelector((state: RootState) => state.userModule);
  const history = useHistory();
  const theme = unstable_createMuiStrictModeTheme();

  useEffect(() => {
    setIsOwner(user.role === 'owner');
    setIsAdmin(user.role === 'admin');
  }, [user]);

  const onClickMenu = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setMenuAnchor(e.currentTarget);
  };

  const onClickAdminGive = async (e: React.MouseEvent<HTMLLIElement>) => {
    e.preventDefault();
    setMenuAnchor(null);
    try {
      await axios.post(`/users/admin/${user.username}`);
      const newUsers = await getUsers();
      setUsers(newUsers);
    } catch (err: any) {
      if (err.response.data.message === 'You are not owner') {
        alert('권한이 없습니다.');
        history.push('/');
      }
      if (err.response.data.message === 'User Not Found') {
        window.location.reload();
      }
    }
  };

  const onClickAdminRemove = async (e: React.MouseEvent<HTMLLIElement>) => {
    e.preventDefault();
    setMenuAnchor(null);
    try {
      await axios.delete(`/users/admin/${user.username}`);
      const newUsers = await getUsers();
      setUsers(newUsers);
    } catch (err: any) {
      if (err.response.data.message === 'You are not owner') {
        alert('권한이 없습니다.');
        history.push('/');
      }
      if (err.response.data.message === 'User Not Found') {
        window.location.reload();
      }
      if (err.response.data.message === 'You cannot unregister admin yourself') {
        window.location.reload();
      }
    }
  };

  const onClickUserBan = async (e: React.MouseEvent<HTMLLIElement>) => {
    e.preventDefault();
    try {
      await axios.post(`/users/ban/${user.username}`);
      const newUsers = await getUsers();
      setUsers(newUsers);
      const newBanUsers = await getBanUsers();
      setBanUsers(newBanUsers);
    } catch (err: any) {
      if (err.response.data.message === 'You are not admin') {
        alert('권한이 없습니다.');
        history.push('/');
      }
      if (err.response.data.message === 'You cannot ban admin or owner') {
        alert('관리할 수 없는 유저입니다.');
      }
    }
    setMenuAnchor(null);
  };

  function adminMenu(): JSX.Element {
    return (
      <div>
        {mydata.role === 'owner' && !isAdmin && (
          <MenuItem onClick={onClickAdminGive}>관리자 등록</MenuItem>
        )}
        {mydata.role === 'owner' && isAdmin && (
          <MenuItem onClick={onClickAdminRemove}>관리자 해제</MenuItem>
        )}
      </div>
    );
  }

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
        {isOwner ? null : adminMenu()}
        {isOwner || isAdmin ? null : (
          <MenuItem onClick={onClickUserBan}>유저 추방</MenuItem>
        )}
      </Menu>
    </ThemeProvider>
  );
};

export default React.memo(AdminUserMenu);
