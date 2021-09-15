import React from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import ViewBoxProfileTitle from './ViewBoxProfileTitle';

const useStyles = makeStyles(() => createStyles({
  root: {
    position: 'absolute',
    top: '50%',
    left: '40%',
    transform: 'translate(-50%, -50%)',
    width: '1000px',
    height: '650px',
    backgroundColor: '#3F446E',
    border: '1px solid #3F446E',
    borderRadius: '10px',
    boxShadow: '3.5px 3.5px 3px gray',
  },
  searchBar: {
    position: 'absolute',
    top: '10%',
    left: '64%',
    boxShadow: '1px 1px 1px lightgray',
    borderRadius: '4px',
  },
}));

interface FuncProps {
  changeId : (id: string) => void
  isValid: boolean,
}

function ViewBox({ changeId, isValid }: FuncProps) {
  const classes = useStyles();

  return (
    <Paper className={classes.root}>
      <ViewBoxProfileTitle changeId={changeId} isValid={isValid} />
    </Paper>
  );
}

export default React.memo(ViewBox);
