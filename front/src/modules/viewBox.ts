const PROFILE_OPEN = 'viewBox/PROFILE_OPEN' as const;
const CREATEROOM_OPEN = 'viewBox/CREATEROOM_OPEN' as const;
const CLOSE = 'viewBox/CLOSE' as const;
const FOLLOW = 'sidebar/FOLLOW' as const;
const CHAT = 'sidebat/CHAT' as const;

export const openProfile = () => ({ type: PROFILE_OPEN });
export const openCreateRoom = () => ({ type: CREATEROOM_OPEN });
export const close = () => ({ type: CLOSE });
export const showFollow = () => ({ type: FOLLOW });
export const showRoom = () => ({ type: CHAT });

type CounterAction =
  | ReturnType<typeof openProfile>
  | ReturnType<typeof close>
  | ReturnType<typeof showFollow>
  | ReturnType<typeof showRoom>
  | ReturnType<typeof openCreateRoom>;

type ProfileState = {
  profilewindowstate: boolean;
  createroomstate: boolean;
  followliststate: boolean;
  chatroomstate: boolean;
};

const initialState: ProfileState = {
  profilewindowstate: false,
  createroomstate: false,
  followliststate: true,
  chatroomstate: false,
};

export default function viewBoxModule(state: ProfileState = initialState, action: CounterAction) {
  switch (action.type) {
    case PROFILE_OPEN:
      return { ...state, profilewindowstate: !state.profilewindowstate, createroomstate: false };
    case CREATEROOM_OPEN:
      return { ...state, profilewindowstate: false, createroomstate: true };
    case CLOSE:
      return { ...state, profilewindowstate: false, createroomstate: false };
    case FOLLOW:
      return { ...state, followliststate: true, chatroomstate: false };
    case CHAT:
      return { ...state, followliststate: false, chatroomstate: true };
    default:
      return state;
  }
}
