import React from 'react';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
    color: '#F4F3FF',
    position: 'absolute',
    left: '38%',
    top: '48%',
    fontSize: '25px',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#282E4E',
    '&:hover': {
      backgroundColor: '#1C244F',
    },
    '&:focus': {
      backgroundColor: '#3F446E',
    },
  },
}));

function GameButton(): JSX.Element {
  const classes = useStyles();

  const clickGamestartButton = () => {
    console.log('click gamestart');
  };

  return (
    <div>
      <Button
        variant="contained"
        size="large"
        className={classes.button}
        startIcon={<PowerSettingsNewIcon style={{ fontSize: '40' }} />}
        onClick={clickGamestartButton}
      >
        GAME START
      </Button>
    </div>
  );
}

export default React.memo(GameButton);
