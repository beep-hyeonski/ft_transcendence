/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
const GAMEWAIT = 'gamestate/WAIT' as const;
const MATCHGAMEQUEUE = 'gamestate/MATCHQUEUE' as const;
const PVPGAMEQUEUE = 'gamestate/PVPQUEUE' as const;
const GAMEING = 'gamestate/ING' as const;
const SETTING_GAME = 'gamestate/SETTING' as const;

export const waitGame = () => ({
  type: GAMEWAIT,
});

export const matchQueueGame = () => ({
  type: MATCHGAMEQUEUE,
});

export const pvpQueueGame = (gameName: string) => ({
  type: PVPGAMEQUEUE,
  gameName,
});

export const ingGame = () => ({
  type: GAMEING,
});

export const settingGame = (status: boolean, userIndex = -1) => ({
  type: SETTING_GAME,
  dialog: status,
  receiveUserIndex: userIndex,
});

type GameState = {
  gamestate: string;
  dialog: boolean;
  receiveUserIndex: number;
  gameName: string;
};

type GameStateAction =
  | ReturnType<typeof waitGame>
  | ReturnType<typeof matchQueueGame>
  | ReturnType<typeof pvpQueueGame>
  | ReturnType<typeof ingGame>
  | ReturnType<typeof settingGame>;

const initialState: GameState = {
  gamestate: 'WAIT',
  dialog: false,
  receiveUserIndex: -1,
  gameName: '',
};

export default function gameStateMoudle(
  state: GameState = initialState,
  action: GameStateAction,
) {
  switch (action.type) {
    case GAMEWAIT:
      return { ...state, gamestate: 'WAIT', };
    case MATCHGAMEQUEUE:
      return { ...state, gamestate: 'MATCHQUEUE' };
    case PVPGAMEQUEUE:
      return { ...state, gamestate: 'PVPQUEUE', gameName: action.gameName };
    case GAMEING:
      return { ...state, gamestate: 'ING' };
    case SETTING_GAME:
      return {
        ...state,
        dialog: action.dialog,
        receiveUserIndex: action.receiveUserIndex,
      };
    default:
      return state;
  }
}
