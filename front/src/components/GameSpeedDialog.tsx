import React from 'react';
import {
  Dialog,
  DialogTitle,
  List,
  ListItem,
  ListItemText,
  ThemeProvider,
  unstable_createMuiStrictModeTheme,
} from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../modules';
import { pvpQueueGame, settingGame } from '../modules/gamestate';

function GameSpeedDialog(): JSX.Element {
  const { socket } = useSelector((state: RootState) => state.socketModule);
  const theme = unstable_createMuiStrictModeTheme();
  const { dialog, receiveUserIndex } = useSelector(
    (state: RootState) => state.gameStateMoudle,
  );
  const dispatch = useDispatch();

  const handleClose = () => {
    dispatch(settingGame(false));
  };

  const handleListItemClick = (value: string) => {
    socket?.on('requestedGame', (payload: any) => {
      dispatch(pvpQueueGame(payload.gameName));
    })
    socket?.emit('matchRequest', {
      receiveUserIndex,
      ballSpeed: value,
    });
    dispatch(settingGame(false));
  };

  return (
    <ThemeProvider theme={theme}>
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
    </ThemeProvider>
  );
}

export default GameSpeedDialog;
