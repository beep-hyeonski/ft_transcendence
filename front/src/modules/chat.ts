const JOIN_CHAT_ROOM = 'chat/JOIN_CHAT_ROOM' as const;
const EXIT_CHAT_ROOM = 'chat/EXIT_CHAT_ROOM' as const;

interface ChatRoomProps {
  roomTitle: string;
  roomIndex: number;
  roomPassword: string;
  roomStatus: string;
  roomJoinedUsers: any[];
  roomAdmins: any[];
  roomMuted: any[];
  roomOwner: string;
}

export const joinChatRoom = ({
  roomTitle,
  roomIndex,
  roomPassword,
  roomStatus,
  roomJoinedUsers,
  roomAdmins,
  roomOwner,
  roomMuted,
}: ChatRoomProps) => ({
  type: JOIN_CHAT_ROOM,
  index: roomIndex,
  title: roomTitle,
  status: roomStatus,
  joinUsers: roomJoinedUsers,
  password: roomPassword,
  adminUsers: roomAdmins,
  ownerUser: roomOwner,
  mutedUsers: roomMuted,
});

export const exitChatRoom = () => ({
  type: EXIT_CHAT_ROOM,
});

type ChatAction =
  | ReturnType<typeof joinChatRoom>
  | ReturnType<typeof exitChatRoom>;

type ChatState = {
  message: string[];
  index: number;
  title: string;
  status: string;
  joinUsers: any[];
  password: string;
  adminUsers: string[],
  ownerUser: string,
  mutedUsers: string[],
};

const initialState: ChatState = {
  message: [],
  index: -1,
  title: '',
  status: '',
  joinUsers: [],
  password: '',
  adminUsers: [],
  ownerUser: '',
  mutedUsers: [],
};

export default function chatModule(
  state: ChatState = initialState,
  action: ChatAction,
) {
  switch (action.type) {
    case JOIN_CHAT_ROOM:
      return {
        ...state,
        title: action.title,
        index: action.index,
        joinUsers: action.joinUsers,
        password: action.password,
        adminUsers: action.adminUsers,
        ownerUser: action.ownerUser,
        mutedUsers: action.mutedUsers,
        status: action.status,
      };
    case EXIT_CHAT_ROOM:
      return { ...initialState };
    default:
      return state;
  }
}
