import React, { useState } from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import InputBase from '@material-ui/core/InputBase';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { Box } from '@material-ui/core';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles(() => createStyles({
  profileTitle: {
    fontSize: '55px',
    marginTop: '20px',
    marginLeft: '30px',
    color: '#F4F3FF',
    textShadow: '1px 1px 1.5px lightgray',
    letterSpacing: '2px',
    wordSpacing: '5px',
    textTransform: 'capitalize',
  },
  box: {
    margin: '2em 1em',
    width: '960px',
    height: '510px',
    backgroundColor: '#FFFFFF',
    border: '1px solid #FFFFFF',
    borderRadius: '10px',
    boxShadow: '3.5px 3.5px 3px gray',
  },
  channelName: {
    border: '2px solid black',
    borderRadius: '10px',
    margin: '80px 20px 10px 78px',
    paddingLeft: '5px',
    backgroundColor: 'white',
    width: '800px',
    height: '80px',
    fontSize: '40px',
    letterSpacing: '3px',
    boxShadow: '1px 1px 1px gray',
  },
  channelPassword: {
    border: '2px solid black',
    borderRadius: '10px',
    margin: '55px 20px 10px 78px',
    paddingLeft: '5px',
    backgroundColor: '#999999',
    width: '800px',
    height: '80px',
    fontSize: '40px',
    letterSpacing: '3px',
    boxShadow: '1px 1px 1px gray',
  },
  radioGroup: {
    position: 'relative',
    top: '28px',
    left: '27%',
  },
  label: {
    width: 170,
    '& svg': {
      width: '1.5em',
      height: '1.5em',
    },
  },
  radio: {
    fontSize: '60px',
  },
  createButton: {
    position: 'absolute',
    left: '82%',
    top: '85%',
    transform: 'translate(-50%, -50%)',
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
}));

function CreateChannel() {
  const classes = useStyles();

  const [form, setForm] = useState({
    channel: '',
    password: '',
    channelType: 'public',
  });

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const clickCreateButton = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(form);
  };

  return (
    <div>
      <div className={classes.profileTitle}>
        Create Channel
      </div>
      <form className={classes.box} onSubmit={clickCreateButton}>
        <InputBase
          className={classes.channelName}
          placeholder="채널 이름"
          name="channel"
          onChange={onChange}
        />
        <RadioGroup className={classes.radioGroup} row name="channelType" value={form.channelType} onChange={clickRadio}>
          <FormControlLabel
            className={classes.label}
            value="public"
            control={<Radio color="primary" />}
            label={(
              <Box component="div" fontSize={24}>
                public
              </Box>
            )}
          />
          <FormControlLabel
            className={classes.label}
            value="protected"
            control={<Radio color="primary" />}
            label={(
              <Box component="div" fontSize={24}>
                protected
              </Box>
            )}
          />
          <FormControlLabel
            className={classes.label}
            value="private"
            control={<Radio color="primary" />}
            label={(
              <Box component="div" fontSize={24}>
                private
              </Box>
            )}
          />
        </RadioGroup>
        <InputBase
          type="password"
          className={classes.channelPassword}
          placeholder="Password"
          name="password"
          onChange={onChange}
        />
        <Button type="submit" className={classes.createButton} variant="text">
          Create
        </Button>
      </form>
    </div>
  );
}

export default React.memo(CreateChannel);
