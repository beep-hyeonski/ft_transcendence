import React, { useState, useEffect } from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { List } from '@material-ui/core';
import { getChats } from '../utils/Requests';

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
    <>
			<List>
        ssss
      </List>
    </>
  );
}

export default AdminUsers;
