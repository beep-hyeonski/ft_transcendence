import React from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
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

function ViewBoxProfile(): JSX.Element {
  const classes = useStyles();
  const userdata = useSelector((state: RootState) => state.profileModule);
  const history = useHistory();

  const searchUser = (form: { input: string }) => {
    history.push(`/profile?nickname=${form.input}`);
  };

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

export default React.memo(ViewBoxProfile);
