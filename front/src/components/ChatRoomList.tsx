/* eslint-disable @typescript-eslint/no-unsafe-call */
import React from 'react';
import axios from 'axios';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { LockRounded, LockOpenRounded } from '@material-ui/icons';
import { ListItem } from '@material-ui/core';

const useStyles = makeStyles(() => createStyles({
  root: {
    marginTop: '10px',
    height: '8rem',
    width: '97%',
    marginLeft: '1.5%',
    borderRadius: '10px',
    border: '1px solid lightgray',
    boxShadow: '1px 1px 1px gray',
  },
  title: {
    paddingLeft: '1rem',
    fontSize: '4.5rem',
    textShadow: '1.5px 1.5px 2.5px dimgrey',
  },
  statusIcon: {
    fontSize: '4.5rem',
    position: 'absolute',
    left: '94.5%',
  },
}));

interface StatusIconProps {
  classname: string
  status: string
}

function StatusIcon({ classname, status }: StatusIconProps): JSX.Element {
  if (status === 'protected') {
    return (
      <LockRounded className={classname} />
    );
  }
  return (
    <LockOpenRounded className={classname} />
  );
}

interface RoomdataProps {
  index: number
  status: string
  title: string
}

interface Roomdata {
  roomdata: any;
  setModal: React.Dispatch<React.SetStateAction<{
    index: number;
    open: boolean;
    status: string;
    title: string;
    joinUsers: never[];
    password: string;
    mutedUsers: never[];
    adminUsers: never[];
    ownerUser: string;
  }>>
}

async function getChatInfo(index : number) {
  const response = await axios.get(`${String(process.env.REACT_APP_API_URL)}/chat/${index}`);
  return response.data;
}

function ChatRoomList({ roomdata, setModal } : Roomdata) {
  const classes = useStyles();

  const onClick = async (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    try {
      const res = await getChatInfo(roomdata.index);
      console.log(res);
      setModal({
        index: res.index,
        open: true,
        status: roomdata.status,
        title: res.title,
        password: res.password,
        joinUsers: res.joinUsers,
        mutedUsers: res.mutedUsers,
        adminUsers: res.adminUsers,
        ownerUser: res.ownerUser.nickname,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ListItem button key={roomdata.title} className={classes.root} onClick={onClick}>
      <div className={classes.title}>
        {roomdata.title}
      </div>
      <StatusIcon classname={classes.statusIcon} status={roomdata.status} />
    </ListItem>
  );
}

export default React.memo(ChatRoomList);
