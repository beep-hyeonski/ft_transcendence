const JOIN_DM = 'chat/JOIN_DM' as const;

interface DMProps {
	message: [],
	index: number,
	username: string,
	userAvatar: string,
};

export const joinDM = (data: DMProps) => ({
	type: JOIN_DM,
	payload: data,
});

type DmAction = ReturnType<typeof joinDM>;

type DmState = {
	message: string[];
	index: number;
	username: string;
	userAvatar: string,
};

const initialState: DmState = {
	message: [],
	index: 0,
	username: '',
	userAvatar: '',
};

export default function dmModule(state: DmState = initialState, action: DmAction) {
	switch (action.type) {
		case JOIN_DM:
			return state;
		default:
			return state;
	}
}