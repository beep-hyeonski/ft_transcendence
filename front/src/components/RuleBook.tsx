import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  rule: {
    backgroundColor: 'white',
    width: '520px',
    height: '240px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    border: '1px solid',
    borderColor: '#282E4E',
    borderRadius: '1rem',
  },
  ruleTitle: {
    marginBottom: '10px',
    fontSize: '30px',
  },
  ruleText: {
    margin: '5px',
    fontSize: '18px',
  },
});

function RuleBook(): JSX.Element {
  const classes = useStyles();

  return (
    <>
      <div className={classes.rule}>
        <div className={classes.ruleTitle}>Pongski Game Rule</div>
        <div className={classes.ruleText}>
          In screen, one ball moving to random angle.
          <br />
          Two player is gallkeeper (protect left or right wall)
          <br />
          Player use two key (up, down).
          <br />
          UP key : Move stick at up.
          <br />
          DOWN key : Move stick at down.
          <br />
          Player get one point when ball arrived at enemy player`s wall.
          <br />
          If a player have 3 point, that player win and game finish.
          <br />
        </div>
      </div>
    </>
  );
}

export default React.memo(RuleBook);
