import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import { Button, InputBase, Modal, IconButton } from '@material-ui/core';
import CancelIcon from '@material-ui/icons/Cancel';
import { joinChatRoom } from '../modules/chat';
import { getUsermeChat } from '../utils/Requests';
import { updateUser } from '../modules/user';
import { logoutSequence } from '../utils/logoutSequence';

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '50rem',
      height: '24rem',
      backgroundColor: '#282E4E',
      borderRadius: '8px',
      boxShadow: '0.5px 0.5px 2px white',
    },
    title: {
      fontSize: '7rem',
      color: '#F4F3FF',
      marginTop: '0.5rem',
      marginLeft: '2rem',
      textShadow: '1px 1px 2px black',
      overflow: 'auto',
    },
    input: {
      marginLeft: '4rem',
      marginTop: '1.5rem',
      width: '80%',
      height: '5rem',
      borderRadius: '8px',
      backgroundColor: 'white',
      paddingLeft: '1.2rem',
      fontSize: '2.5rem',
    },
    button: {
      position: 'absolute',
      marginTop: '9rem',
      right: '2rem',
      width: '18rem',
      height: '4rem',
      fontSize: '20px',
      color: '#282E4E',
      backgroundColor: '#A19BEE',
      '&:hover': {
        backgroundColor: '#8882D5',
      },
      boxShadow: '0.5px 0.5px 3px black',
      textShadow: '1px 1px 1px gray',
    },
    closeButtonLocation: {
      position: 'absolute',
      top: '0.5rem',
      right: '0.5rem',
    },
    closeButton: {
      color: '#f35353',
      fontSize: '35px',
      '&:hover': {
        color: '#DA3A3A',
      },
    },
  }),
);

interface ModalProps {
  modal: {
    index: number;
    open: boolean;
    status: string;
    title: string;
    joinUsers: any[];
    mutedUsers: any[];
    bannedUsers: any[];
    adminUsers: any[];
    ownerUser: string;
  };
  setModal: React.Dispatch<
    React.SetStateAction<{
      index: number;
      open: boolean;
      status: string;
      title: string;
      joinUsers: any[];
      bannedUsers: any[];
      mutedUsers: any[];
      adminUsers: any[];
      ownerUser: string;
    }>
  >;
}

function ChatProtectedModal({ modal, setModal }: ModalProps): JSX.Element {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [password, setPassword] = useState('');

  const onClickCloseButton = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setModal({
      index: -1,
      open: false,
      status: '',
      title: '',
      joinUsers: [],
      bannedUsers: [],
      mutedUsers: [],
      adminUsers: [],
      ownerUser: '',
    });
  };

  const onClickJoinButton = async (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
    try {
      await axios.post(`/chat/${modal.index}/join`, { password });
      dispatch(
        joinChatRoom({
          roomTitle: modal.title,
          roomIndex: modal.index,
          roomJoinedUsers: modal.joinUsers,
          roomStatus: modal.status,
          roomBannedUsers: modal.bannedUsers,
          roomAdmins: modal.adminUsers,
          roomOwner: modal.ownerUser,
          roomMuted: modal.mutedUsers,
        }),
      );
    } catch (error: any) {
      if (error.response.data.message === 'User Banned') {
        alert('채팅방에 참여할 수 없습니다.');
        return;
      }
      if (error.response.data.message === 'Not Found') {
        alert('존재하지 않는 채팅방입니다.');
        return;
      }
      if (
        error.response.data.message === 'Password Required' ||
        error.response.data.message === 'Invalid Password'
      ) {
        setPassword('');
        alert('Wrong password');
        return;
      }
      if (error.response.data.message === 'Already joined user') {
        alert('이미 참여한 채팅방 입니다.');
        setModal({
          index: -1,
          open: false,
          status: '',
          title: '',
          joinUsers: [],
          bannedUsers: [],
          mutedUsers: [],
          adminUsers: [],
          ownerUser: '',
        });
        return;
      }

    }
    try {
      const data = await getUsermeChat();
      dispatch(updateUser(data));
    } catch (error: any) {
      if (error.response.data.message === 'User Not Found') {
        alert('로그인 정보가 유효하지 않습니다. 다시 로그인 해주세요');
        logoutSequence(dispatch);
        window.location.href = '/';
      }
    }
    setPassword('');
    setModal({
      index: -1,
      open: false,
      status: '',
      title: '',
      joinUsers: [],
      bannedUsers: [],
      mutedUsers: [],
      adminUsers: [],
      ownerUser: '',
    });
  };

  const onChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setPassword(e.target.value);
  };

  return (
    <form>
      <Modal
        open={modal.open}
        onClose={() =>
          setModal({
            index: -1,
            open: false,
            status: '',
            title: '',
            joinUsers: [],
            bannedUsers: [],
            mutedUsers: [],
            adminUsers: [],
            ownerUser: '',
          })
        }
      >
        <div className={classes.root}>
          <IconButton
            className={classes.closeButtonLocation}
            onClick={onClickCloseButton}
          >
            <CancelIcon className={classes.closeButton} />
          </IconButton>
          <div className={classes.title}>{modal.title}</div>
          <InputBase
            className={classes.input}
            placeholder="Password"
            inputProps={{ 'aria-label': 'search user' }}
            type="password"
            name="input"
            value={password}
            onChange={onChangeInput}
          />
          <Button
            variant="contained"
            size="large"
            className={classes.button}
            onClick={onClickJoinButton}
          >
            Join this channel
          </Button>
        </div>
      </Modal>
    </form>
  );
}

export default React.memo(ChatProtectedModal);
