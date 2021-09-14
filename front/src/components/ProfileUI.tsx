/* eslint-disable no-param-reassign */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import axios from 'axios';
import { changeUser } from '../modules/profile';
import ViewBox from './ViewBox';
import { RootState } from '../modules';
import { changeSideBar, FOLLOW } from '../modules/sidebar';

function ProfileUI(props: RouteComponentProps<{ id: string }>): JSX.Element {
  const dispatch = useDispatch();
  const userdata = useSelector((state: RootState) => state.profileModule);
  const { id } = props.match.params;
  const [isValid, setIsValid] = useState(true);

  const changeId = (userid: string): void => {
    props.history.push(`/profile/${userid}`);
  };

  useEffect(() => {
    dispatch(changeSideBar({ type: FOLLOW }));
    axios.get(`${String(process.env.REACT_APP_API_URL)}/users/${id}`).then((res) => {
      dispatch(changeUser(res.data));
      setIsValid(true);
    }).catch((err) => {
      console.log(err);
      if (err.response.status === 404) {
        setIsValid(false);
      }
    });
  }, [dispatch, props, id]);

  return (
    <>
      <ViewBox changeId={changeId} isValid={isValid} />
    </>
  );
}

export default React.memo(ProfileUI);
