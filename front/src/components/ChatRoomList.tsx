import React from 'react';
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
  if (status === 'private') {
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
  type: string
  title: string
}

interface Roomdata {
  roomdata: RoomdataProps;
  setModal: React.Dispatch<React.SetStateAction<{
    open: boolean;
    type: string;
  }>>;
}

function ChatRoomList({ roomdata, setModal } : Roomdata) {
  const classes = useStyles();

  const onClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    console.log('clicked');
    console.log(roomdata);
    setModal({ open: true, type: roomdata.type });
  };

  return (
    <ListItem button key={roomdata.title} className={classes.root} onClick={onClick}>
      <div className={classes.title}>
        {roomdata.title}
      </div>
      <StatusIcon classname={classes.statusIcon} status={roomdata.type} />
    </ListItem>
  );
}

export default React.memo(ChatRoomList);
