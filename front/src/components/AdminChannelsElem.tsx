import React from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { ListItem } from '@material-ui/core';

const useStyles = makeStyles(() =>
  createStyles({
  }),
);

function AdminChannels(): JSX.Element {
  const classes = useStyles();

  return (
    <ListItem
      button
    >
      test
    </ListItem>
  );
}

export default AdminChannels;
