import React from 'react';
import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ControlPointIcon from '@material-ui/icons/ControlPoint';
import SideMenu from './SideMenu';

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

function ChatUI(): JSX.Element {
  const classes = useStyles();

  const clickCreateButton = () => {
    console.log('create');
  };

  return (
    <>
      <Button
        variant="contained"
        size="large"
        className={classes.button}
        startIcon={<ControlPointIcon style={{ fontSize: '40' }} />}
        onClick={clickCreateButton}
      >
        CREATE CHANNEL
      </Button>
      <SideMenu type="CHAT" />
    </>
  );
}

export default React.memo(ChatUI);
