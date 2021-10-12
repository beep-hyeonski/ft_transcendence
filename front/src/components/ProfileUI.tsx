/* eslint-disable no-param-reassign */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import axios from 'axios';
import { changeUser } from '../modules/profile';
import ViewBox from './ViewBox';
import { changeSideBar, FOLLOW } from '../modules/sidebar';

function ProfileUI(props: RouteComponentProps<{ id: string }>): JSX.Element {
  const dispatch = useDispatch();
  const { id } = props.match.params;
  const [isValid, setIsValid] = useState(true);

  const changeId = (userid: string): void => {
    props.history.push(`/profile/${userid}`);
  };

  useEffect(() => {
    dispatch(changeSideBar({ type: FOLLOW }));
    axios
      .get(`/users/${id}`)
      .then((res) => {
        dispatch(changeUser(res.data));
        setIsValid(true);
      })
      .catch((err: any) => {
        if (err.response.status === 404) {
          setIsValid(false);
        }
      });
  }, [dispatch, id]);

  return (
    <>
      <ViewBox changeId={changeId} isValid={isValid} />
    </>
  );
}

export default React.memo(ProfileUI);
