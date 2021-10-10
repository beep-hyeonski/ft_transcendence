import React from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { Modal, Drawer, GridList, IconButton } from '@material-ui/core';
import { useSelector } from 'react-redux';
import CancelIcon from '@material-ui/icons/Cancel';
import { RootState } from '../modules';
import BannedUserElem from './BannedUserElem';

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '80rem',
      height: '38rem',
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
  }),
);

interface ModalProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

function ChatBannedUserMenu({ open, setOpen }: ModalProps) {
  const classes = useStyles();
  const chatData = useSelector((state: RootState) => state.chatModule);

  const onClickCloseButton = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setOpen(false);
  };

  return (
    <div>
      <Modal open={open} onClose={() => setOpen(false)}>
        <div className={classes.root}>
          <IconButton
            className={classes.closeButtonLocation}
            onClick={onClickCloseButton}
          >
            <CancelIcon className={classes.closeButton} />
          </IconButton>
          <div className={classes.title}>Banned User</div>
          <Drawer
            classes={{ paper: classes.drawerPaper }}
            className={classes.content}
            variant="permanent"
          >
            <GridList>
              {chatData.bannedUsers.map((user: any) => (
                <BannedUserElem user={user} key={user.index} />
              ))}
            </GridList>
          </Drawer>
        </div>
      </Modal>
    </div>
  );
}

export default ChatBannedUserMenu;
