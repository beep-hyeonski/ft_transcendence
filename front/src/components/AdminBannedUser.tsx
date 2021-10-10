import React, { useEffect, useState } from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { GridList } from '@material-ui/core';
import { getBanUsers } from '../utils/Requests';
import AdminBannedUserElem from './AdminBannedUserElem';
import { BannedUserHandler } from '../utils/errorHandler';

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

function AdminBannedUser(): JSX.Element {
  const classes = useStyles();
  const [banUsers, setBanUsers] = useState<UserdataProps[]>([]);

  useEffect(() => {
    getBanUsers().then((res) => {
			console.log(res);
      setBanUsers(res);
    }).catch((err: any) => {
      if (err.response.data.message === 'User is Banned') {
        BannedUserHandler();
      }
    });
  }, []);

  return (
    <div className={classes.root}>
      <GridList>
        {banUsers.map((user) => (
          <AdminBannedUserElem
            key={user.index}
            banUser={user}
            setBanUsers={setBanUsers}
          />
        ))}
      </GridList>
    </div>
  );
}

export default AdminBannedUser;
