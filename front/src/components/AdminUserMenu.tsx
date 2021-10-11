import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MenuIcon from '@material-ui/icons/Menu';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';
import { IconButton, Menu, MenuItem } from '@material-ui/core';
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
      const { data } = await axios.post(
        `/users/admin/${user.username}`,
      );
      const newUsers = await getUsers();
      setUsers(newUsers);
    } catch (err: any) {
      console.log(err.response);
    }
  };

  const onClickAdminRemove = async (e: React.MouseEvent<HTMLLIElement>) => {
    e.preventDefault();
    setMenuAnchor(null);
    try {
      const { data } = await axios.delete(
        `/users/admin/${user.username}`,
      );
      const newUsers = await getUsers();
      setUsers(newUsers);
    } catch (err: any) {
      console.log(err.response);
    }
  };

  const onClickUserBan = async (e: React.MouseEvent<HTMLLIElement>) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `/users/ban/${user.username}`,
      );
      const newUsers = await getUsers();
      setUsers(newUsers);
      const newBanUsers = await getBanUsers();
      setBanUsers(newBanUsers);
    } catch (err: any) {
      console.log(err.response);
    }
    setMenuAnchor(null);
  };

  const onClickUserUnBan = async (e: React.MouseEvent<HTMLLIElement>) => {
    e.preventDefault();
    try {
      const res = await axios.delete(
        `/users/ban/${user.username}`,
      );
      console.log(res);
    } catch (err: any) {
      console.log(err.response);
    }
    setMenuAnchor(null);
  };

  function adminMenu() {
    return (
      <>
        {mydata.role === 'owner' && !isAdmin && (
          <MenuItem onClick={onClickAdminGive}>관리자 등록</MenuItem>
        )}
        {mydata.role === 'owner' && isAdmin && (
          <MenuItem onClick={onClickAdminRemove}>관리자 해제</MenuItem>
        )}
      </>
    );
  }

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
        {isOwner ? null : adminMenu()}
        {isOwner || isAdmin ? null : (
          <MenuItem onClick={onClickUserBan}>유저 추방</MenuItem>
        )}
      </Menu>
    </>
  );
};

export default React.memo(AdminUserMenu);
