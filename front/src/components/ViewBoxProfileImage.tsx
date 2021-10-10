/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux';
import Avatar from '@material-ui/core/Avatar';
import { Button } from '@material-ui/core';
import { RootState } from '../modules';
import { updateUser } from '../modules/user';
import { BannedUserHandler } from '../utils/errorHandler';

const useStyles = makeStyles(() =>
  createStyles({
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
    BlockButton: {
      position: 'absolute',
      top: '85%',
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
    UnBlockButton: {
      position: 'absolute',
      top: '85%',
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
  }),
);

function ViewBoxProfileImage(): JSX.Element {
  const classes = useStyles();
  const dispatch = useDispatch();
  const mydata = useSelector((state: RootState) => state.userModule);
  const userdata = useSelector((state: RootState) => state.profileModule);
  const [follow, setFollow] = useState(false);
  const [block, setBlock] = useState(false);

  useEffect(() => {
    const isFollow =
      mydata.followings.find(
        (value: any) => value.nickname === userdata.nickname,
      ) !== undefined;
    setFollow(isFollow);
    const isBlock = mydata.blockings.find(
      (value: any) => value.nickname === userdata.nickname,
    ) !== undefined;
    setBlock(isBlock);
  }, [mydata.blockings, mydata.followings, userdata.nickname]);

  const clickFollowButton = async () => {
    if (block) {
      try {
        const res = await axios.delete(`${String(process.env.REACT_APP_API_URL)}/block`, { data: { blockedUser: userdata.username } });
        dispatch(updateUser(res.data));
        setBlock(false);
      } catch (err: any) {
        console.log(err.response);
        setBlock(true);
        if (err.response.data.message === 'User is Banned') {
          BannedUserHandler();
        }
      }
    }
    try {
      const res = await axios.post(`${String(process.env.REACT_APP_API_URL)}/follow`, { followedUser: userdata.username });
      dispatch(updateUser(res.data));
      setFollow(true);
    } catch (err: any) {
      console.log(err.response);
      setFollow(false);
      if (err.response.data.message === 'User is Banned') {
        BannedUserHandler();
      }
    }
  };

  const clickUnfollowButton = async () => {
    try {
      const res = await axios.delete(`${String(process.env.REACT_APP_API_URL)}/follow`, { data: { followedUser: userdata.username } });
      dispatch(updateUser(res.data));
      setFollow(false);
    } catch (err: any) {
      console.log(err.response);
      setFollow(true);
      if (err.response.data.message === 'User is Banned') {
        BannedUserHandler();
      }
    }
  };

  const BlockButton = async () => {
    if (follow) {
      try {
        const res = await axios.delete(`${String(process.env.REACT_APP_API_URL)}/follow`, { data: { followedUser: userdata.username } });
        dispatch(updateUser(res.data));
        setFollow(false);
      } catch (err: any) {
        console.log(err.response);
        setFollow(true);
        if (err.response.data.message === 'User is Banned') {
          BannedUserHandler();
        }
      }
    }
    try {
      const res = await axios.post(`${String(process.env.REACT_APP_API_URL)}/block`, { blockedUser: userdata.username });
      dispatch(updateUser(res.data));
      setBlock(true);
    } catch (err: any) {
      console.log(err.response);
      setBlock(false);
      if (err.response.data.message === 'User is Banned') {
        BannedUserHandler();
      }
    }
  };

  const UnBlockButton = async () => {
    try {
      const res = await axios.delete(`${String(process.env.REACT_APP_API_URL)}/block`, { data: { blockedUser: userdata.username } });
      dispatch(updateUser(res.data));
      setBlock(false);
    } catch (err: any) {
      console.log(err.response);
      setBlock(true);
      if (err.response.data.message === 'User is Banned') {
        BannedUserHandler();
      }
    }
  };

  return (
    <>
      <Avatar className={classes.profileImage} src={userdata.avatar} />
      {userdata.nickname !== mydata.nickname && follow && (
        <Button
          className={classes.unfollowButton}
          variant="contained"
          onClick={clickUnfollowButton}
        >
          Unfollow
        </Button>
      )}
      {userdata.nickname !== mydata.nickname && !follow && (
        <Button
          className={classes.followButton}
          variant="contained"
          onClick={clickFollowButton}
        >
          Follow
        </Button>
      )}
      {userdata.nickname !== mydata.nickname && !block && (
        <Button
          className={classes.BlockButton}
          variant="contained"
          onClick={BlockButton}
        >
          Block
        </Button>
      )}
      {userdata.nickname !== mydata.nickname && block && (
        <Button
          className={classes.UnBlockButton}
          variant="contained"
          onClick={UnBlockButton}
        >
          Unblock
        </Button>
      )}
    </>
  );
}

export default React.memo(ViewBoxProfileImage);
