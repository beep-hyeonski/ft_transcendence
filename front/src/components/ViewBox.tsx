import React, { Component } from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';
import Paper from '@material-ui/core/Paper';
import { RootState } from '../modules';
import ViewBoxProfileTitle from './ViewBoxProfileTitle';
import ViewBoxCreateTitle from './ViewBoxCreateTitle';

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

const user1 = {
  username: 'joockim',
  radderScore: '1001',
  win: '5',
  lose: '2',
  profileImage: 'http://th4.tmon.kr/thumbs/image/3ac/0a7/c37/23b77bc09_700x700_95_FIT.jpg',
};

interface FuncProps {
  changeId : (id: string) => void
}

function ViewBox({ changeId }: FuncProps) {
  const classes = useStyles();

  return (
    <Paper className={classes.root}>
      <ViewBoxProfileTitle userdata={user1} changeId={changeId} />
    </Paper>
  );
}

export default React.memo(ViewBox);
