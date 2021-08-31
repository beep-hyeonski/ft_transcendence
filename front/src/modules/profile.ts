const USER = 'profile/USER' as const;

export const changeUser = (userid: string) => ({
  type: USER,
  id: userid,
});

type UserAction =
  | ReturnType<typeof changeUser>;

type UserState = {
  id: string;
};

const initialState: UserState = {
  id: '',
};

export default function userModule(state: UserState = initialState, action: UserAction) {
  switch (action.type) {
    case USER:
      return { ...state, id: action.id };
    default:
      return state;
  }
}
