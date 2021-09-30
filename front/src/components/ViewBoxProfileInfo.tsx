import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import MatchHistoryList from './MatchHistoryList';
import { RootState } from '../modules';

// TODO: CSS 설정하기
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

function ViewBoxProfileInfo() {
  const classes = useStyles();

  const userdata = useSelector((state: RootState) => state.profileModule);
  const [recode, setRecode] = useState([]);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    axios
      .get(
        `${String(process.env.REACT_APP_API_URL)}/match/${userdata.username}`,
      )
      .then((res) => {
        setRecode(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
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
        {recode.slice(recode.length - 6, recode.length).map((data: any) => (
          <MatchHistoryList key={data.index} history={data} />
        ))}
      </div>
    </div>
  );
}

export default React.memo(ViewBoxProfileInfo);
