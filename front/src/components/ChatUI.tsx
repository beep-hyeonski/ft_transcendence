import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../modules';
import { changeSideBar, CHAT } from '../modules/sidebar';
import ChatBanner from './ChatBanner';
import ChatTable from './ChatTable';
import ChatRoom from './ChatRoom';

const getChatInfo = async (index: number) => {
  const response = await axios.get(`${String(process.env.REACT_APP_API_URL)}/chat/${index}`);
  return response.data;
};

function ChatUI(): JSX.Element {
  const [create, setCreate] = useState(false);
  const dispatch = useDispatch();
  const chatIndex = useSelector((state: RootState) => state.chatModule.index);

  useEffect(() => {
    dispatch(changeSideBar({ type: CHAT }));
  }, [dispatch]);

  const clickCreateChannelButton = () => {
    setCreate(true);
  };

  if (chatIndex !== -1) {
    return (
      <ChatRoom />
    );
  }

  return (
    <>
      <ChatBanner
        clickCreateChannelButton={clickCreateChannelButton}
        create={create}
        setCreate={setCreate}
      />
      <ChatTable create={create} />
    </>
  );
}

export default React.memo(ChatUI);
