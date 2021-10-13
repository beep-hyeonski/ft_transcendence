import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { RootState } from '../modules';
import { ingGame } from '../modules/gamestate';
import { setGameData, IGameDataProps } from '../modules/gamedata';

function GameQueuing(): JSX.Element {
  const dispatch = useDispatch();
  const history = useHistory();
  const { socket } = useSelector((state: RootState) => state.socketModule);
  const { gamestate } = useSelector(
    (state: RootState) => state.gameStateMoudle,
  );

  useEffect(() => {
    if (gamestate === 'PVPQUEUE' || gamestate === 'MATCHQUEUE') {
      socket?.on('matchComplete', (payload: IGameDataProps) => {
        if (payload.status === 'GAME_START') {
          dispatch(setGameData(payload));
          dispatch(ingGame());
        }
      });
    }
    if (gamestate === 'ING') {
      history.push('/game');
    }
    return () => {
      socket?.off('matchComplete');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket, gamestate, dispatch]);

  return <></>;
}

export default React.memo(GameQueuing);
