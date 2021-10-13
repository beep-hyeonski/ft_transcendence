import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import MatchHistoryList from './MatchHistoryList';
import { RootState } from '../modules';

const useStyles = makeStyles(() =>
  createStyles({
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
      fontSize: '35px',
      backgroundColor: 'inherit',
    },
  }),
);

interface IMatchPlayerInfo {
  index: number;
  username: string;
  nickname: string;
  email: string;
  avatar: string;
}

interface IMatchDataProps {
  createdAt: string;
  index: number;
  loser: IMatchPlayerInfo;
  loserScore: number;
  winner: IMatchPlayerInfo;
  winnerScore: number;
}

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
  index: number;
  loser: IMatchHistoryPlayerInfo;
  loserScore: number;
  winner: IMatchHistoryPlayerInfo;
  winnerScore: string;
  createdAt: Date;
}

function ViewBoxProfileInfo(): JSX.Element {
  const classes = useStyles();
  const userdata = useSelector((state: RootState) => state.profileModule);
  const [record, setRecord] = useState([]);

  useEffect(() => {
    let isSubscribed = true;
    (async () => {
      try {
        let { data } = await axios.get(`/match/${userdata.username}`);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        data = data.map((match: IMatchDataProps) => ({
          ...match,
          createdAt: new Date(match.createdAt),
        }));
        if (isSubscribed) setRecord(data);
      } catch (err: any) {
        if (err.response.data.message === 'Not Found') {
          alert('존재하지 않는 유저입니다.');
        }
      }
    })();
    return () => {isSubscribed = false};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userdata.username]);

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
        {userdata.victory}승 &nbsp;
        {userdata.defeat}패
      </div>
      <div className={classes.historyBox}>
        <div className={classes.historyBoxTitle}>Match history</div>
        {record.slice(0, 6).map((data: MatchHistoryListProps) => (
          <MatchHistoryList key={data.index} history={data} />
        ))}
      </div>
    </div>
  );
}

export default React.memo(ViewBoxProfileInfo);
