import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../modules';
import { deleteSideData } from '../modules/sidebar';
import PongGame from './PongGame';

function GameQueuing(): JSX.Element {
  const dispatch = useDispatch();
  const socket = useSelector((state: RootState) => state.socketModule);
  const [match, setMatch] = useState({
    status: 'QUEUING',
    matchData: {},
  });

  useEffect(() => {
    dispatch(deleteSideData());

    if (match.status === 'QUEUING') {
      socket?.socket?.on('matchComplete', (payload) => {
        console.log(payload);
        if (payload.status === 'GAME_START') {
          setMatch({
            status: 'GAME_START',
            matchData: payload,
          });
        }
      });
    }
  }, [dispatch, match, socket]);

  if (match.status === 'GAME_START') {
    return <PongGame data={match.matchData} setMatch={setMatch} />;
  }
  return <div> game matching</div>;
}

export default React.memo(GameQueuing);
