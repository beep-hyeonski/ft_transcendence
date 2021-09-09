import React from 'react';
import { useDispatch } from 'react-redux';
import { deleteSideData } from '../modules/sidebar';
import GameButton from './GameButton';

function MainUI(): JSX.Element {
  const dispatch = useDispatch();

  dispatch(deleteSideData());

  return (
    <>
      <GameButton />
    </>
  );
}

export default React.memo(MainUI);
