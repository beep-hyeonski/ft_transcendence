import React from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import SearchBar from './SearchBar';

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

function ViewBoxProfileNotfound(): JSX.Element {
  const classes = useStyles();
  const history = useHistory();

  const searchUser = (form: { input: string }) => {
    history.push(`/profile?nickname=${form.input}`);
  };

  return (
    <div>
      <div className={classes.profileTitle}>User Not Found</div>
      <div className={classes.searchBar}>
        <SearchBar onSubmit={searchUser} />
      </div>
      <div className={classes.notFoundMessage}>찾을 수 없는 유저에요 ㅜ0ㅜ</div>
    </div>
  );
}

export default React.memo(ViewBoxProfileNotfound);
