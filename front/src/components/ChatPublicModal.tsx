import React from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import {
  Button, Modal, Drawer, List, GridList,
} from '@material-ui/core';
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
}));

const user1 = {
  index: 0,
  nickname: 'user1',
  avatar: 'https://i.pravatar.cc/300',
};

const user2 = {
  index: 1,
  nickname: 'user2',
  avatar: 'https://i.pravatar.cc/300',
};

const user3 = {
  index: 2,
  nickname: 'user3',
  avatar: 'https://i.pravatar.cc/300',
};

function ChatPublicModal() {
  const classes = useStyles();

  const users = [user1, user2, user3, user1, user2, user3, user1, user2, user3,
    user1, user2, user3, user1, user2, user3, user1, user2, user3];

  const test = true;
  return (
    <div>
      <Modal
        open={test}
      >
        <div className={classes.root}>
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
          >
            Join this channel
          </Button>
        </div>
      </Modal>
    </div>
  );
}

export default React.memo(ChatPublicModal);
