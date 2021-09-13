const UPDATE = 'login/UPDATE' as const;

export const updateLogin = (isLoggedIn : boolean) => ({
  type: UPDATE,
  payload: { isLoggedIn },
});

type LoginState = {
  isLoggedIn: boolean;
};

type LoginAction = ReturnType<typeof updateLogin>;

const initialState: LoginState = {
  isLoggedIn: false,
};

export default function loginModule(state: LoginState = initialState, action: LoginAction) {
  switch (action.type) {
    case UPDATE:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
}
