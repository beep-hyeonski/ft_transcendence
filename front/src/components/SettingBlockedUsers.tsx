import React, { useEffect } from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { ImageList } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../modules';
import { updateUser } from '../modules/user';
import { getBlock } from '../utils/Requests';
import BlockedUserElem from './BlockedUserElem';
import { logoutSequence } from '../utils/logoutSequence';

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
      border: '2px solid black',
      borderRadius: '10px',
      backgroundColor: '#F4F3FF',
    },
  }),
);

function SettingBlockedUsers(): JSX.Element {
  const classes = useStyles();
  const dispatch = useDispatch();

  useEffect(() => {
    getBlock()
      .then((res) => {
        dispatch(updateUser(res.data));
      })
      .catch((err: any) => {
        if (err.response.data.message === 'Not Found') {
          alert('로그인 정보가 유효하지 않습니다. 다시 로그인 해주세요');
          logoutSequence(dispatch);
          window.location.href = '/';
        }
      });
  }, [dispatch]);

  const mydata = useSelector((state: RootState) => state.userModule);

  return (
    <>
      <div className={classes.title}>Blocked Users</div>
      <div className={classes.contentBox}>
        <ImageList>
          {mydata.blockings.map((user: any) => (
            <BlockedUserElem key={user.index} user={user} />
          ))}
        </ImageList>
      </div>
    </>
  );
}

export default React.memo(SettingBlockedUsers);
