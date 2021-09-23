import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { changeSideBar, CHAT } from '../modules/sidebar';
import ChatBanner from './ChatBanner';
import ChatTable from './ChatTable';

function ChatUI(): JSX.Element {
  const [create, setCreate] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(changeSideBar({ type: CHAT }));
  }, [dispatch]);

  const clickCreateChannelButton = () => {
    setCreate(true);
  };

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
