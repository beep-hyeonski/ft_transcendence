import React, { useEffect } from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Tab, Tabs } from '@material-ui/core';
import { deleteSideData } from '../modules/sidebar';
import AdminChannels from './AdminChannels';
import AdminUsers from './AdminUsers';
import { getUserme } from '../utils/Requests';
import AdminBannedUser from './AdminBannedUser';
import { BannedUserHandler } from '../utils/errorHandler';

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      position: 'absolute',
      top: '50%',
      left: '47%',
      transform: 'translate(-50%, -50%)',
      width: '80%',
      height: '80%',
    },
    tabBar: {
      position: 'absolute',
      width: '30rem',
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
    indicator: {
      backgroundColor: '#FF00E4',
    },
    insidePaper: {
      width: '100%',
      height: '100%',
      backgroundColor: 'white',
      borderRadius: '10px',
      boxShadow: '3.5px 3.5px 3px gray',
      overflow: 'auto',
    },
  }),
);

function Admin(): JSX.Element {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const [value, setValue] = React.useState(1);

  useEffect(() => {
    (async() => {
      try {
        const response = await getUserme();
        if (response.role === 'user') {
          alert('접근 권한이 없습니다.');
          history.push('/');
        }
      } catch (error: any) {
        console.log(error.response);
        if (error.response.data.message === 'User is Banned') {
          BannedUserHandler();
        }
      }
    })();
  }, [history]);

  useEffect(() => {
    dispatch(deleteSideData());
  }, [dispatch]);

  const changeTab = (event: any, newValue: number) => {
    setValue(newValue);
  };

  return (
    <>
      <Paper className={classes.root}>
        <div className={classes.tabBar}>
          <Tabs
            value={value}
            variant="fullWidth"
            onChange={changeTab}
            classes={{
              indicator: classes.indicator,
            }}
          >
            <Tab value={1} className={classes.tapElem} label="Channels" />
            <Tab value={2} className={classes.tapElem} label="Users" />
            <Tab value={3} className={classes.tapElem} label="Banned" />
          </Tabs>
        </div>
        <Paper className={classes.insidePaper}>
          {value === 1 && <AdminChannels />}
          {value === 2 && <AdminUsers />}
          {value === 3 && <AdminBannedUser />}
        </Paper>
      </Paper>
    </>
  );
}

export default Admin;
