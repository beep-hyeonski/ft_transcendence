import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  text: {
    position: 'absolute',
    top: '47%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    fontSize: '104px',
  },
  mococo: {
    position: 'absolute',
    top: '26%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  },
  backcoco: {
    position: 'absolute',
    top: '64%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    fontSize: '24px',
  },
  runcoco: {
    position: 'absolute',
    top: '72%',
    left: '82%',
    transform: 'translate(-50%, -50%)',
  },
  avrel: {
    position: 'absolute',
    top: '78.3%',
    left: '17%',
    transform: 'translate(-50%, -50%)',
  },
  homeButton: {
		position: 'absolute',
		top: '85%',
		left: '50%',
		transform: 'translate(-50%, -50%)',
	},
}));

function NotFoundPage(): JSX.Element {
  const classes = useStyles();

  document.body.style.backgroundColor = '#fff97f';

  return (
    <div>
      <img className={classes.mococo} src="/notfound_mococo.png" alt="mococo" />
      <img className={classes.runcoco} src="/run_mococo.png" alt="run_mococo" />
      <img className={classes.avrel} src="/avrel.png" alt="run_mococo" />
      <div className={classes.text}>404 나빠운드</div>
      <div className={classes.backcoco}>길을 잘못찾은 모코코는 돌아가세요.</div>
      <Button
				type="button"
				variant="text"
				className={classes.homeButton}
				onClick={() => {
					window.location.href = '/';
				}}
			>
				홈으로
			</Button>
    </div>
  );
}

export default React.memo(NotFoundPage);
