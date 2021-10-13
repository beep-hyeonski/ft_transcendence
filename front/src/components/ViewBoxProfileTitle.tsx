import React from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux';
import { changeUser } from '../modules/profile';
import SearchBar from './SearchBar';
import ViewBoxContentsBox from './ViewBoxContentsBox';
import { RootState } from '../modules';

const useStyles = makeStyles(() =>
  createStyles({
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
    notFoundMessage: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      fontSize: '40px',
      color: 'white',
      transform: 'translate(-50%, -50%)',
    },
  }),
);

interface UserDataProps {
  changeId: (id: string) => void;
  isValid: boolean;
}

function ViewBoxProfileTitle({ changeId, isValid }: UserDataProps): JSX.Element {
  const classes = useStyles();
  const mydata = useSelector((state: RootState) => state.userModule);
  const dispatch = useDispatch();
  const userdata = useSelector((state: RootState) => state.profileModule);

  const searchUser = (form: { input: string }) => {
    if (form.input === 'me') {
      changeId(mydata.username);
      dispatch(changeUser(mydata));
      return;
    }
    changeId(form.input);
  };

  if (!isValid) {
    return (
      <div>
        <div className={classes.profileTitle}>User Not Found</div>
        <div className={classes.searchBar}>
          <SearchBar onSubmit={searchUser} />
        </div>
        <div className={classes.notFoundMessage}>
          찾을 수 없는 유저에요 ㅜ0ㅜ
        </div>
      </div>
    );
  }
  if (userdata.username === mydata.username) {
    return (
      <div>
        <div className={classes.profileTitle}>My Profile</div>
        <div className={classes.searchBar}>
          <SearchBar onSubmit={searchUser} />
        </div>
        <ViewBoxContentsBox />
      </div>
    );
  }
  return (
    <div>
      <div className={classes.profileTitle}>
        {userdata.nickname}
        &nbsp;Profile
      </div>
      <div className={classes.searchBar}>
        <SearchBar onSubmit={searchUser} />
      </div>
      <ViewBoxContentsBox />
    </div>
  );
}

export default React.memo(ViewBoxProfileTitle);
