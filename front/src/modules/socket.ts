/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Socket } from 'socket.io-client';

const INIT = 'socket/INIT' as const;

export const initSocket = (socket: Socket) => ({
  type: INIT,
  payload: { socket },
});

type SocketState = {
  socket: Socket | null;
};

type SocketAction = ReturnType<typeof initSocket>;

const initialState: SocketState = {
  socket: null,
};

export default function socketModule(
  state: SocketState = initialState,
  action: SocketAction,
): SocketState {
  switch (action.type) {
    case INIT:
      return {
        ...state,
        socket: action.payload.socket,
      };
    default:
      return state;
  }
}
