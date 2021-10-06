import React, { useState, useEffect } from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { List, Paper } from '@material-ui/core';
import { getChats } from '../utils/Requests';
import AdminChannelsElem from './AdminChannelsElem';
import AdminChannelModal from './AdminChannelModal';

const useStyles = makeStyles(() =>
  createStyles({
  }),
);

interface ChatInfoProps {
  index: number;
  status: string;
  title: string;
  joinUsers: any[];
}

function AdminUsers(): JSX.Element {
  const classes = useStyles();
  const [chats, setChats] = useState<ChatInfoProps[]>([]);
  const [modalOpen, setModalOpen] = useState({
    open: false,
    chatIndex: -1,
  });

	useEffect(() => {
    getChats()
    .then((res) => {
      setChats(res);
    })
    .catch((err) => {
      console.log(err.response);
    });
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
      <AdminChannelModal chatModal={modalOpen} setModal={setModalOpen} />
    </div>
  );
}

export default AdminUsers;
