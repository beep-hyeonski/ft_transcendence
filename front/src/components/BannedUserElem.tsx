import React from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import { Avatar, Button } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../modules';
import { joinChatRoom } from '../modules/chat';

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      width: '22rem',
      height: '5rem',
      margin: '1rem',
      display: 'flex',
      border: '1px solid black',
      borderRadius: '1rem',
      boxShadow: '1px 1px 1px gray',
      backgroundColor: '#3f446e',
      color: '#F4F3FF',
    },
    image: {
      width: '4rem',
      height: '4rem',
      marginTop: '0.5rem',
      marginLeft: '0.5rem',
      boxShadow: '1px 1px 1.5px gray',
    },
    username: {
      fontSize: '2rem',
      marginTop: '18px',
      marginLeft: '1rem',
      textShadow: '1px 1px 1px white',
    },
    unblockedButton: {
      position: 'absolute',
      marginTop: '2.6rem',
      marginLeft: '19rem',
      fontSize: '1rem',
      fontStyle: 'border',
      transform: 'translate(-50%, -50%)',
      border: '2px solid black',
      borderRadius: '6px',
      backgroundColor: '#CE6F84',
      '&:hover': {
        backgroundColor: '#cc6b80',
      },
    },
  }),
);

interface UserdataProps {
  avatar: string;
  index: number;
  nickname: string;
  status: string;
  username: string;
}

interface UserData {
  user: UserdataProps;
}

const BannedUserElem = ({ user }: UserData): JSX.Element => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const chatData = useSelector((state: RootState) => state.chatModule);

  const UnBanButton = async () => {
    try {
      const res = await axios.delete(`/chat/${chatData.index}/ban`, {
        data: { username: user.username },
      });
      dispatch(
        joinChatRoom({
          roomTitle: res.data.title,
          roomIndex: res.data.index,
          roomBannedUsers: res.data.bannedUsers,
          roomStatus: res.data.status,
          roomJoinedUsers: chatData.joinUsers,
          roomAdmins: chatData.adminUsers,
          roomMuted: chatData.mutedUsers,
          roomOwner: chatData.ownerUser,
        }),
      );
    } catch (err: any) {
      if (err.response.data.message === 'User have not been banned') {
        alert('추방되지 않은 유저는 추방할 수 없습니다.');
      }
      if (err.response.data.message === 'Permission Denied') {
        alert('권한이 없습니다.');
      }
      if (err.response.data.message === 'Not Found') {
        alert('존재하지 않습니다.');
      }
    }
  };

  return (
    <div className={classes.root}>
      <Avatar className={classes.image} src={user.avatar} />
      <div className={classes.username}>{user.nickname}</div>
      <Button className={classes.unblockedButton} onClick={UnBanButton}>
        추방 해제
      </Button>
    </div>
  );
};

export default React.memo(BannedUserElem);
