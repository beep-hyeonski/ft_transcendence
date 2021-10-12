import React, { useState } from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: '2px 4px',
      display: 'flex',
      alignItems: 'center',
      width: 300,
      boxShadow: '0.5px 0.5px 0.5px white',
    },
    input: {
      marginLeft: theme.spacing(2),
      flex: 1,
    },
    iconButton: {
      padding: 10,
    },
    divider: {
      height: 28,
      margin: 4,
    },
  }),
);

interface SearchProps {
  onSubmit: (form: { input: string }) => void;
}

// onSubmit : search버튼이 눌렸을 때 input에 따라 redirect 해줄 함수
function SearchBar({ onSubmit }: SearchProps): JSX.Element {
  const classes = useStyles();

  const [form, setForm] = useState({ input: '' });

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const notNum = /[^a-z0-9|ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/gi;
    if (value.search(notNum) !== -1) {
      alert('닉네임에는 특수문자를 사용할 수 없습니다.');
      setForm({
        ...form,
        input: value.replace(notNum, ''),
      })
      e.currentTarget.value = value.replace(notNum, '');
    } else {
      setForm({
        ...form,
        [name]: value,
      });
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <Paper className={classes.root}>
      <form className={classes.root} onSubmit={handleSubmit}>
        <Divider className={classes.divider} orientation="vertical" />
        <InputBase
          className={classes.input}
          placeholder="Search User"
          inputProps={{ 'aria-label': 'search user' }}
          type="text"
          name="input"
          onChange={onChange}
        />
        <IconButton
          type="submit"
          className={classes.iconButton}
          aria-label="search"
        >
          <SearchIcon />
        </IconButton>
      </form>
    </Paper>
  );
}

export default React.memo(SearchBar);
