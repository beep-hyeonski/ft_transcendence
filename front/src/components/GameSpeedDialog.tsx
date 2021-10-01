import {
	Dialog, DialogTitle, List, ListItem,
	ListItemText,
} from '@material-ui/core';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../modules';
import { pvpQueueGame, settingGame } from '../modules/gamestate';

function GameSpeedDialog() : JSX.Element {
  const userdata = useSelector((state: RootState) => state.profileModule);
  const socket = useSelector((state: RootState) => state.socketModule);
	const { dialog, receiveUserIndex } = useSelector((state: RootState) => state.gameStateMoudle);
  const dispatch = useDispatch();

  const handleClose = () => {
    dispatch(settingGame(false));
  };

  const handleListItemClick = (value: string) => {
    console.log(value);
    socket?.socket?.emit('matchRequest', {
			receiveUserIndex,
      ballSpeed: value,
    });
		dispatch(settingGame(false));
    dispatch(pvpQueueGame());
  };

  return (
    <Dialog onClose={handleClose} open={dialog}>
      <DialogTitle>SELECT GAME SPEED</DialogTitle>
      <List>
        <ListItem button onClick={() => handleListItemClick('NORMAL')}>
          <ListItemText primary="NORMAL" />
        </ListItem>
        <ListItem button onClick={() => handleListItemClick('FAST')}>
          <ListItemText primary="FAST" />
        </ListItem>
      </List>
    </Dialog>
  );
}

export default GameSpeedDialog;