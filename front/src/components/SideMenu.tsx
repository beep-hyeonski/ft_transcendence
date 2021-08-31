import React from 'react';
import ChatSideBar from './ChatSideBar';
import LobySideBar from './LobySideBar';
import NavBar from './NavBar';
import ProfileSideBar from './ProfileSideBar';

interface SideMenuProps {
  type: string;
}

function SideMenu({ type } : SideMenuProps): JSX.Element {
  return (
    <>
      {type === 'LOBY' && <LobySideBar /> }
      {type === 'CHAT' && <ChatSideBar />}
      {type === 'PROFILE' && <ProfileSideBar />}
      <NavBar />
    </>
  );
}

export default React.memo(SideMenu);
