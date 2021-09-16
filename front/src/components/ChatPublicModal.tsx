import React from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import {
  Button, Modal, Drawer, GridList,
  IconButton,
} from '@material-ui/core';
import CancelIcon from '@material-ui/icons/Cancel';
import ChatJoinedUser from './ChatJoinedUser';

const useStyles = makeStyles(() => createStyles({
  root: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '80rem',
    height: '45rem',
    backgroundColor: '#282E4E',
    borderRadius: '5px',
    boxShadow: '0.5px 0.5px 2px white',
  },
  title: {
    fontSize: '7rem',
    color: '#F4F3FF',
    marginTop: '1rem',
    marginLeft: '3rem',
    textShadow: '1px 1px 2px black',
  },
  content: {
    marginTop: '1rem',
    marginLeft: '3rem',
    width: '74rem',
    height: '23rem',
    backgroundColor: 'inherit',
  },
  button: {
    position: 'absolute',
    marginTop: '4rem',
    right: '3rem',
    width: '20rem',
    height: '4.5rem',
    fontSize: '25px',
    color: '#282E4E',
    backgroundColor: '#A19BEE',
    '&:hover': {
      backgroundColor: '#8882D5',
    },
    boxShadow: '0.5px 0.5px 3px black',
    textShadow: '1px 1px 1px gray',
  },
  drawerPaper: {
    marginTop: '10rem',
    marginLeft: '3rem',
    width: '74rem',
    height: '23rem',
    backgroundColor: '#F4F3FF',
    borderRadius: '3px',
    boxShadow: '1.5px 1.5px 2px black',
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

const user1 = {
  index: 0,
  nickname: 'user1',
  avatar: 'https://i.pinimg.com/originals/dd/f2/25/ddf225e9914406d5e72aaa241ca5123c.gif',
};

const user2 = {
  index: 1,
  nickname: 'user2',
  avatar: 'https://thumbs.gfycat.com/MerryRichAuklet-max-1mb.gif',
};

const user3 = {
  index: 2,
  nickname: 'user3',
  avatar: 'https://blog.kakaocdn.net/dn/zoXNw/btq1aQQGLZE/FO4BFoXgYhIR404hhzB8G0/img.gif',
};

interface ModalProps {
  open: boolean;
  setModal: React.Dispatch<React.SetStateAction<{
    open: boolean;
    type: string;
  }>>;
}

function ChatPublicModal({ open, setModal } : ModalProps) {
  const classes = useStyles();

  const users = [user1, user2, user3, user1, user2, user3, user1, user2, user3,
    user1, user2, user3, user1, user2, user3, user1, user2, user3];

  const onClickCloseButton = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setModal({ open: false, type: '' });
  };

  const onClickJoinButton = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setModal({ open: false, type: '' });
  };

  return (
    <div>
      <Modal
        open={open}
      >
        <div className={classes.root}>
          <IconButton className={classes.closeButtonLocation} onClick={onClickCloseButton}>
            <CancelIcon className={classes.closeButton} />
          </IconButton>
          <div className={classes.title}>
            title
          </div>
          <Drawer
            classes={{ paper: classes.drawerPaper }}
            className={classes.content}
            variant="permanent"
          >
            <GridList>
              {users.map((user) => (
                <ChatJoinedUser user={user} />
              ))}
            </GridList>
          </Drawer>
          <Button
            variant="contained"
            size="large"
            className={classes.button}
            onClick={onClickJoinButton}
          >
            Join this channel
          </Button>
        </div>
      </Modal>
    </div>
  );
}

export default React.memo(ChatPublicModal);
