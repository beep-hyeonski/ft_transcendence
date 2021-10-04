/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
const JOIN_CHAT_ROOM = 'chat/JOIN_CHAT_ROOM' as const;
const EXIT_CHAT_ROOM = 'chat/EXIT_CHAT_ROOM' as const;

interface ChatRoomProps {
  roomTitle: string;
  roomIndex: number;
  roomStatus: string;
  roomJoinedUsers: any[];
  roomBannedUsers: any[];
  roomAdmins: any[];
  roomMuted: any[];
  roomOwner: string;
}

export const joinChatRoom = ({
  roomTitle,
  roomIndex,
  roomStatus,
  roomJoinedUsers,
  roomBannedUsers,
  roomAdmins,
  roomOwner,
  roomMuted,
}: ChatRoomProps) => ({
  type: JOIN_CHAT_ROOM,
  index: roomIndex,
  title: roomTitle,
  status: roomStatus,
  joinUsers: roomJoinedUsers,
  bannedUsers: roomBannedUsers,
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
  bannedUsers: any[];
  adminUsers: string[];
  ownerUser: string;
  mutedUsers: string[];
};

const initialState: ChatState = {
  message: [],
  index: -1,
  title: '',
  status: '',
  joinUsers: [],
  bannedUsers: [],
  adminUsers: [],
  ownerUser: '',
  mutedUsers: [],
};

export default function chatModule(
  state: ChatState = initialState,
  action: ChatAction,
): ChatState {
  switch (action.type) {
    case JOIN_CHAT_ROOM:
      return {
        ...state,
        title: action.title,
        index: action.index,
        joinUsers: action.joinUsers,
        adminUsers: action.adminUsers,
        bannedUsers: action.bannedUsers,
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
