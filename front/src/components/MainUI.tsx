import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { deleteSideData, changeSideBar, MAIN } from '../modules/sidebar';
import GameButton from './GameButton';

function MainUI(): JSX.Element {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(changeSideBar({ type: MAIN }));
  }, [dispatch]);

  return (
    <>
      <GameButton />
    </>
  );
}

export default React.memo(MainUI);
