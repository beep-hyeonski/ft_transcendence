import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux';
import { CircularProgress } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { RootState } from '../modules';
import GameQueuing from './GameQueuing';
import MatchAlarm from './MatchAlarm';

const useStyles = makeStyles({
  paper: {
    backgroundColor: '#282E4E',
  },
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
  Button: {
    color: '#F4F3FF',
    fontSize: '12px',
    width: '6vw',
    height: '3.5vh',
    margin: '5px',
    backgroundColor: '#282E4E',
    '&:hover': {
      backgroundColor: '#1C244F',
    },
    '&:focus': {
      backgroundColor: '#3F446E',
    },
  },
});

function GameManager(): JSX.Element {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { gamestate } = useSelector(
    (state: RootState) => state.gameStateMoudle,
  );
  const socket = useSelector((state: RootState) => state.socketModule);
  const history = useHistory();
  const [data, setData] = useState({
    status: 'WAIT',
    matchData: {
      status: '',
      gameName: '',
      sendUserIndex: -1,
      ballSpeed: '',
    },
  });

  useEffect(() => {
    socket?.socket?.on('matchRequest', (gamedata) => {
      setData({
        status: gamedata.status,
        matchData: gamedata,
      });
      console.log(gamedata);
    });
  }, [data, socket]);

  useEffect(() => {
    console.log('state: ', gamestate);
  }, [gamestate]);

  return (
    <>
      {gamestate !== 'WAIT' && <GameQueuing />}
      {gamestate === 'QUEUE' && (
        <>
          <div className={classes.alram}>
            <div className={classes.alramText}>
              게임 큐를 기다리고 있습니다.
            </div>
            <CircularProgress />
          </div>
        </>
      )}
      {data.status !== 'WAIT' && <MatchAlarm data={data} setData={setData} />}
    </>
  );
}

export default React.memo(GameManager);
