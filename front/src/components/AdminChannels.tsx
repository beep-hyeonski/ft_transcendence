import React, { useState, useEffect } from 'react';
import { List } from '@material-ui/core';
import { getChats } from '../utils/Requests';
import AdminChannelsElem from './AdminChannelsElem';
import AdminChannelModal from './AdminChannelModal';

interface ChatInfoProps {
  index: number;
  status: string;
  title: string;
  joinUsers: any[];
}

function AdminUsers(): JSX.Element {
  const [chats, setChats] = useState<ChatInfoProps[]>([]);
  const [modalOpen, setModalOpen] = useState({
    open: false,
    chatIndex: -1,
  });
  const [isSubscribed, setSubscribed] = useState<boolean>(false);

  useEffect(() => {
    setSubscribed(true);
    getChats().then((res) => {
      if (isSubscribed) setChats(res);
    });
    return () => setSubscribed(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <List>
        {chats.map((roomdata) => (
          <AdminChannelsElem
            key={roomdata.index}
            roomdata={roomdata}
            setModal={setModalOpen}
          />
        ))}
      </List>
      <AdminChannelModal
        chatModal={modalOpen}
        setModal={setModalOpen}
        setChats={setChats}
      />
    </div>
  );
}

export default AdminUsers;
