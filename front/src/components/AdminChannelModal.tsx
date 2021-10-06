import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { Modal, Drawer, GridList, IconButton, List } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import CancelIcon from '@material-ui/icons/Cancel';
import { getChatInfo } from '../utils/Requests';
import ChattingList from './ChattingList';
import AdminChannelJoinUserElem from './AdminChannelJoinUserElem';

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '90%',
      height: '90%',
      backgroundColor: '#282E4E',
      borderRadius: '5px',
      boxShadow: '0.5px 0.5px 2px white',
    },
    title: {
      fontSize: '7rem',
      color: '#F4F3FF',
      marginLeft: '3rem',
      textShadow: '1px 1px 2px black',
    },
    paper: {
			position: 'absolute',
			transform: 'translate(-50%, -50%)',
			top: '55%',
			left: '50%',
			width: '95%',
			height: '80%',
			backgroundColor: '#F4F3FF',
			display: 'flex',
    },
    closeButtonLocation: {
      position: 'absolute',
      top: '0.5rem',
      right: '0.5rem',
    },
    closeButton: {
      color: '#f35353',
      fontSize: '35px',
      '&:hover': {
        color: '#DA3A3A',
      },
    },
		messageList: {
			width: '75%',
			overflow: 'auto',
      display: 'flex',
			flexDirection: 'column-reverse',
		},
		userList: {
			width: '25%',
			overflow: 'auto',
			borderLeft: '2px solid gray',
		},
  }),
);

interface AdminChannelModalProps {
	chatModal: {
    open: boolean;
    chatIndex: number;
	}
	setModal: React.Dispatch<React.SetStateAction<{
    open: boolean;
    chatIndex: number;
  }>>;
};

interface ChatDataProps {
  index: number;
  title: string;
  status: string;
  joinUsers: any[];
  bannedUsers: any[];
  adminUsers: string[];
  ownerUser: string;
  mutedUsers: string[];
};

interface MessageProps {
  timestamp: string;
  sendUser: {
    nickname: string;
    avatar: string;
  };
  messageContent: string;
}

function AdminChannelModal({ chatModal, setModal }: AdminChannelModalProps) {
  const classes = useStyles();
  const dispatch = useDispatch();
	const [messages, setMsg] = useState<MessageProps[]>([]);
	const [chatData, setChatData] = useState<ChatDataProps>(
		{
			index: 0,
			title: '',
			status: '',
			joinUsers: [],
			bannedUsers: [],
			adminUsers: [],
			ownerUser: '',
			mutedUsers: [],
		}
	);

	useEffect(() => {
		if (chatModal.open) {
			getChatInfo(chatModal.chatIndex).then((res) => {
				console.log(res);
				setChatData(res);
			}).catch((err) => {
				console.log(err.response);
			});

			(async () => {
				try {
					const { data } = await axios.get(
						`${String(process.env.REACT_APP_API_URL)}/chat/${
							chatModal.chatIndex
						}/messages`,
					);
					setMsg(data);
				} catch (err: any) {
					console.log(err.response);
				}
			})();
		}
	}, [chatModal.chatIndex, chatModal.open]);

  const onClickCloseButton = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
		setModal({ open: false, chatIndex: -1 });
  };

  return (
    <div>
      <Modal
        open={chatModal.open}
        onClose={() => setModal({ open: false, chatIndex: -1 })}
      >
        <div className={classes.root}>
          <IconButton
            className={classes.closeButtonLocation}
            onClick={onClickCloseButton}
          >
            <CancelIcon className={classes.closeButton} />
          </IconButton>
          <div className={classes.title}>{chatData.title}</div>
					<div className={classes.paper}>
						<div className={classes.messageList}>
							<List>
								{messages.map((data) => (
									<ChattingList data={data} />
								))}
							</List>
						</div>
						<div className={classes.userList}>
							<List>
								{chatData.joinUsers.map((user) => (
									<AdminChannelJoinUserElem user={user} />
								))}
							</List>
						</div>
					</div>
        </div>
      </Modal>
    </div>
  );
}

export default React.memo(AdminChannelModal);
