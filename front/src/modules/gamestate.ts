/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
const GAMEWAIT = 'gamestate/WAIT' as const;
const MATCHGAMEQUEUE = 'gamestate/MATCHQUEUE' as const;
const PVPGAMEQUEUE = 'gamestate/PVPQUEUE' as const;
const GAMEING = 'gamestate/ING' as const;

export const waitGame = () => ({
  type: GAMEWAIT,
});

export const matchQueueGame = () => ({
  type: MATCHGAMEQUEUE,
});

export const pvpQueueGame = () => ({
  type: PVPGAMEQUEUE,
})

export const ingGame = () => ({
  type: GAMEING,
});

type GameState = {
  gamestate: string,
};

type GameStateAction =
| ReturnType<typeof waitGame>
| ReturnType<typeof matchQueueGame>
| ReturnType<typeof pvpQueueGame>
| ReturnType<typeof ingGame>;

const initialState: GameState = {
  gamestate: 'WAIT',
};

export default function gameStateMoudle(
  state: GameState = initialState,
  action: GameStateAction,
) {
  switch (action.type) {
    case GAMEWAIT:
      return { ...state, gamestate: 'WAIT' };
    case MATCHGAMEQUEUE:
      return { ...state, gamestate: 'MATCHQUEUE' };
    case PVPGAMEQUEUE:
      return { ...state, gamestate: 'PVPQUEUE' };
    case GAMEING:
      return { ...state, gamestate: 'ING' };
    default:
      return state;
  }
}
