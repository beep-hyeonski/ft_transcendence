/* eslint-disable @typescript-eslint/no-unsafe-call */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { Modal, Button, IconButton, List } from '@material-ui/core';
import CancelIcon from '@material-ui/icons/Cancel';
import { getChatInfo, getChats } from '../utils/Requests';
import ChattingList from './ChattingList';
import AdminChannelJoinUserElem from './AdminChannelJoinUserElem';

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '90%',
      height: '90%',
      backgroundColor: '#282E4E',
      borderRadius: '5px',
      boxShadow: '0.5px 0.5px 2px white',
    },
    title: {
      fontSize: '7rem',
      color: '#F4F3FF',
      marginLeft: '3rem',
      textShadow: '1px 1px 2px black',
    },
    paper: {
      position: 'absolute',
      transform: 'translate(-50%, -50%)',
      top: '50%',
      left: '50%',
      width: '95%',
      height: '70%',
      backgroundColor: '#F4F3FF',
      display: 'flex',
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
    messageList: {
      width: '75%',
      overflow: 'auto',
      display: 'flex',
      flexDirection: 'column-reverse',
    },
    userList: {
      width: '25%',
      overflow: 'auto',
      borderLeft: '2px solid gray',
    },
    button: {
      position: 'absolute',
      top: '88%',
      right: '2rem',
      width: '20rem',
      height: '4.5rem',
      fontSize: '25px',
      color: '#F4F3FF',
      backgroundColor: '#CE6F84',
      '&:hover': {
        backgroundColor: '#cc6b80',
      },
      boxShadow: '1px 1px 1px gray',
      textShadow: '1px 1px 0.5px gray',
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

interface MessageProps {
  timestamp: Date;
  sendUser: {
    username: string;
    nickname: string;
    avatar: string;
  };
  messageContent: string;
}

interface ChatInfoProps {
  index: number;
  status: string;
  title: string;
  joinUsers: any[];
}

interface AdminChannelModalProps {
  chatModal: {
    open: boolean;
    chatIndex: number;
  };
  setModal: React.Dispatch<
    React.SetStateAction<{
      open: boolean;
      chatIndex: number;
    }>
  >;
  setChats: React.Dispatch<React.SetStateAction<ChatInfoProps[]>>;
}

function AdminChannelModal({
  chatModal,
  setModal,
  setChats,
}: AdminChannelModalProps): JSX.Element {
  const classes = useStyles();
  const [messages, setMsg] = useState<MessageProps[]>([]);
  const [chatData, setChatData] = useState<ChatDataProps>({
    index: 0,
    title: '',
    status: '',
    joinUsers: [],
    bannedUsers: [],
    adminUsers: [],
    ownerUser: {
      nickname: '',
      username: '',
    },
    mutedUsers: [],
  });

  useEffect(() => {
    let isSubscribed = true;
    if (chatModal.open) {
      (async () => {
        try {
          const res = await getChatInfo(chatModal.chatIndex)
          if (isSubscribed) setChatData(res);
        } catch (err: any) {
          if (err.response.data.message === 'Not Found') {
            alert('존재하지 않는 채팅방입니다.');
            window.location.reload();
          }
        }

        try {
          const { data } = await axios.get(
            `/chat/${chatModal.chatIndex}/messages`,
          );
          const msgs = data.map((message: any) => ({
            timestamp: new Date(message.createdAt),
            sendUser: {
              username: message.sendUser.username,
              nickname: message.sendUser.nickname,
              avatar: message.sendUser.avatar,
            },
            messageContent: message.messageContent,
          }));
          if (isSubscribed) setMsg(msgs);
        } catch (err: any) {
          if (err.response.data.message === 'Permission Denied') {
            alert('권한이 없습니다.');
          }
          if (err.response.data.message === 'Not Found') {
            alert('존재하지 않는 채팅방입니다.');
          }
        }
      })();
    }
    return () => {isSubscribed = false};
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatModal.chatIndex, chatModal.open, setChats]);

  const onClickCloseButton = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setModal({ open: false, chatIndex: -1 });
  };

  const onClickDeleteButton = async (
    e: React.MouseEvent<HTMLButtonElement>,
  ) => {
    e.preventDefault();
    try {
      await axios.delete(`/chat/${chatData.index}`);
      const newChats = await getChats();
      setChats(newChats);
    } catch (error: any) {
      if (error.response.data.message === 'Permission Denied') {
        alert('권한이 없습니다.');
      }
      if (error.response.data.message === 'Not Found') {
        alert('존재하지 않는 채팅방입니다.');
        const newChats = await getChats();
        setChats(newChats);
      }
    }
    setModal({ open: false, chatIndex: -1 });
  };

  return (
    <div>
      <Modal
        open={chatModal.open}
        onClose={() => setModal({ open: false, chatIndex: -1 })}
      >
        <div className={classes.root}>
          <IconButton
            className={classes.closeButtonLocation}
            onClick={onClickCloseButton}
          >
            <CancelIcon className={classes.closeButton} />
          </IconButton>
          <div className={classes.title}>{chatData.title}</div>
          <div className={classes.paper}>
            <div className={classes.messageList}>
              <List>
                {messages.map((data) => (
                  <ChattingList key={data.timestamp.toISOString()} data={data} />
                ))}
              </List>
            </div>
            <div className={classes.userList}>
              <List>
                {chatData.joinUsers.map((user) => (
                  <AdminChannelJoinUserElem
                    key={user.index}
                    user={user}
                    chatData={chatData}
                    setChatData={setChatData}
                  />
                ))}
              </List>
            </div>
          </div>
          <Button
            variant="contained"
            size="large"
            className={classes.button}
            onClick={onClickDeleteButton}
          >
            Delete Channel
          </Button>
        </div>
      </Modal>
    </div>
  );
}

export default React.memo(AdminChannelModal);
