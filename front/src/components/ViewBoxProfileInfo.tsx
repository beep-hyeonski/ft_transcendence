import React from 'react';
import { useSelector } from 'react-redux';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import MatchHistoryList from './MatchHistoryList';
import { RootState } from '../modules';

// TODO: CSS 설정하기
const useStyles = makeStyles(() => createStyles({
  root: {
    margin: '30px 10px 20px 300px',
    width: 650,
    height: 470,
    backgroundColor: 'inherit',
    alignItems: 'center',
    alignContent: 'center',
  },
  radderBox: {
    position: 'absolute',
    top: '25%',
    left: '33%',
    width: 300,
    height: 100,
    backgroundColor: 'inherit',
    fontSize: '45px',
    textAlign: 'center',
    padding: '5px 0px 0px 0px',
  },
  recordBox: {
    position: 'absolute',
    top: '26%',
    left: '65%',
    width: 300,
    height: 100,
    backgroundColor: 'inherit',
    textAlign: 'center',
    fontSize: '40px',
  },
  historyBox: {
    position: 'absolute',
    top: '45%',
    left: '33%',
    width: 625,
    height: 285,
    backgroundColor: 'inherit',
    border: '2px solid black',
    borderRadius: '8px',
    boxShadow: '0.5px 0.5px 0.5px gray',
  },
  historyBoxTitle: {
    margin: '10px 10px 10px 10px',
    fontSize: '45px',
    backgroundColor: 'inherit',
  },
}));

const data1 = {
  index: 0,
  score1: '3',
  score2: '0',
  winner: 'joockim',
  loser: 'hyeonski',
  timestamp: '21.08.27 05:23',
};

const data2 = {
  index: 1,
  score1: '1',
  score2: '3',
  winner: 'juyang',
  loser: 'jayun',
  timestamp: '21.08.27 06:11',
};

const data3 = {
  index: 2,
  score1: '3',
  score2: '2',
  winner: 'joockim',
  loser: 'hyeonski',
  timestamp: '21.08.27 11:11',
};

const userHistory = [data1, data2, data3];

interface UserDataProps {
  userdata: {
    index: number,
    username: string,
    nickname: string,
    email?: string,
    avatar: string,
    followers?: string[],
    followings?: string[],
    blockers?: string[],
    blockings?: string[],
    score?: number,
    victory?: number,
    defeat?: number,
    useTwoFA: boolean,
    twoFAToken?: string,
    status?: string,
    created_at?: string,
  }
}

function ViewBoxProfileInfo() {
  const classes = useStyles();

  const userdata = useSelector((state: RootState) => state.profileModule);
  const userhistory = { userHistory };

  return (
    <div className={classes.root}>
      <div className={classes.radderBox}>
        Radder
        <br />
        {userdata.score}
      </div>
      <div className={classes.recordBox}>
        최근 전적
        <br />
        {userdata.victory}
        승
        &nbsp;
        {userdata.defeat}
        패
      </div>
      <div className={classes.historyBox}>
        <div className={classes.historyBoxTitle}>
          Match history
        </div>
        {userhistory.userHistory.map((data) => (
          <MatchHistoryList history={data} />
        ))}
      </div>
    </div>
  );
}

export default React.memo(ViewBoxProfileInfo);
