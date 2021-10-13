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
        (value: any) => value.username === userdata.username,
      ) !== undefined;
    setFollow(isFollow);
    const isBlock =
      mydata.blockings.find(
        (value: any) => value.username === userdata.username,
      ) !== undefined;
    setBlock(isBlock);
  }, [mydata.blockings, mydata.followings, userdata.username]);

  const clickFollowButton = async () => {
    if (block) {
      try {
        const res = await axios.delete(`/block`, {
          data: { blockedUser: userdata.username },
        });
        dispatch(updateUser(res.data));
        setBlock(false);
      } catch (err: any) {
        setBlock(true);
        if (err.response.data.message === 'Not Found') {
          window.location.reload();
        }
      }
    }
    try {
      const res = await axios.post(`/follow`, {
        followedUser: userdata.username,
      });
      dispatch(updateUser(res.data));
      setFollow(true);
    } catch (err: any) {
      setFollow(false);
      if (err.response.data.message === 'You cannot follow yourself') {
        alert('자기 자신을 팔로우할 수 없습니다.');
      }
      if (err.response.data.message === 'You are already following this user') {
        alert('이미 팔로우 중인 유저입니다.');
      }
      if (err.response.data.message === 'Not Found') {
        alert('존재하지 않는 유저입니다.');
      }
    }
  };

  const clickUnfollowButton = async () => {
    try {
      const res = await axios.delete(`/follow`, {
        data: { followedUser: userdata.username },
      });
      dispatch(updateUser(res.data));
      setFollow(false);
    } catch (err: any) {
      setFollow(true);
      if (err.response.data.message === 'Not Found') {
        alert('존재하지 않는 유저입니다.');
      }
    }
  };

  const BlockButton = async () => {
    if (follow) {
      try {
        const res = await axios.delete(`/follow`, {
          data: { followedUser: userdata.username },
        });
        dispatch(updateUser(res.data));
        setFollow(false);
      } catch (err: any) {
        setFollow(true);
        if (err.response.data.message === 'Not Found') {
          alert('존재하지 않는 유저입니다.');
        }
      }
    }
    try {
      const res = await axios.post(`/block`, {
        blockedUser: userdata.username,
      });
      dispatch(updateUser(res.data));
      setBlock(true);
    } catch (err: any) {
      setBlock(false);
      if (err.response.data.message === 'Not Found') {
        window.location.reload();
      }
      if (err.response.data.message === 'You cannot block yourself') {
        alert('자기 자신을 차단할 수 없습니다.');
        window.location.reload();
      }
      if (err.response.data.message === 'You are already blocking this user') {
        alert('이미 차단된 유저입니다.');
        window.location.reload();
      }
    }
  };

  const UnBlockButton = async () => {
    try {
      const res = await axios.delete(`/block`, {
        data: { blockedUser: userdata.username },
      });
      dispatch(updateUser(res.data));
      setBlock(false);
    } catch (err: any) {
      setBlock(true);
      if (err.response.data.message === 'Not Found') {
        window.location.reload();
      }
    }
  };

  return (
    <>
      <Avatar className={classes.profileImage} src={userdata.avatar} />
      {userdata.username !== mydata.username && follow && (
        <Button
          className={classes.unfollowButton}
          variant="contained"
          onClick={clickUnfollowButton}
        >
          Unfollow
        </Button>
      )}
      {userdata.username !== mydata.username && !follow && (
        <Button
          className={classes.followButton}
          variant="contained"
          onClick={clickFollowButton}
        >
          Follow
        </Button>
      )}
      {userdata.username !== mydata.username && !block && (
        <Button
          className={classes.BlockButton}
          variant="contained"
          onClick={BlockButton}
        >
          Block
        </Button>
      )}
      {userdata.username !== mydata.username && block && (
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
