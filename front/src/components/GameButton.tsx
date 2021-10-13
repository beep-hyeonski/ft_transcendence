import React from 'react';
import Button from '@material-ui/core/Button';
import GavelIcon from '@material-ui/icons/Gavel';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../modules';
import { matchQueueGame } from '../modules/gamestate';

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
    color: '#F4F3FF',
    fontSize: '25px',
    backgroundColor: '#282E4E',
    '&:hover': {
      backgroundColor: '#1C244F',
    },
    '&:focus': {
      backgroundColor: '#3F446E',
    },
  },
}));

function GameButton(): JSX.Element {
  const classes = useStyles();
  const { socket } = useSelector((state: RootState) => state.socketModule);
  const { gamestate } = useSelector(
    (state: RootState) => state.gameStateMoudle,
  );
  const dispatch = useDispatch();

  const clickGamestartButton = () => {
    if (!socket || gamestate !== 'WAIT') {
      // gamestate가 WAIT이 아니라는 것은 게임중이거나 게임 큐를 기다리고 있는 상태
      return;
    }
    dispatch(matchQueueGame());
    socket.emit('matchQueue', () => {});
  };

  return (
    <div>
      <Button
        variant="contained"
        size="large"
        className={classes.button}
        startIcon={<GavelIcon style={{ fontSize: '40' }} />}
        onClick={clickGamestartButton}
      >
        GAME START
      </Button>
    </div>
  );
}

/* <div>
<Link to="/game">
  <Button
    variant="contained"
    size="large"
    className={classes.button}
    startIcon={<GavelIcon style={{ fontSize: '40' }} />}
    onClick={clickGamestartButton}
  >
    GAME START
  </Button>
</Link>
</div> */

export default React.memo(GameButton);
