import React, { useEffect, useState } from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { Tab, Tabs } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { updateUser } from '../modules/user';
import { getUserme } from '../utils/Requests';
import { changeSideBar, FOLLOW } from '../modules/sidebar';
import SettingMyData from './SettingMyData';
import SettingBlockedUsers from './SettingBlockedUsers';

const useStyles = makeStyles(() =>
  createStyles({
    title: {
      color: '#282E4E',
      fontSize: '40px',
      margin: '30px 25px',
      letterSpacing: '3px',
      textShadow: '1px 1px 1px gray',
    },
    divStyle: {
      position: 'absolute',
      left: '41%',
      top: '50%',
      transform: 'translate(-50%, -50%)',
      height: '650px',
      width: '1000px',
      backgroundColor: 'white',
      border: '1px solid white',
      borderRadius: '0px 10px 10px 10px',
      boxShadow: '3.5px 3.5px 3px gray',
    },
    profileImage: {
      position: 'absolute',
      left: '20%',
      top: '45%',
      transform: 'translate(-50%, -50%)',
      width: '275px',
      height: '275px',
      boxShadow: '1px 1px 1.5px lightgray',
    },
    changeLabel: {
      position: 'absolute',
      left: '20%',
      top: '75%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: '#F4F3FF',
      color: '#282E4E',
      width: 150,
      height: 50,
      textTransform: 'none',
      textShadow: '0.5px 0.5px 0.5px gray',
      boxShadow: '1px 1px 1px gray',
      '&:hover': {
        backgroundColor: '#e3e0ff',
      },
      textAlign: 'center',
      lineHeight: '48px',
      borderRadius: '4px',
      fontSize: '15px',
    },
    tapBar: {
      width: '20rem',
      position: 'absolute',
      top: '-4rem',
      color: '#F4F3FF',
      borderRadius: '8px 8px 0px 0px',
      backgroundColor: '#282E4E',
    },
    tapElem: {
      height: '4rem',
      fontSize: '20px',
      letterSpacing: '2px',
      textTransform: 'none',
      textShadow: '1px 1px 0.5px gray',
    },
  }),
);

function Setting() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const [value, setValue] = useState(1);

  useEffect(() => {
    dispatch(changeSideBar({ type: FOLLOW }));
    getUserme()
      .then((res) => {
        dispatch(updateUser(res.data));
      })
      .catch((err) => {
        console.log(err);
        localStorage.removeItem('p_auth');
        alert('인증 정보가 유효하지 않습니다');
        history.push('/');
      });
  }, [history, dispatch]);

  const changeTab = (event: any, newValue: number) => {
    setValue(newValue);
  };

  return (
    <>
      <div className={classes.divStyle}>
        <div className={classes.tapBar}>
          <Tabs
            value={value}
            variant="fullWidth"
            onChange={changeTab}
          >
            <Tab value={1} className={classes.tapElem} label="Setting" />
            <Tab value={2} className={classes.tapElem} label="Block Users" />
          </Tabs>
        </div>
        {value === 1 && <SettingMyData />}
        {value === 2 && <SettingBlockedUsers />}
      </div>
    </>
  );
}

export default React.memo(Setting);
