const CHANGE_STATUS = 'sidebar/CHANGE_STATUS' as const;
const DELETE = 'sidebar/DELETE' as const;

export const CHAT = 'CHAT';
export const FOLLOW = 'FOLLOW';
export const MAIN = 'MAIN';

interface SidebarDataProps {
  type: string;
}

export const changeStatus = (data: SidebarDataProps) => ({
  type: CHANGE_STATUS,
  payload: { data },
});

export const deleteSideData = () => ({
  type: DELETE,
});

type SidebarState = {
  data: SidebarDataProps,
};

type SidebarAction =
| ReturnType<typeof changeStatus>
| ReturnType<typeof deleteSideData>;

// data는 아직 임시이기에 any로 넣어두고 아무 props나 받을 수 있도록 잡아둠
const initialState: SidebarState = {
  data: {
    type: MAIN,
  },
};

export default function sidebarModule(state: SidebarState = initialState, action: SidebarAction) {
  switch (action.type) {
    case CHANGE_STATUS:
      return { ...state, data: action.payload.data };
    case DELETE:
      return { ...initialState };
    default:
      return state;
  }
}
