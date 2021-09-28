import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { RootState } from '../modules';
import { ingGame } from '../modules/gamestate';
import { setGameData } from '../modules/gamedata';

const useStyles = makeStyles({
  alram: {
    backgroundColor: 'white',
    width: '300px',
    height: '100px',
    position: 'absolute',
    left: '1%',
    top: '88%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  alramText: {
    margin: '10px',
  },
});

function GameQueuing(): JSX.Element {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const socket = useSelector((state: RootState) => state.socketModule);
  const { gamestate } = useSelector(
    (state: RootState) => state.gameStateMoudle,
  );

  useEffect(() => {
    const callback = (payload: any) => {
      if (payload.status === 'GAME_START') {
        dispatch(setGameData(payload));
        dispatch(ingGame());
      }
    };

    if (gamestate === 'PVPQUEUE' || gamestate === 'MATCHQUEUE') {
      socket?.socket?.on('matchComplete', callback);
    }
    return () => {
      socket?.socket?.off('matchComplete');
    };
  }, [socket, gamestate, dispatch]);

  if (gamestate === 'ING') {
    history.push('/game');
  }
  return <></>;
}

export default React.memo(GameQueuing);
