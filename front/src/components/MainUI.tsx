import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { changeSideBar, MAIN } from '../modules/sidebar';
import GameButton from './GameButton';
import RuleBook from './RuleBook';

const useStyles = makeStyles({
  content: {
    height: '100vh',
    width: '80vw',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
});

function MainUI(): JSX.Element {
  const dispatch = useDispatch();
  const classes = useStyles();

  useEffect(() => {
    dispatch(changeSideBar({ type: MAIN }));
  }, [dispatch]);
  return (
    <div className={classes.content}>
      <RuleBook />
      <GameButton />
    </div>
  );
}

export default React.memo(MainUI);
