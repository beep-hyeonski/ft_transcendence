import React from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { ListItem } from '@material-ui/core';

const useStyles = makeStyles(() =>
  createStyles({
    title: {
      fontSize: '10rem',
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
	setModal: React.Dispatch<React.SetStateAction<{
    open: boolean;
    chatIndex: number;
  }>>;
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
    >
      <div className={classes.title}>{roomdata.title}</div>
    </ListItem>
  );
}

export default AdminChannelsElem;
