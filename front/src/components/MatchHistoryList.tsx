import React from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';
import { RootState } from '../modules';

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      paddingLeft: '5px',
      fontSize: 18,
      marginTop: '15px',
      display: 'flex',
      flexWrap: 'nowrap',
    },
    timestamp: {
      flexBasis: '250px',
    },
    scoreBox: {
      flexBasis: '60px',
    },
    userBox: {
      flexBasis: '180px',
    },
    userBox2: {
      flexBasis: '180px',
      color: 'blue',
    },
  }),
);

interface IMatchHistoryPlayerInfo {
  avatar: string;
  createdAt: string;
  defeat: number;
  email: string;
  index: number;
  isBanned: boolean;
  nickname: string;
  role: string;
  score: number;
  status: string;
  twoFAToken: string;
  useTwoFA: boolean;
  username: string;
  victory: number;
}

interface MatchHistoryListProps {
  history: {
    index: number;
    loser: IMatchHistoryPlayerInfo;
    loserScore: number;
    winner: IMatchHistoryPlayerInfo;
    winnerScore: string;
    createdAt: Date;
  };
}

function MatchHistoryList({ history }: MatchHistoryListProps): JSX.Element {
  const classes = useStyles();
  const mydata = useSelector((state: RootState) => state.userModule);

  return (
    <div className={classes.root}>
      {mydata.nickname !== history.winner.nickname && (
        <div className={classes.userBox}>{history.winner.nickname}</div>
      )}
      {mydata.nickname === history.winner.nickname && (
        <div className={classes.userBox2}>{history.winner.nickname}</div>
      )}
      <div className={classes.scoreBox}>
        {history.winnerScore}
        &nbsp; : &nbsp;
        {history.loserScore}
      </div>
      {mydata.nickname !== history.loser.nickname && (
        <div className={classes.userBox}>{history.loser.nickname}</div>
      )}
      {mydata.nickname === history.loser.nickname && (
        <div className={classes.userBox2}>{history.loser.nickname}</div>
      )}
      <div className={classes.timestamp}>
        ({history.createdAt.toLocaleString()})
      </div>
    </div>
  );
}

export default React.memo(MatchHistoryList);
