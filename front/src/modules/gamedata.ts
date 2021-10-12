/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
const SETDATA = 'gamedata/SET' as const;
const INITDATA = 'gamedata/INIT' as const;

interface IBallInfo {
  x: number;
  y: number;
  radius: number;
  velocityX: number;
  velocityY: number;
  speed: number;
  color: string;
}

interface IFrameInfo {
  frameWidth: number;
  frameHeight: number;
}

interface IGameInfo {
  ballSpeed: number;
  stickMoveSpeed: number;
  player1: string;
  player1Nickname: string;
  player2: string;
  player2Nickname: string;
}

interface IPlayerInfo {
  x: number;
  y: number;
  stickWidth: number;
  stickHeight: number;
  score: number;
  color: string;
}

export interface IGameDataProps {
  status: string;
  gameName: string;
  ballInfo: IBallInfo;
  frameInfo: IFrameInfo;
  gameInfo: IGameInfo;
  player1Info: IPlayerInfo;
  player2Info: IPlayerInfo;
}

export const setGameData = (data: IGameDataProps) => ({
  type: SETDATA,
  payload: { data },
});

export const initGameData = () => ({
  type: INITDATA,
});

type GameData = {
  gamedata: IGameDataProps;
};

type GameDataAction =
  | ReturnType<typeof setGameData>
  | ReturnType<typeof initGameData>;

const initialState: GameData = {
  gamedata: {
    status: '',
    gameName: '',
    ballInfo: {
      x: 0,
      y: 0,
      radius: 0,
      velocityX: 0,
      velocityY: 0,
      speed: 0,
      color: 'yellow',
    },
    frameInfo: {
      frameWidth: 0,
      frameHeight: 0,
    },
    gameInfo: {
      ballSpeed: 0,
      stickMoveSpeed: 0,
      player1: '',
      player1Nickname: '',
      player2: '',
      player2Nickname: '',
    },
    player1Info: {
      x: 0,
      y: 0,
      stickWidth: 0,
      stickHeight: 0,
      score: 0,
      color: 'blue',
    },
    player2Info: {
      x: 0,
      y: 0,
      stickWidth: 0,
      stickHeight: 0,
      score: 0,
      color: 'red',
    },
  },
};

export default function gameDataMoudle(
  state: GameData = initialState,
  action: GameDataAction,
): GameData {
  switch (action.type) {
    case SETDATA:
      return { ...state, gamedata: action.payload.data };
    case INITDATA:
      return { ...initialState };
    default:
      return state;
  }
}
