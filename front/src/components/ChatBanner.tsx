import React from 'react';
import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ControlPointIcon from '@material-ui/icons/ControlPoint';
import CreateChannelModal from './CreateChannelModal';

const useStyles = makeStyles(() => ({
  root: {
    width: '100%',
    height: '7rem',
    backgroundColor: '#3f446e',
    border: '0px',
    display: 'inline-flex',
  },
  createButton: {
    position: 'absolute',
    marginTop: '25px',
    marginLeft: '60%',
    color: '#F4F3FF',
    fontSize: '25px',
    backgroundColor: '#282E4E',
    '&:hover': {
      backgroundColor: '#1C244F',
    },
  },
  textArea: {
    fontSize: '70px',
    color: '#F4F3FF',
    letterSpacing: '0.2rem',
    marginTop: '10px',
    marginLeft: '22px',
    textShadow: '1px 1px 1.5px black',
  },
}));

interface ChatBannerProps {
  clickCreateChannelButton: () => void;
  create: boolean;
  setCreate: React.Dispatch<React.SetStateAction<boolean>>;
}

function ChatBanner({
  clickCreateChannelButton,
  create,
  setCreate,
}: ChatBannerProps): JSX.Element {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.textArea}>참가할 수 있는 채널</div>
      <Button
        variant="contained"
        size="large"
        className={classes.createButton}
        startIcon={<ControlPointIcon style={{ fontSize: '40' }} />}
        onClick={clickCreateChannelButton}
      >
        CREATE CHANNEL
      </Button>
      <CreateChannelModal create={create} setCreate={setCreate} />
    </div>
  );
}

export default React.memo(ChatBanner);
