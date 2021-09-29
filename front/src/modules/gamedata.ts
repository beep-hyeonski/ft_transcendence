/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
const INITDATA = 'gamedata/INIT' as const;
const SETDATA = 'gamedata/SET' as const;

export const initGameData = () => ({
  type: INITDATA,
});

export const setGameData = (data: any) => ({
  type: SETDATA,
  payload: { data },
});

type GameData = {
  gamedata: any;
};

type GameDataAction =
  | ReturnType<typeof initGameData>
  | ReturnType<typeof setGameData>;

const initialState: GameData = {
  gamedata: {},
};

export default function gameDataMoudle(
  state: GameData = initialState,
  action: GameDataAction,
): GameData {
  switch (action.type) {
    case INITDATA:
      return { ...state, gamedata: {} };
    case SETDATA:
      return { ...state, gamedata: action.payload.data };
    default:
      return state;
  }
}
