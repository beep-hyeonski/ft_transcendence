/* eslint-disable no-param-reassign */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import qs from 'qs';
import { changeUser, deleteUser } from '../modules/profile';
import { changeSideBar, FOLLOW } from '../modules/sidebar';
import { getUserByNickname, getUserByUsername } from '../utils/Requests';
import { RootState } from '../modules';
import ViewBoxProfile from './ViewBoxProfile';
import ViewBoxProfileNotfound from './ViewBoxProfileNotfound';

const useStyles = makeStyles(() =>
  createStyles({
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
  }),
);

function ProfileUI(): JSX.Element {
  const query = qs.parse(location.search, { ignoreQueryPrefix: true });
  const classes = useStyles();
  const user = useSelector((state: RootState) => state.profileModule);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(changeSideBar({ type: FOLLOW }));
    let isSubscribed = true;
    (async () => {
      try {
        if (query.username) {
          const userData = await getUserByUsername(String(query.username));
          dispatch(changeUser(userData));
        } else if (query.nickname) {
          const userData = await getUserByNickname(String(query.nickname));
          dispatch(changeUser(userData));
        } else {
          dispatch(deleteUser());
        }
      } catch (error: any) {
        if (error.response.status === 404) {
          if (isSubscribed) dispatch(deleteUser());
        }
      }
    })();
    return () => {
      isSubscribed = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.username, query.nickname]);

  return (
    <Paper className={classes.root}>
      {user.index !== -1 ? <ViewBoxProfile /> : <ViewBoxProfileNotfound />}
    </Paper>
  );
}

export default React.memo(ProfileUI);
