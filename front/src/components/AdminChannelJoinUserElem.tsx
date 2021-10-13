import React, { useState, useEffect } from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { Avatar } from '@material-ui/core';
import AdminJoinUserMenu from './AdminJoinUserMenu';

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      width: '90%',
      height: '100%',
      padding: '3px',
      margin: '1rem',
      display: 'flex',
      border: '1px solid black',
      borderRadius: '1rem',
      boxShadow: '1px 1px 1px gray',
    },
    image: {
      width: '4rem',
      height: '4rem',
      margin: '1%',
      boxShadow: '1px 1px 1.5px gray',
    },
    username: {
      fontSize: '2rem',
      marginTop: '5%',
      marginLeft: '2%',
      textShadow: '0.5px 0.5px 1px gray',
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

const AdminChannelJoinUserElem = ({
  user,
  chatData,
  setChatData,
}: UserData): JSX.Element => {
  const classes = useStyles();
  const [isOwner, setIsOwner] = useState<boolean>(false);

  useEffect(() => {
    setIsOwner(chatData.ownerUser.username === user.username);
  }, [chatData.ownerUser, user.username]);

  return (
    <div className={classes.root}>
      <Avatar className={classes.image} src={user.avatar} />
      <div className={classes.username}>{user.nickname}</div>
      {!isOwner &&
        <AdminJoinUserMenu
          user={user}
          chatData={chatData}
          setChatData={setChatData}
        />
      }
    </div>
  );
};

export default React.memo(AdminChannelJoinUserElem);
