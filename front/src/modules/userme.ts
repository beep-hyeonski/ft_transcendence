const UPDATE = 'userme/UPDATE' as const;
const DELETE = 'userme/DELETE' as const;

interface DataProps {
  index: number,
  username: string,
  nickname: string,
  email?: string,
  avatar?: string,
  followers?: string[],
  followings?: string[],
  blockers?: string[],
  blockings?: string[],
  score?: number,
  victory?: number,
  defeat?: number,
  useTwoFA: boolean,
  twoFAToken?: string,
  status?: string,
  created_at?: string,
}

export const updateMyData = (data: DataProps) => ({
  type: UPDATE,
  payload: { data },
});

export const deleteMyData = () => ({
  type: DELETE,
  payload: { index: -1, username: '', nickname: '' },
});

type UserAction =
  | ReturnType<typeof updateMyData>
  | ReturnType<typeof deleteMyData>;

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

export default function usermeModule(state: UserState = initialState, action: UserAction) {
  switch (action.type) {
    case UPDATE:
      return { ...state, ...action.payload.data };
    case DELETE:
      return { ...initialState };
    default:
      return state;
  }
}
