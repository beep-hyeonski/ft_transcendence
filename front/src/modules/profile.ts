const CHANGE_USER = 'profile/CHANGE_USER' as const;

interface DataProps {
  index?: number,
  username?: string,
  nickname?: string,
  email?: string,
  avatar?: string,
  followers?: string[],
  followings?: string[],
  blockers?: string[],
  blockings?: string[],
  score?: number,
  victory?: number,
  defeat?: number,
  useTwoFA?: boolean,
  twoFAToken?: string,
  status?: string,
  created_at?: string,
}

export const changeUser = (userdata: DataProps) => ({
  type: CHANGE_USER,
  payload: { userdata },
});

type UserAction =
  | ReturnType<typeof changeUser>;

  type UserState = {
    index: number,
    username: string,
    nickname: string,
    email: string,
    avatar: string,
    followers: string[],
    followings: string[],
    blockers: string[],
    blockings: string[],
    score: number,
    victory: number,
    defeat: number,
    useTwoFA: boolean,
    twoFAToken: string,
    status: string,
    created_at: string,
  };

const initialState: UserState = {
  index: -1,
  username: '',
  nickname: '',
  email: '',
  avatar: '',
  followers: [],
  followings: [],
  blockers: [],
  blockings: [],
  score: 0,
  victory: 0,
  defeat: 0,
  useTwoFA: false,
  twoFAToken: '',
  status: '',
  created_at: '',
};

export default function profileModule(state: UserState = initialState, action: UserAction) {
  switch (action.type) {
    case CHANGE_USER:
      return { ...state, ...action.payload.userdata };
    default:
      return state;
  }
}
