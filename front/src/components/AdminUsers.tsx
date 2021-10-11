import React, { useEffect, useState } from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { ImageList } from '@material-ui/core';
import { getBanUsers, getUsers } from '../utils/Requests';
import AdminUsersElem from './AdminUsersElem';

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '95%',
      height: '95%',
      border: '2px solid gray',
      borderRadius: '8px',
    },
  }),
);

interface UserdataProps {
  avatar: string;
  index: number;
  nickname: string;
  username: string;
  status: string;
  role: string;
}

function AdminUsers(): JSX.Element {
  const classes = useStyles();
  const [users, setUsers] = useState<UserdataProps[]>([]);
  const [banUsers, setBanUsers] = useState<UserdataProps[]>([]);

  useEffect(() => {
    getUsers()
      .then((res) => {
        setUsers(res);
      })
      .catch((err: any) => {
        console.log(err.response);
      });

    getBanUsers()
      .then((res) => {
        setBanUsers(res);
      })
      .catch((err: any) => {
        console.log(err.response);
      });
  }, []);

  return (
    <div className={classes.root}>
      <ImageList>
        {users.map((user) => (
          <AdminUsersElem
            key={user.index}
            user={user}
            setUsers={setUsers}
            banUsers={banUsers}
            setBanUsers={setBanUsers}
          />
        ))}
      </ImageList>
    </div>
  );
}

export default AdminUsers;
