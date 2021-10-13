import React from 'react';
import { useSelector } from 'react-redux';
import { MAIN, FOLLOW, CHAT } from '../modules/sidebar';
import { RootState } from '../modules';
import ChatSideBar from './ChatSideBar';
import LobySideBar from './LobySideBar';
import NavBar from './NavBar';
import ProfileSideBar from './ProfileSideBar';

function SideMenu(): JSX.Element {
  const sidebarStatus = useSelector((state: RootState) => state.sidebarModule);
  return (
    <>
      {sidebarStatus.data.type === MAIN && <LobySideBar />}
      {sidebarStatus.data.type === CHAT && <ChatSideBar />}
      {sidebarStatus.data.type === FOLLOW && <ProfileSideBar />}
      {sidebarStatus.data.type === '' && null}
      <NavBar />
    </>
  );
}

export default React.memo(SideMenu);
