import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { CircularProgress } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../modules';
import { deleteSideData } from '../modules/sidebar';
import PongGame from './PongGame';
import { ingGame } from '../modules/gamestate';

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
  const socket = useSelector((state: RootState) => state.socketModule);
  const { gamestate } = useSelector(
    (state: RootState) => state.gameStateMoudle,
  );
  const [match, setMatch] = useState({});

  useEffect(() => {
    const callback = (payload: any) => {
      if (payload.status === 'GAME_START') {
        setMatch(payload);
        dispatch(ingGame());
      }
    };

    if (gamestate === 'QUEUE') {
      socket?.socket?.on('matchComplete', callback);
    }
    return () => {
      socket?.socket?.off('matchComplete', callback);
    };
  }, [socket, gamestate, dispatch]);

  if (gamestate === 'ING') {
    console.log(match);
    return <PongGame data={match} />;
  }
  return <></>;
}

export default React.memo(GameQueuing);
