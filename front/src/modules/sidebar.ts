/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
const CHANGE_STATUS = 'sidebar/CHANGE_STATUS' as const;
const DELETE = 'sidebar/DELETE' as const;

export const CHAT = 'CHAT';
export const FOLLOW = 'FOLLOW';
export const MAIN = 'MAIN';

interface SidebarDataProps {
  type: string;
}

export const changeSideBar = (data: SidebarDataProps) => ({
  type: CHANGE_STATUS,
  payload: { data },
});

export const deleteSideData = () => ({
  type: DELETE,
});

type SidebarState = {
  data: SidebarDataProps;
};

type SidebarAction =
  | ReturnType<typeof changeSideBar>
  | ReturnType<typeof deleteSideData>;

const initialState: SidebarState = {
  data: {
    type: '',
  },
};

export default function sidebarModule(
  state: SidebarState = initialState,
  action: SidebarAction,
): SidebarState {
  switch (action.type) {
    case CHANGE_STATUS:
      return { ...state, data: action.payload.data };
    case DELETE:
      return { ...initialState };
    default:
      return state;
  }
}
