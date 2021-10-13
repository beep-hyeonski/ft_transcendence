/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
const CHECK = 'auth/CHECK' as const;
const LOGIN = 'auth/LOGIN' as const;
const LOGOUT = 'auth/LOGOUT' as const;

export const loginCheck = () => ({ type: CHECK });
export const loginSuccess = (token: string) => ({
  type: LOGIN,
  payload: { token },
});
export const logout = () => ({ type: LOGOUT });

type AuthState = {
  isLoginChecked: boolean;
  token: string;
  isLoggedIn: boolean;
};

type AuthAction =
  | ReturnType<typeof loginCheck>
  | ReturnType<typeof loginSuccess>
  | ReturnType<typeof logout>;

const initialState: AuthState = {
  isLoginChecked: false,
  token: '',
  isLoggedIn: false,
};

export default function authModule(
  state: AuthState = initialState,
  action: AuthAction,
): AuthState {
  switch (action.type) {
    case CHECK:
      return {
        ...state,
        isLoginChecked: true,
      };
    case LOGIN:
      return {
        ...state,
        token: action.payload.token,
        isLoggedIn: true,
      };
    case LOGOUT:
      return {
        ...state,
        isLoggedIn: false,
        token: '',
      };
    default:
      return state;
  }
}
