import React, { useState } from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import { Button } from '@material-ui/core';

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

interface ProfileImageProps {
  imageLink: string;
  username: string;
}

const following = false;

function ViewBoxProfileImage({ imageLink, username } : ProfileImageProps) {
  const classes = useStyles();

  // BACK 에서 following 상태인지 아닌지 판별해서 넣어주기
  const [stat, setStat] = useState(
    { followStat: following },
  );

  const clickChangeImage = () => {
    console.log('click Change Image');
  };

  const clickFollowButton = () => {
    console.log('test');
    setStat({
      ...stat,
      followStat: !stat.followStat,
    });
  };

  return (
    <>
      <Avatar
        className={classes.profileImage}
        src={imageLink}
      />
      {username === 'joockim' && (
      <Button className={classes.changeImageButton} variant="contained" onClick={clickChangeImage}>
        change image
      </Button>
      )}
      {username !== 'joockim' && !stat.followStat && (
      <Button className={classes.unfollowButton} variant="contained" onClick={clickFollowButton}>
        Unfollow
      </Button>
      )}
      {username !== 'joockim' && stat.followStat && (
      <Button className={classes.followButton} variant="contained" onClick={clickFollowButton}>
        Follow
      </Button>
      )}
    </>
  );
}

export default React.memo(ViewBoxProfileImage);
