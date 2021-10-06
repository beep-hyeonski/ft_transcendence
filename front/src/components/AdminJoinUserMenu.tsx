import React from 'react';
import MenuIcon from '@material-ui/icons/Menu';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { IconButton, Menu, MenuItem } from '@material-ui/core';

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

interface UserdataProps {
  avatar: string;
  index: number;
  nickname: string;
  status: string;
}

interface UserData {
  user: UserdataProps;
}

const AdminJoinUserMenu = ({ user }: UserData) => {
  const classes = useStyles();
  const [menuAnchor, setMenuAnchor] = React.useState<null | HTMLElement>(null);

  const onClickMenu = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setMenuAnchor(e.currentTarget);
  };

	const onClickProfile = (e: React.MouseEvent<HTMLLIElement>) => {
		e.preventDefault();
		console.log('test');
		console.log(user);
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
      </Menu>
    </>
  );
};

export default React.memo(AdminJoinUserMenu);
