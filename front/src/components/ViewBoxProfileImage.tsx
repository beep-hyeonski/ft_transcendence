/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux';
import Avatar from '@material-ui/core/Avatar';
import { Button } from '@material-ui/core';
import { RootState } from '../modules';
import { updateUser } from '../modules/user';

const useStyles = makeStyles(() => createStyles({
  profileImage: {
    position: 'absolute',
    top: '27%',
    left: '5%',
    width: 250,
    height: 250,
    boxShadow: '1px 1px 1.5px gray',
  },
  changeImageButton: {
    position: 'absolute',
    top: '75%',
    left: '18%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#F4F3FF',
    color: '#282E4E',
    width: 230,
    height: 50,
    textTransform: 'none',
    textShadow: '1px 1px 0.5px gray',
    boxShadow: '1px 1px 0.5px gray',
    '&:hover': {
      backgroundColor: '#e3e0ff',
    },
  },
  followButton: {
    position: 'absolute',
    top: '75%',
    left: '18%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#3F446E',
    color: '#F4F3FF',
    width: 230,
    height: 50,
    textTransform: 'none',
    textShadow: '1px 1px 0.5px gray',
    boxShadow: '1px 1px 1px gray',
    '&:hover': {
      backgroundColor: '#1c244f',
    },
  },
  unfollowButton: {
    position: 'absolute',
    top: '75%',
    left: '18%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#CE6F84',
    color: '#F4F3FF',
    width: 230,
    height: 50,
    textTransform: 'none',
    textShadow: '1px 1px 0.5px gray',
    boxShadow: '1px 1px 1px gray',
    '&:hover': {
      backgroundColor: '#cc6b80',
    },
  },
}));

function ViewBoxProfileImage() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const mydata = useSelector((state: RootState) => state.userModule);
  const userdata = useSelector((state: RootState) => state.profileModule);

  const [follow, setFollow] = useState(false);

  useEffect(() => {
    const isFollow = (mydata.followings
      .find((value: any) => value.nickname === userdata.nickname) !== undefined);
    setFollow(isFollow);
  }, [mydata.followings, userdata.nickname]);

  function clickFollowButton() {
    const followForm = {
      followedUser: userdata.username,
    };
    setFollow(true);
    axios.post(`${String(process.env.REACT_APP_API_URL)}/follow`, followForm).then((res) => {
      dispatch(updateUser(res.data));
    }, (err) => {
      console.log(err.response);
      setFollow(false);
    });
  }

  function clickUnfollowButton() {
    const followForm = {
      data: {
        followedUser: userdata.username,
      },
    };
    setFollow(false);
    axios.delete(`${String(process.env.REACT_APP_API_URL)}/follow`, followForm).then((res) => {
      dispatch(updateUser(res.data));
    }, (err) => {
      console.log(err.response);
      setFollow(true);
    });
  }

  return (
    <>
      <Avatar
        className={classes.profileImage}
        src={userdata.avatar}
      />
      {userdata.nickname !== mydata.nickname && follow && (
      <Button className={classes.unfollowButton} variant="contained" onClick={clickUnfollowButton}>
        Unfollow
      </Button>
      )}
      {userdata.nickname !== mydata.nickname && !follow && (
      <Button className={classes.followButton} variant="contained" onClick={clickFollowButton}>
        Follow
      </Button>
      )}
    </>
  );
}

export default React.memo(ViewBoxProfileImage);
