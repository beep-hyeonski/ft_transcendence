/* eslint-disable @typescript-eslint/no-unsafe-call */
import React, { useEffect, useState } from 'react';
import List from '@material-ui/core/List';
import { Drawer } from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';
import { getChats } from '../utils/Requests';
import ChatRoomList from './ChatRoomList';
import ChatPublicModal from './ChatPublicModal';
import ChatProtectedModal from './ChatProtectedModal';
import { RootState } from '../modules';

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      position: 'absolute',
      top: '54%',
      left: '41.5%',
      transform: 'translate(-50%, -50%)',
      width: '78%',
      height: '81%',
    },
    drawerPaper: {
      backgroundColor: 'white',
      width: '100%',
      height: '100%',
      borderRadius: '3px',
      boxShadow: '3.5px 3.5px 3px gray',
      display: 'flex',
    },
  }),
);

interface ChatTableProps {
  create: boolean;
}

interface ChatInfoProps {
  index: number;
  status: string;
  title: string;
  joinUsers: any[];
}

interface ModalProps {
  index: number;
  open: boolean;
  status: string;
  title: string;
  joinUsers: any[];
  bannedUsers: any[];
  mutedUsers: any[];
  adminUsers: any[];
  ownerUser: string;
}

function ChatTable({ create }: ChatTableProps): JSX.Element {
  const classes = useStyles();
  const [modal, setModal] = useState<ModalProps>({
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
  const [chats, setChats] = useState<ChatInfoProps[]>([]);
  const mydata = useSelector((state: RootState) => state.userModule);

  useEffect(() => {
    let isSubscribed = true;
    (async () => {
      const res = await getChats();
      const joinedChats = res.filter(
        (chat: ChatInfoProps) =>
          !chat.joinUsers.find((user: any) => user.index === mydata.index),
      );
      if (isSubscribed) {
        setChats(joinedChats);
      }
    })();
    return () => {isSubscribed = false};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [create, mydata.index, mydata.joinChannels]);

  return (
    <>
      <Drawer
        className={classes.root}
        variant="permanent"
        classes={{ paper: classes.drawerPaper }}
      >
        <List>
          {chats.map((roomdata) => (
            <ChatRoomList
              key={roomdata.index}
              roomdata={roomdata}
              setModal={setModal}
            />
          ))}
        </List>
      </Drawer>
      {modal.status === 'public' ? (
        <ChatPublicModal modal={modal} setModal={setModal} />
      ) : (
        <ChatProtectedModal modal={modal} setModal={setModal} />
      )}
    </>
  );
}

export default React.memo(ChatTable);
