const JOIN_CHAT_ROOM = 'chat/JOIN_CHAT_ROOM' as const;
const EXIT_CHAT_ROOM = 'chat/EXIT_CHAT_ROOM' as const;

interface ChatRoomProps {
  roomTitle: string,
  roomIndex: number,
  roomUsers: any[],
}

export const joinChatRoom = ({ roomTitle, roomIndex, roomUsers } : ChatRoomProps) => ({
  type: JOIN_CHAT_ROOM,
  isRoom: true,
  index: roomIndex,
  title: roomTitle,
  joinUsers: roomUsers,
});

export const exitChatRoom = () => ({
  type: EXIT_CHAT_ROOM,
});

type ChatAction =
  | ReturnType<typeof joinChatRoom>
  | ReturnType<typeof exitChatRoom>;

type ChatState = {
  isRoom: boolean;
  message: string[];
  index: number;
  title: string;
  joinUsers: any[];
};

const initialState: ChatState = {
  isRoom: false,
  message: [],
  index: -1,
  title: '',
  joinUsers: [],
};

export default function chatModule(state: ChatState = initialState, action: ChatAction) {
  switch (action.type) {
    case JOIN_CHAT_ROOM:
      return { ...state, isRoom: action.isRoom, title: action.title };
    case EXIT_CHAT_ROOM:
      return { ...initialState };
    default:
      return state;
  }
}
