import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';

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

const RejectAlarm = () => {
  const classes = useStyles();

  return (
    <>
      <Paper variant="outlined" className={classes.alram}>
        <div>
          <div className={classes.alarmText}>대결 요청이 거절되었습니다.</div>
        </div>
      </Paper>
    </>
  );
};

export default React.memo(RejectAlarm);
