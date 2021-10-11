import React, { useEffect, useState } from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { ImageList} from '@material-ui/core';
import { getBanUsers } from '../utils/Requests';
import AdminBannedUserElem from './AdminBannedUserElem';

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

function AdminBannedUser(): JSX.Element {
  const classes = useStyles();
  const [banUsers, setBanUsers] = useState<UserdataProps[]>([]);

  useEffect(() => {
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
        {banUsers.map((user) => (
          <AdminBannedUserElem
            key={user.index}
            banUser={user}
            setBanUsers={setBanUsers}
          />
        ))}
      </ImageList>
    </div>
  );
}

export default AdminBannedUser;
