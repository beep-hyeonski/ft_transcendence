import React from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { ListItem } from '@material-ui/core';

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      width: '97%',
      height: '8rem',
      marginTop: '10px',
      borderRadius: '10px',
      border: '1px solid lightgray',
      boxShadow: '1px 1px 1px gray',
      transform: 'translate(-50%, 0)',
      left: '50%',
    },
    title: {
      fontSize: '8rem',
    },
  }),
);

interface RoomdataProps {
  index: number;
  status: string;
  title: string;
}

interface Roomdata {
  roomdata: RoomdataProps;
  setModal: React.Dispatch<
    React.SetStateAction<{
      open: boolean;
      chatIndex: number;
    }>
  >;
}

function AdminChannelsElem({ roomdata, setModal }: Roomdata): JSX.Element {
  const classes = useStyles();

  const onClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setModal({ open: true, chatIndex: roomdata.index });
  };

  return (
    <ListItem
      button
      key={roomdata.index}
      onClick={onClick}
      className={classes.root}
    >
      <div className={classes.title}>{roomdata.title}</div>
    </ListItem>
  );
}

export default AdminChannelsElem;
