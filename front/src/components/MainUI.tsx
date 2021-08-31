import React from 'react';
import SideMenu from './SideMenu';
import GameButton from './GameButton';

function MainUI(): JSX.Element {
  return (
    <>
      <GameButton />
      <SideMenu type="LOBY" />
    </>
  );
}

export default React.memo(MainUI);
