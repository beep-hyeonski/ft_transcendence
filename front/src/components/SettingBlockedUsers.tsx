import React, { useEffect, useState } from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { GridList } from '@material-ui/core';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { RootState } from '../modules';
import { updateUser } from '../modules/user';
import { getBlock, getUserme } from '../utils/Requests';
import { changeSideBar, FOLLOW } from '../modules/sidebar';

const useStyles = makeStyles(() =>
  createStyles({
    title: {
      color: '#282E4E',
      fontSize: '40px',
      margin: '30px 25px',
      letterSpacing: '3px',
      textShadow: '1px 1px 1px gray',
    },
    contentBox: {
      position: 'absolute',
      transform: 'translate(-50%, -50%)',
      top: '55%',
      left: '50%',
      width: '95%',
      height: '80%',
      backgroundColor: 'green',
    },
  }),
);

function SettingBlockedUsers() {
  const classes = useStyles();
  const dispatch = useDispatch();

  useEffect(() => {
    getBlock().then((res) => {
      console.log(res);
    }).catch((err) => {
      console.log(err);
    });
  });

  const mydata = useSelector((state: RootState) => state.userModule);

  return (
    <>
			<div className={classes.title}>Blocked Users</div>
      <div className={classes.contentBox}>
        test
      </div>
    </>
  );
}

export default React.memo(SettingBlockedUsers);
