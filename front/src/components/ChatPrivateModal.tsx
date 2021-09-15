import React from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import {
  Button, InputBase, Modal, IconButton,
} from '@material-ui/core';
import CancelIcon from '@material-ui/icons/Cancel';
import { red } from '@material-ui/core/colors';

const useStyles = makeStyles(() => createStyles({
  root: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '50rem',
    height: '24rem',
    backgroundColor: '#282E4E',
    borderRadius: '8px',
    boxShadow: '0.5px 0.5px 2px white',
  },
  title: {
    fontSize: '7rem',
    color: '#F4F3FF',
    marginTop: '0.5rem',
    marginLeft: '2rem',
    textShadow: '1px 1px 2px black',
  },
  input: {
    marginLeft: '4rem',
    marginTop: '1.5rem',
    width: '80%',
    height: '5rem',
    borderRadius: '8px',
    backgroundColor: 'white',
    paddingLeft: '1.2rem',
    fontSize: '2.5rem',
  },
  button: {
    position: 'absolute',
    marginTop: '9rem',
    right: '2rem',
    width: '18rem',
    height: '4rem',
    fontSize: '20px',
    color: '#282E4E',
    backgroundColor: '#A19BEE',
    '&:hover': {
      backgroundColor: '#8882D5',
    },
    boxShadow: '0.5px 0.5px 3px black',
    textShadow: '1px 1px 1px gray',
  },
  closeButtonLocation: {
    position: 'absolute',
    top: '0.5rem',
    right: '0.5rem',
  },
  closeButton: {
    color: '#f35353',
    fontSize: '35px',
    '&:hover': {
      color: '#DA3A3A',
    },
  },
}));

function ChatPrivateModal({ setModal } : any) {
  const classes = useStyles();

  const test = true;
  return (
    <form>
      <Modal
        open={test}
      >
        <div className={classes.root}>
          <IconButton className={classes.closeButtonLocation}>
            <CancelIcon className={classes.closeButton} />
          </IconButton>
          <div className={classes.title}>
            title
          </div>
          <InputBase
            className={classes.input}
            placeholder="Password"
            inputProps={{ 'aria-label': 'search user' }}
            type="text"
            name="input"
          />
          <Button
            variant="contained"
            size="large"
            className={classes.button}
          >
            Join this channel
          </Button>
        </div>
      </Modal>
    </form>
  );
}

export default React.memo(ChatPrivateModal);
