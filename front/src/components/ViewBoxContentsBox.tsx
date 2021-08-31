import React, { useImperativeHandle } from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import ViewBoxProfileImage from './ViewBoxProfileImage';
import ViewBoxProfileInfo from './ViewBoxProfileInfo';

const useStyles = makeStyles(() => createStyles({
  box: {
    margin: '2em 1em',
    width: '960px',
    height: '510px',
    backgroundColor: '#FFFFFF',
    border: '1px solid #FFFFFF',
    borderRadius: '10px',
    boxShadow: '3.5px 3.5px 3px gray',
  },
}));

interface UserDataProps {
  userdata: {
    username: string,
    radderScore: string,
    win: string,
    lose: string,
    profileImage: string,
  }
}

function ViewBoxContentsBox({ userdata } : UserDataProps) {
  const classes = useStyles();

  return (
    <div className={classes.box}>
      <ViewBoxProfileImage imageLink={userdata.profileImage} username={userdata.username} />
      <ViewBoxProfileInfo userdata={userdata} />
    </div>
  );
}

export default React.memo(ViewBoxContentsBox);
