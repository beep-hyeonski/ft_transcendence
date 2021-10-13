/* eslint-disable @typescript-eslint/no-unsafe-call */
import React from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { LockRounded, LockOpenRounded } from '@material-ui/icons';
import { ListItem } from '@material-ui/core';
import { getChatInfo } from '../utils/Requests';

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      marginTop: '10px',
      height: '8rem',
      width: '97%',
      marginLeft: '1.5%',
      borderRadius: '10px',
      border: '1px solid lightgray',
      boxShadow: '1px 1px 1px gray',
      overflow: 'auto',
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
  }),
);

interface StatusIconProps {
  classname: string;
  status: string;
}

function StatusIcon({ classname, status }: StatusIconProps): JSX.Element {
  if (status === 'protected') {
    return <LockRounded className={classname} />;
  }
  return <LockOpenRounded className={classname} />;
}

interface RoomdataProps {
  index: number;
  status: string;
  title: string;
}

interface Roomdata {
  roomdata: RoomdataProps;
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

function ChatRoomList({ roomdata, setModal }: Roomdata): JSX.Element {
  const classes = useStyles();

  const onClick = async (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    try {
      const res = await getChatInfo(roomdata.index);
      setModal({
        index: res.index,
        open: true,
        status: roomdata.status,
        title: res.title,
        joinUsers: res.joinUsers,
        bannedUsers: res.bannedUsers,
        mutedUsers: res.mutedUsers,
        adminUsers: res.adminUsers,
        ownerUser: res.ownerUser.username,
      });
    } catch (error: any) {
      if (error.response.data.message === 'Not Found') {
        alert('존재하지 않는 채팅방입니다.');
        window.location.reload();
      }
    }
  };

  return (
    <ListItem
      button
      key={roomdata.index}
      className={classes.root}
      onClick={onClick}
    >
      <div className={classes.title}>{roomdata.title}</div>
      <StatusIcon classname={classes.statusIcon} status={roomdata.status} />
    </ListItem>
  );
}

export default React.memo(ChatRoomList);
