/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Socket } from 'socket.io-client';

const INIT = 'socket/INIT' as const;
const DELETE = 'socket/DELETE' as const;

export const initSocket = (socket: Socket) => ({
  type: INIT,
  payload: { socket },
});

export const deleteSocket = () => ({
  type: DELETE,
  payload: { socket: null },
});

type SocketState = {
  socket: Socket | null;
};

type SocketAction =
  | ReturnType<typeof initSocket>
  | ReturnType<typeof deleteSocket>;

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
    case DELETE:
      if (state.socket) {
        state.socket.close();
      }
      return {
        ...state,
        socket: null,
      };
    default:
      return state;
  }
}
