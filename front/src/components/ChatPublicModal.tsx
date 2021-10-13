import React from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { Button, Modal, Drawer, ImageList, IconButton } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import CancelIcon from '@material-ui/icons/Cancel';
import axios from 'axios';
import ChatJoinedUser from './ChatJoinedUser';
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
      width: '80rem',
      height: '45rem',
      backgroundColor: '#282E4E',
      borderRadius: '5px',
      boxShadow: '0.5px 0.5px 2px white',
    },
    title: {
      fontSize: '7rem',
      color: '#F4F3FF',
      marginTop: '1rem',
      marginLeft: '3rem',
      textShadow: '1px 1px 2px black',
      overflow: 'auto',
    },
    content: {
      marginTop: '1rem',
      marginLeft: '3rem',
      width: '74rem',
      height: '23rem',
      backgroundColor: 'inherit',
    },
    button: {
      position: 'absolute',
      marginTop: '4rem',
      right: '3rem',
      width: '20rem',
      height: '4.5rem',
      fontSize: '25px',
      color: '#282E4E',
      backgroundColor: '#A19BEE',
      '&:hover': {
        backgroundColor: '#8882D5',
      },
      boxShadow: '0.5px 0.5px 3px black',
      textShadow: '1px 1px 1px gray',
    },
    drawerPaper: {
      marginTop: '10rem',
      marginLeft: '3rem',
      width: '74rem',
      height: '23rem',
      backgroundColor: '#F4F3FF',
      borderRadius: '3px',
      boxShadow: '1.5px 1.5px 2px black',
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
    bannedUsers: any[];
    mutedUsers: any[];
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

function ChatPublicModal({ modal, setModal }: ModalProps): JSX.Element {
  const classes = useStyles();
  const dispatch = useDispatch();

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
    // 클릭 시 해당 채팅 채널로 이동
    try {
      await axios.post(`/chat/${modal.index}/join`);
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

    // 참여중인 채팅방일 경우 이동만. 아닐 경우 추가 후 이동
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

  return (
    <div>
      <Modal
        open={modal.open}
        onClose={() =>
          setModal({
            index: -1,
            open: false,
            status: '',
            title: '',
            bannedUsers: [],
            joinUsers: [],
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
          <Drawer
            classes={{ paper: classes.drawerPaper }}
            className={classes.content}
            variant="permanent"
          >
            <ImageList>
              {modal.joinUsers.map((user) => (
                <ChatJoinedUser
                  key={user.index}
                  user={user}
                  isInRoom={false}
                  isOwner={false}
                  isManager={false}
                />
              ))}
            </ImageList>
          </Drawer>
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
    </div>
  );
}

export default React.memo(ChatPublicModal);
