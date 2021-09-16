import React from 'react';
import {
  makeStyles,
} from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../modules';

const useStyles = makeStyles({
  alram: {
    backgroundColor: 'white',
    width: '15vw',
    height: '10vh',
    position: 'absolute',
    left: '1%',
    top: '89%',
    alignContent: 'center',
  },
  alarmText: {
    margin: '5px',
    fontSize: '15px',
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
  }
  setData: React.Dispatch<React.SetStateAction<{
    status: string;
    matchData: {
      status: string;
      gameName: string;
      sendUserIndex: number;
      ballSpeed: string;
    };
  }>>
}

const MatchAlarm = ({ data, setData }: MatchAlarmProps) => {
  const classes = useStyles();
  const history = useHistory();
  const socket = useSelector((state: RootState) => state.socketModule);

  const onClickAccept = () => {
    if (data.status === 'REQUEST_MATCH') {
      socket?.socket?.emit('matchResponse', {
        status: 'ACCEPT',
        gameName: data.matchData.gameName,
        sendUserIndex: data.matchData.sendUserIndex,
        ballSpeed: data.matchData.ballSpeed,
      });
      setData({
        status: 'WAITING',
        matchData: {
          status: '',
          gameName: '',
          sendUserIndex: -1,
          ballSpeed: '',
        },
      });
      history.push('/game');
    }
  };

  const onClickReject = () => {
    if (data.status === 'REQUEST_MATCH') {
      socket?.socket?.emit('matchResponse', {
        status: 'REJECT',
        gameName: data.matchData.gameName,
        sendUserIndex: data.matchData.sendUserIndex,
        ballSpeed: data.matchData.ballSpeed,
      });
      setData({
        status: 'WAITING',
        matchData: {
          status: '',
          gameName: '',
          sendUserIndex: -1,
          ballSpeed: '',
        },
      });
      history.push('/');
    }
  };

  return (
    <>
      <Paper variant="outlined" className={classes.alram}>
        <div className={classes.alarmText}>
          대결 요청이 들어왔습니다.
          <br />
          수락하시겠습니까?
        </div>
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
      </Paper>
    </>
  );
};

export default React.memo(MatchAlarm);
