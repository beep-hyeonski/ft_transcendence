import React from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { Avatar, Button } from '@material-ui/core';
import axios from 'axios';
import SideMenu from './SideMenu';
import SettingInputs from './SettingInputs';

const useStyles = makeStyles(() => createStyles({
  title: {
    color: '#282E4E',
    fontSize: '40px',
    margin: '30px 25px',
    letterSpacing: '3px',
    textShadow: '1px 1px 1px gray',
  },
  divStyle: {
    position: 'absolute',
    left: '41%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    height: '650px',
    width: '1000px',
    backgroundColor: 'white',
    border: '1px solid white',
    borderRadius: '10px',
    boxShadow: '3.5px 3.5px 3px gray',
  },
  profileImage: {
    position: 'absolute',
    left: '20%',
    top: '45%',
    transform: 'translate(-50%, -50%)',
    width: '275px',
    height: '275px',
    boxShadow: '1px 1px 1.5px lightgray',
  },
  changeButton: {
    position: 'absolute',
    left: '20%',
    top: '75%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#F4F3FF',
    color: '#282E4E',
    width: 150,
    height: 50,
    textTransform: 'none',
    textShadow: '0.5px 0.5px 0.5px gray',
    boxShadow: '1px 1px 1px gray',
    '&:hover': {
      backgroundColor: '#e3e0ff',
    },
  },
}));

const getMyInfo = async () => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  console.log(axios.defaults.headers.common.Authorization);
  const response = await axios.get(`${String(process.env.REACT_APP_API_URL)}/users/me`);
  console.log(response);
  console.log('res');
  return response;
};

function Setting() {
  const classes = useStyles();

  const clickChangeImageButton = (e: React.MouseEvent<HTMLButtonElement>) => {
    console.log('clickChangeButton');
  };

  const clickSaveButton = (form: { nickname: string; email: string; }) => {
    // const res = getMyInfo();
    // console.log(res);
  };

  return (
    <>
      <div className={classes.divStyle}>
        <div className={classes.title}>
          Setting
        </div>
        <Avatar
          className={classes.profileImage}
          src="https://i.pinimg.com/736x/8d/47/d2/8d47d2a8b2220c562508b7bda34bb2fb.jpg"
        />
        <Button className={classes.changeButton} variant="text" onClick={clickChangeImageButton}>
          Change Image
        </Button>
        <SettingInputs onSubmit={clickSaveButton} buttonName="Save" />
      </div>
      <SideMenu type="PROFILE" />
    </>
  );
}

export default React.memo(Setting);
