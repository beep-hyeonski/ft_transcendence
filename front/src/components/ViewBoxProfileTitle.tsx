/* eslint-disable @typescript-eslint/quotes */
/* eslint-disable no-restricted-globals */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux';
import { changeUser } from '../modules/profile';
import SearchBar from './SearchBar';
import ViewBoxContentsBox from './ViewBoxContentsBox';
import { RootState } from '../modules';

const useStyles = makeStyles(() => createStyles({
  profileTitle: {
    fontSize: '55px',
    marginTop: '20px',
    marginLeft: '30px',
    color: '#F4F3FF',
    textShadow: '1px 1px 1.5px lightgray',
    letterSpacing: '2px',
    wordSpacing: '5px',
    textTransform: 'capitalize',
  },
  searchBar: {
    position: 'absolute',
    top: '5%',
    left: '64%',
    boxShadow: '1px 1px 1px lightgray',
    borderRadius: '4px',
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
  changeId : (id: string) => void
}

const user2 = {
  username: 'change',
  radderScore: '1111',
  win: '0',
  lose: '10',
  profileImage: '',
};

function ViewBoxProfileTitle({ userdata, changeId } : UserDataProps) {
  const classes = useStyles();

  const [data, setUserdata] = useState(userdata);

  const userid = useSelector((state: RootState) => state.userModule.id);

  const searchUser = (form: { input: string }) => {
    changeId(form.input);
  };

  // 내가 아닌 다른 사용자일 때
  if (userid !== 'joockim') {
    return (
      <div>
        <div className={classes.profileTitle}>
          {userid}
          &nbsp;Profile
        </div>
        <div className={classes.searchBar}>
          <SearchBar onSubmit={searchUser} />
        </div>
        <ViewBoxContentsBox userdata={data} />
      </div>
    );
  }
  return (
    <div>
      <div className={classes.profileTitle}>
        My Profile
      </div>
      <div className={classes.searchBar}>
        <SearchBar onSubmit={searchUser} />
      </div>
      <ViewBoxContentsBox userdata={data} />
    </div>
  );
}

export default React.memo(ViewBoxProfileTitle);
