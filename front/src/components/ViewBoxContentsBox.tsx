import React from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import ViewBoxProfileImage from './ViewBoxProfileImage';
import ViewBoxProfileInfo from './ViewBoxProfileInfo';

const useStyles = makeStyles(() =>
  createStyles({
    box: {
      margin: '2em 1em',
      width: '960px',
      height: '510px',
      backgroundColor: '#FFFFFF',
      border: '1px solid #FFFFFF',
      borderRadius: '10px',
      boxShadow: '3.5px 3.5px 3px gray',
    },
  }),
);

function ViewBoxContentsBox(): JSX.Element {
  const classes = useStyles();

  return (
    <div className={classes.box}>
      <ViewBoxProfileImage />
      <ViewBoxProfileInfo />
    </div>
  );
}

export default React.memo(ViewBoxContentsBox);
