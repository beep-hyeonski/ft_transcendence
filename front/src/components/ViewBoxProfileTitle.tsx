import React from 'react';
import axios from 'axios';
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
  notFoundMessage: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    fontSize: '40px',
    color: 'white',
    transform: 'translate(-50%, -50%)',
  },
}));

interface UserDataProps {
  changeId : (id: string) => void
}

function ViewBoxProfileTitle({ changeId } : UserDataProps) {
  const classes = useStyles();
  const mydata = useSelector((state: RootState) => state.userModule);
  const dispatch = useDispatch();

  const userdata = useSelector((state: RootState) => state.profileModule);

  const searchUser = async (form: { input: string }) => {
    if (form.input === 'me') {
      changeId(mydata.nickname);
      dispatch(changeUser(mydata));
      return;
    }

    await axios.get(`${String(process.env.REACT_APP_API_URL)}/users/${form.input}`).then((res) => {
      changeId(form.input);
      dispatch(changeUser(res.data));
    }).catch((err) => {
      console.log(err.response);
      if (err.response.data.message === 'User Not Found') {
        changeId('usernotfound');
      }
    });
  };

  switch (userdata.nickname) {
    case 'usernotfound':
      return (
        <div>
          <div className={classes.profileTitle}>
            User Not Found
          </div>
          <div className={classes.searchBar}>
            <SearchBar onSubmit={searchUser} />
          </div>
          <div className={classes.notFoundMessage}>
            찾을 수 없는 유저에요 ㅜ0ㅜ
          </div>
        </div>
      );
    case mydata.nickname:
      return (
        <div>
          <div className={classes.profileTitle}>
            My Profile
          </div>
          <div className={classes.searchBar}>
            <SearchBar onSubmit={searchUser} />
          </div>
          <ViewBoxContentsBox />
        </div>
      );
    default:
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
}

export default React.memo(ViewBoxProfileTitle);
