import React, { useCallback, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import { useDispatch, useSelector } from 'react-redux';
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
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  alarmText: {
    margin: '5px',
    fontSize: '15px',
    flexBasis: '300px',
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

interface MatchAlarmProps {
  data: {
    status: string;
    matchData: {
      status: string;
      gameName: string;
      sendUserIndex: number;
      ballSpeed: string;
    };
  };
  setData: React.Dispatch<
    React.SetStateAction<{
      status: string;
      matchData: {
        status: string;
        gameName: string;
        sendUserIndex: number;
        ballSpeed: string;
      };
    }>
  >;
}

const MatchAlarm = ({ data, setData }: MatchAlarmProps) => {
  const [rejectCheck, setRejectCheck] = useState<NodeJS.Timeout>();
  const classes = useStyles();
  const dispatch = useDispatch();
  const socket = useSelector((state: RootState) => state.socketModule);

  // useEffect(() => {
  //   console.log('Mount!!');
  //   return () => console.log('Un Mount!!');
  // }, []);

  const autoReject = useCallback(() => {
    if (data.status === 'REQUEST_MATCH') {
      socket?.socket?.emit('matchResponse', {
        status: 'REJECT',
        gameName: data.matchData.gameName,
        sendUserIndex: data.matchData.sendUserIndex,
        ballSpeed: data.matchData.ballSpeed,
      });
      setData({
        status: 'WAIT',
        matchData: {
          status: '',
          gameName: '',
          sendUserIndex: -1,
          ballSpeed: '',
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const rejectCheckTmp = setTimeout(() => {
      autoReject();
    }, 30000);
    setRejectCheck(rejectCheckTmp);
    return () => {
      clearTimeout(rejectCheckTmp);
    };
  }, [autoReject]);

  const onClickAccept = () => {
    if (rejectCheck) {
      clearTimeout(rejectCheck);
    }
    socket?.socket?.emit('matchResponse', {
      status: 'ACCEPT',
      gameName: data.matchData.gameName,
      sendUserIndex: data.matchData.sendUserIndex,
      ballSpeed: data.matchData.ballSpeed,
    });
    setData({
      status: 'WAIT',
      matchData: {
        status: '',
        gameName: '',
        sendUserIndex: -1,
        ballSpeed: '',
      },
    });

    const callback = (payload: any) => {
      if (payload.status === 'GAME_START') {
        dispatch(setGameData(payload));
        dispatch(ingGame());
      }
    };

    socket?.socket?.on('matchComplete', callback);
    return () => {
      socket?.socket?.off('matchComplete');
    };
  };

  const onClickReject = () => {
    if (rejectCheck) {
      clearTimeout(rejectCheck);
    }
    socket?.socket?.emit('matchResponse', {
      status: 'REJECT',
      gameName: data.matchData.gameName,
      sendUserIndex: data.matchData.sendUserIndex,
      ballSpeed: data.matchData.ballSpeed,
    });
    setData({
      status: 'WAIT',
      matchData: {
        status: '',
        gameName: '',
        sendUserIndex: -1,
        ballSpeed: '',
      },
    });
  };

  return (
    <>
      <Paper variant="outlined" className={classes.alram}>
        <div>
          <div className={classes.alarmText}>
            대결 요청이 들어왔습니다.
            <br />
            수락하시겠습니까?
          </div>
        </div>
        <div>
          <Button
            variant="contained"
            size="large"
            className={classes.Button}
            onClick={onClickAccept}
          >
            수락
          </Button>
          <Button
            variant="contained"
            size="large"
            className={classes.Button}
            onClick={onClickReject}
          >
            거절
          </Button>
        </div>
      </Paper>
    </>
  );
};

export default React.memo(MatchAlarm);
