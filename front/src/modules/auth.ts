const CHECK = 'auth/UPDATE' as const;

export const loginCheck = () => ({ type: CHECK });

type AuthState = {
  isLoginChecked: boolean;
};

type AuthAction = ReturnType<typeof loginCheck>;

const initialState: AuthState = {
  isLoginChecked: false,
};

export default function authModule(state: AuthState = initialState, action: AuthAction) {
  switch (action.type) {
    case CHECK:
      return {
        ...state,
        isLoginChecked: true,
      };
    default:
      return state;
  }
}
