import React from 'react';
import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ControlPointIcon from '@material-ui/icons/ControlPoint';
import SideMenu from './SideMenu';
import ChatBanner from './ChatBanner';
import ChatTable from './ChatTable';
import ChatPublicModal from './ChatPublicModal';

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
    color: '#F4F3FF',
    position: 'absolute',
    fontSize: '25px',
    right: '20%',
    backgroundColor: '#282E4E',
    '&:hover': {
      backgroundColor: '#1C244F',
    },
    '&:focus': {
      backgroundColor: '#3F446E',
    },
  },
}));

function ChatUI(): JSX.Element {
  return (
    <>
      <ChatBanner />
      <ChatTable />
    </>
  );
}

export default React.memo(ChatUI);
