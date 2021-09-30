import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../modules';
import { changeSideBar, CHAT } from '../modules/sidebar';
import ChatBanner from './ChatBanner';
import ChatTable from './ChatTable';
import ChatRoom from './ChatRoom';

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
    return <ChatRoom />;
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
