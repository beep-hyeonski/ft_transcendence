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
  roomdata: RoomdataProps
}

function ChatRoomList({ roomdata } : Roomdata) {
  const classes = useStyles();

  return (
    <ListItem button key={roomdata.title} className={classes.root}>
      <div className={classes.title}>
        {roomdata.title}
      </div>
      <StatusIcon classname={classes.statusIcon} status={roomdata.type} />
    </ListItem>
  );
}

export default React.memo(ChatRoomList);
