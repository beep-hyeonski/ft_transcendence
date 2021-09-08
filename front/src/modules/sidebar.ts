const CHAT_LIST = 'sidebar/CHAT_LIST' as const;
const FOLLOW_LIST = 'sidebar/FOLLOW_LIST' as const;
const DELETE = 'sidebar/DELETE' as const;

export const change2Chat = () => ({
  type: CHAT_LIST,
});

export const change2Follow = () => ({
  type: FOLLOW_LIST,
});

export const deleteData = () => ({
  type: DELETE,
});

type SidebarState = {
  data: any,
};

type SidebarAction =
| ReturnType<typeof change2Chat>
| ReturnType<typeof change2Follow>
| ReturnType<typeof deleteData>;

// data는 아직 임시이기에 any로 넣어두고 아무 props나 받을 수 있도록 잡아둠
const initialState: SidebarState = {
  data: {},
};

export default function sidebarModule(state: SidebarState = initialState, action: SidebarAction) {
  switch (action.type) {
    case CHAT_LIST:
      return { ...state };
    case FOLLOW_LIST:
      return { ...state };
    case DELETE:
      return { ...initialState };
    default:
      return state;
  }
}
