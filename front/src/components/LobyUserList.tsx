import React from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import { WbSunnyRounded, NightsStayRounded, AdbRounded } from '@material-ui/icons';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import ListItemText from '@material-ui/core/ListItemText';
import DrawAvatar from './Avatar';
import { changeSideBar, FOLLOW } from '../modules/sidebar';

const useStyles = makeStyles(() => createStyles({
  usernameMargin: {
    marginLeft: '10px',
  },
}));

interface UserdataProps {
  user : {
    nickname: string,
    avatar: string,
    status: string,
  }
}

interface StatusIconProps {
  status: string
}

function StatusIcon({ status }: StatusIconProps): JSX.Element {
  if (status === 'offline') {
    return (
      <NightsStayRounded style={{ color: '#666666' }} />
    );
  }
  if (status === 'ingame') {
    return (
      <AdbRounded style={{ color: '#DAADFF' }} />
    );
  }
  return (
    <WbSunnyRounded style={{ color: '#FFFA66' }} />
  );
}

function LobyUserList({ user } : UserdataProps): JSX.Element {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();

  if (user.status === 'offline') return <></>;

  const onClickLobyUser = () => {
    dispatch(changeSideBar({ type: FOLLOW }));
    history.push(`/profile/${user.nickname}`);
  };

  return (
    <ListItem button key={user.nickname} onClick={onClickLobyUser}>
      <DrawAvatar
        type="sideBarImage"
        username={user.nickname}
        src={user.avatar}
        status={user.status}
      />
      <ListItemText primary={user.nickname} className={classes.usernameMargin} />
      <StatusIcon status={user.status} />
    </ListItem>
  );
}

export default React.memo(LobyUserList);
