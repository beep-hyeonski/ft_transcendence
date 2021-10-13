import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux';
import { CircularProgress, Button } from '@material-ui/core';
import { RootState } from '../modules';
import GameQueuing from './GameQueuing';
import MatchAlarm from './MatchAlarm';
import { waitGame, pvpQueueGame } from '../modules/gamestate';
import RejectAlarm from './RejectAlarm';

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
  subDiv: {
    display: 'flex',
  },
  cancleButton: {
    backgroundColor: '#CE6F84',
    color: '#F4F3FF',
    marginTop: '8px',
    width: 20,
    height: 20,
    textTransform: 'none',
    textShadow: '1px 1px 0.5px gray',
    boxShadow: '1px 1px 1px gray',
    '&:hover': {
      backgroundColor: '#cc6b80',
    },
  },
});

function GameManager(): JSX.Element {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { gamestate, gameName } = useSelector(
    (state: RootState) => state.gameStateMoudle,
  );
  const { socket } = useSelector((state: RootState) => state.socketModule);
  const [data, setData] = useState({
    status: 'WAIT',
    matchData: {
      status: '',
      gameName: '',
      sendUserNickname: '',
      sendUserIndex: -1,
      ballSpeed: '',
    },
  });
  const [answer, setAnswer] = useState('');

  useEffect(() => {
    socket?.on('gameException', (payload) => {
      if (payload.message === 'Game does not exist') {
        dispatch(waitGame());
        alert('취소 된 게임입니다.');
      }
    });
  }, [dispatch, socket]);

  useEffect(() => {
    socket?.on('matchRequest', (gamedata) => {
      setData({
        status: gamedata.status,
        matchData: gamedata,
      });
      dispatch(pvpQueueGame(data.matchData.gameName));
    });
    return () => {
      socket?.off('matchRequest');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);

  useEffect(() => {
    socket?.on('cancelComplete', (payload) => {
      if (payload.status === 'CANCELED') {
        dispatch(waitGame());
      }
    });
    return () => {
      socket?.off('cancleComplete');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);

  useEffect(() => {
    socket?.on('matchReject', (payload) => {
      setAnswer(payload.status);
    });
    if (answer === 'MATCH_REJECT') {
      setTimeout(() => {
        dispatch(waitGame());
        setAnswer('');
      }, 2000);
    }
    return () => {
      socket?.off('matchReject');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answer, socket]);

  const clickCancleButton = () => {
    socket?.emit('cancelQueue', () => {});
  };

  const clickPVPCancleButton = () => {
    socket?.emit('cancelRequest', { gameName });
  };

  return (
    <>
      {gamestate !== 'WAIT' && <GameQueuing />}
      {(gamestate === 'PVPQUEUE' || gamestate === 'MATCHQUEUE') &&
        answer !== 'MATCH_REJECT' && (
          <>
            <div className={classes.alram}>
              <div className={classes.subDiv}>
                <div className={classes.alramText}>
                  게임 큐를 기다리고 있습니다.
                </div>
                {gamestate === 'MATCHQUEUE' && (
                  <Button
                    className={classes.cancleButton}
                    onClick={clickCancleButton}
                  >
                    x
                  </Button>
                )}
                {gamestate === 'PVPQUEUE' && (
                  <Button
                    className={classes.cancleButton}
                    onClick={clickPVPCancleButton}
                  >
                    x
                  </Button>
                )}
              </div>
              <CircularProgress />
            </div>
          </>
        )}
      {answer === 'MATCH_REJECT' && <RejectAlarm />}
      {data.status === 'REQUEST_MATCH' && (
        <MatchAlarm data={data} setData={setData} />
      )}
    </>
  );
}

export default React.memo(GameManager);
