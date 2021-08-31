import React from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';

// TODO: CSS 설정하기
const useStyles = makeStyles(() => createStyles({
  root: {
    paddingLeft: '10px',
    paddingRight: '5px',
    fontSize: 25,
    marginTop: '5px',
  },
  timestamp: {
    letterSpacing: '1px',
    backgroundColor: 'inherit',
  },
  recordBox: {
    width: 400,
    display: 'inline-block',
  },
  scoreBox: {
    width: 150,
    display: 'inline-block',
    textAlign: 'center',
  },
  winnerBox: {
    width: 100,
    display: 'inline-block',
  },
}));

interface MatchHistoryListProps {
  history: {
    index: number,
    score1: string;
    score2: string,
    winner: string,
    loser: string,
    timestamp: string,
  }
}

function MatchHistoryList({ history }: MatchHistoryListProps) {
  const classes = useStyles();

  if (history.index > 5) {
    return null;
  }
  return (
    <div className={classes.root}>
      <span className={classes.recordBox}>
        <span className={classes.winnerBox}>
          {history.winner}
        </span>
        <span className={classes.scoreBox}>
          {history.score1}
          &nbsp; : &nbsp;
          {history.score2}
        </span>
        {history.loser}
      </span>
      <span className={classes.timestamp}>
        (
        {history.timestamp}
        )
      </span>
    </div>
  );
}

export default React.memo(MatchHistoryList);
