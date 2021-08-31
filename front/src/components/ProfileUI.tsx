/* eslint-disable no-param-reassign */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import React from 'react';
import { useDispatch } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { changeUser } from '../modules/profile';
import SideMenu from './SideMenu';
import ViewBox from './ViewBox';

function ProfileUI(props: RouteComponentProps<{ id: string }>): JSX.Element {
  const dispatch = useDispatch();

  dispatch(changeUser(props.match.params.id));

  const changeId = (id: string): void => {
    props.history.push(`/profile/${id}`);
  };

  return (
    <>
      <ViewBox changeId={changeId} />
      <SideMenu type="PROFILE" />
    </>
  );
}

export default React.memo(ProfileUI);
