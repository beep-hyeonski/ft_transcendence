import React, { useEffect, useState } from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { GridList } from '@material-ui/core';
import { getUsers } from '../utils/Requests';
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
  avatar: string,
  index: number,
  nickname: string,
  username: string,
  status: string,
  role: string,
}

function AdminUsers(): JSX.Element {
  const classes = useStyles();
  const [users, setUsers] = useState<UserdataProps[]>([]);

  useEffect(() => {
    getUsers().then((res) => {
      setUsers(res);
    }).catch((err) => {
      console.log(err);
    });
  }, []);

  return (
    <div className={classes.root}>
      <GridList>
        {users.map((user) => (
          <AdminUsersElem
            key={user.index}
            user={user}
            setUsers={setUsers}
          />
        ))}
      </GridList>
    </div>
  );
}

export default AdminUsers;
