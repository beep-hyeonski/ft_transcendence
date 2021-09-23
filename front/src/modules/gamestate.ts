const GAMEWAIT = 'gamestate/WAIT' as const;
const GAMEQUEUE = 'gamestate/QUEUE' as const;
const GAMEING = 'gamestate/ING' as const;

export const waitGame = () => ({
  type: GAMEWAIT,
});

export const queueGame = () => ({
  type: GAMEQUEUE,
});

export const ingGame = () => ({
  type: GAMEING,
});

type GameState = {
  gamestate: string,
};

type GameStateAction =
| ReturnType<typeof waitGame>
| ReturnType<typeof queueGame>
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
    case GAMEQUEUE:
      return { ...state, gamestate: 'QUEUE' };
    case GAMEING:
      return { ...state, gamestate: 'ING' };
    default:
      return state;
  }
}
