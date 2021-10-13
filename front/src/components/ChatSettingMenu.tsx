import React, { useEffect, useState } from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import InputBase from '@material-ui/core/InputBase';
import Radio from '@material-ui/core/Radio';
import { useDispatch, useSelector } from 'react-redux';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { Box, IconButton, Modal } from '@material-ui/core';
import CancelIcon from '@material-ui/icons/Cancel';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import { RootState } from '../modules';
import { joinChatRoom } from '../modules/chat';
import { getUserme } from '../utils/Requests';
import { updateUser } from '../modules/user';
import { logoutSequence } from '../utils/logoutSequence';

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '80rem',
      height: '45rem',
      backgroundColor: '#282E4E',
      borderRadius: '8px',
      boxShadow: '0.5px 0.5px 2px white',
    },
    title: {
      fontSize: '6rem',
      color: '#F4F3FF',
      marginTop: '1.5rem',
      marginLeft: '2rem',
      wordSpacing: '5px',
      textShadow: '1px 1px 2px lightgray',
      letterSpacing: '2px',
    },
    inputBox: {
      position: 'absolute',
      top: '58%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '90%',
      height: '72%',
      backgroundColor: 'white',
      border: '1px solid #FFFFFF',
      borderRadius: '8px',
      boxShadow: '3px 3px 3px gray',
    },
    channelName: {
      border: '2px solid black',
      borderRadius: '10px',
      marginTop: '4rem',
      marginLeft: '5rem',
      paddingLeft: '10px',
      backgroundColor: 'white',
      width: '60rem',
      height: '5.5rem',
      fontSize: '50px',
      letterSpacing: '3px',
      boxShadow: '1px 1px 1px gray',
    },
    channelPassword: {
      border: '2px solid black',
      marginLeft: '5rem',
      marginTop: '1rem',
      borderRadius: '10px',
      paddingLeft: '10px',
      backgroundColor: '#999999',
      width: '60rem',
      height: '5.5rem',
      fontSize: '45px',
      letterSpacing: '3px',
      boxShadow: '1px 1px 1px gray',
    },
    radioGroup: {
      marginTop: '4rem',
      marginLeft: '50%',
      width: '40rem',
      transform: 'translate(-50%, -50%)',
      display: 'flex',
    },
    radio: {
      marginLeft: '4.5rem',
      marginRight: '5.5rem',
    },
    radioText: {
      fontSize: '30px',
      textShadow: '1px 1px 1px lightgray',
    },
    createButton: {
      float: 'right',
      marginTop: '3rem',
      marginRight: '4rem',
      backgroundColor: '#282E4E',
      color: '#F4F3FF',
      width: 230,
      height: 60,
      fontSize: '30px',
      letterSpacing: '2px',
      borderRadius: '8px',
      textTransform: 'none',
      textShadow: '1px 1px 0.5px gray',
      boxShadow: '1px 1px 0.5px gray',
      '&:hover': {
        backgroundColor: '#0F1535',
      },
    },
    closeButtonLocation: {
      position: 'absolute',
      top: '0.3rem',
      right: '0.5rem',
    },
    closeButton: {
      color: '#f35353',
      fontSize: '40px',
      '&:hover': {
        color: '#DA3A3A',
      },
    },
  }),
);

interface CreateProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

interface ChangeChannelData {
  title: string;
  status: string;
  password: string;
}

function ChatSettingMenu({ open, setOpen }: CreateProps): JSX.Element {
  const classes = useStyles();
  const chatData = useSelector((state: RootState) => state.chatModule);
  const dispatch = useDispatch();

  const [form, setForm] = useState({
    title: '',
    password: '',
    status: chatData.status,
  });

  useEffect(() => {
    if (form.status === 'public') {
      setForm({
        ...form,
        password: '',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.status]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const clickRadio = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };


  const changeChannel = async (data: ChangeChannelData) => {
    if (data.password === '') {
      const res = await axios.patch(`/chat/${chatData.index}`, {
        title: data.title,
        status: data.status,
      });
      return res;
    }
    const res = await axios.patch(`/chat/${chatData.index}`, {
      title: data.title,
      status: data.status,
      password: data.password,
    });
    return res;
  };

  const clickChangeButton = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = {
      title: form.title,
      status: form.status,
      password: form.password,
    };
    if (form.title === '') {
      data.title = chatData.title;
    }
    try {
      const res = await changeChannel(data);
      dispatch(
        joinChatRoom({
          roomTitle: res.data.title,
          roomIndex: res.data.index,
          roomBannedUsers: chatData.bannedUsers,
          roomStatus: res.data.status,
          roomJoinedUsers: chatData.joinUsers,
          roomAdmins: chatData.adminUsers,
          roomMuted: chatData.mutedUsers,
          roomOwner: chatData.ownerUser,
        }),
      );
      const userdata = await getUserme();
      dispatch(updateUser(userdata));
      setOpen(false);
      setForm({
        title: '',
        password: '',
        status: res.data.status,
      });
    } catch (error: any) {
      if (error.response.data.message[0] === 'Invalid Chat Title Length') {
        alert('방 제목은 20자 이하여야합니다.');
        setForm({
          ...form,
          password: '',
        });
      }
      if (error.response.data.message === 'Do Not set Password if not protected') {
        alert('공개 채널에서는 비밀번호를 사용할 수 없습니다.');
        setForm({
          ...form,
          password: '',
        });
      }
      if (error.response.data.message === 'Permission Denied') {
        alert('권한이 없습니다.');
        setOpen(false);
      }
      if (error.response.data.message === 'Valid 8 ~ 20 Characters of Password Required') {
        alert('비밀번호는 8자 이상이어야 합니다.');
        setForm({
          ...form,
          password: '',
        });
      }
      if (error.response.data.message === 'User Not Found') {
        alert('로그인 정보가 유효하지 않습니다. 다시 로그인 해주세요');
        logoutSequence(dispatch);
        window.location.href = '/';
      }
    }
  };

  const onClickCloseButton = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setOpen(false);
    setForm({
      title: '',
      password: '',
      status: chatData.status,
    });
  };

  return (
    <div>
      <Modal
        open={open}
        onClose={() => {
          setOpen(false);
          setForm({
            title: '',
            password: '',
            status: chatData.status,
          });
        }}
      >
        <div className={classes.root}>
          <IconButton
            className={classes.closeButtonLocation}
            onClick={onClickCloseButton}
          >
            <CancelIcon className={classes.closeButton} />
          </IconButton>
          <div className={classes.title}>Change Channel</div>
          <form className={classes.inputBox} onSubmit={clickChangeButton}>
            <InputBase
              className={classes.channelName}
              name="title"
              placeholder={chatData.title}
              value={form.title}
              onChange={onChange}
            />
            <RadioGroup
              className={classes.radioGroup}
              row
              name="status"
              value={form.status}
              onChange={clickRadio}
            >
              <FormControlLabel
                className={classes.radio}
                value="public"
                control={<Radio color="primary" />}
                label={
                  <Box component="div" className={classes.radioText}>
                    public
                  </Box>
                }
              />
              <FormControlLabel
                className={classes.radio}
                value="protected"
                control={<Radio color="primary" />}
                label={
                  <Box component="div" className={classes.radioText}>
                    protected
                  </Box>
                }
              />
            </RadioGroup>
            <InputBase
              type="password"
              className={classes.channelPassword}
              placeholder="Password"
              name="password"
              value={form.password}
              onChange={onChange}
              disabled={form.status === 'public'}
            />
            <Button
              type="submit"
              className={classes.createButton}
              variant="text"
            >
              Change
            </Button>
          </form>
        </div>
      </Modal>
    </div>
  );
}

export default React.memo(ChatSettingMenu);
