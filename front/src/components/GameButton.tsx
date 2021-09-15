import React from 'react';
import Button from '@material-ui/core/Button';
import GavelIcon from '@material-ui/icons/Gavel';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { RootState } from '../modules';

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
  const socket = useSelector((state: RootState) => state.socketModule);

  const clickGamestartButton = () => {
    if (!socket || !socket.socket) {
      return;
    }

    socket.socket.emit('matchQueue', () => {});
    console.log('click gamestart');
  };

  return (
    <div>
      <Link to="/game">
        <Button
          variant="contained"
          size="large"
          className={classes.button}
          startIcon={<GavelIcon style={{ fontSize: '40' }} />}
          onClick={clickGamestartButton}
        >
          GAME START
        </Button>
      </Link>
    </div>
  );
}

export default React.memo(GameButton);
