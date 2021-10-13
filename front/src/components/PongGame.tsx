/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
import React, { useEffect, useRef, useState } from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { RootState } from '../modules';
import { waitGame } from '../modules/gamestate';
import { IGameDataProps, initGameData } from '../modules/gamedata';
import { getUserByUsername } from '../utils/Requests';

const useStyles = makeStyles(() =>
  createStyles({
    canvas: {
      backgroundColor: 'black',
      width: '1400',
      height: '700',
    },
  }),
);

const keyState = {
  upKey: false,
  downKey: false,
};

function PongGame(): JSX.Element {
  const classes = useStyles();
  const history = useHistory();
  const { socket } = useSelector((state: RootState) => state.socketModule);
  const mydata = useSelector((state: RootState) => state.userModule);
  const dispatch = useDispatch();
  const { gamedata } = useSelector((state: RootState) => state.gameDataMoudle);
  const [game, setGame] = useState(gamedata);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const drawStick = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    color: string,
  ) => {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
  };

  const drawBall = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    r: number,
    color: string,
  ) => {
    ctx.fillStyle = color;
    ctx.arc(x, y, r, 0, Math.PI * 2, false);
  };

  useEffect(() => {
    if (gamedata.gameName === '') {
      alert('잘못된 접근입니다.');
      history.push('/');
    }

    function getKeyDown(evt: KeyboardEvent) {
      switch (evt.code) {
        case 'ArrowUp':
          keyState.upKey = true;
          break;
        case 'ArrowDown':
          keyState.downKey = true;
          break;
        default:
          break;
      }
    }

    function getKeyUp(evt: KeyboardEvent) {
      switch (evt.code) {
        case 'ArrowUp':
          keyState.upKey = false;
          break;
        case 'ArrowDown':
          keyState.downKey = false;
          break;
        default:
          break;
      }
    }

    window.addEventListener('keydown', getKeyDown);
    window.addEventListener('keyup', getKeyUp);

    return () => {
      dispatch(waitGame());
      dispatch(initGameData());
      socket?.emit('quitGame', {
        gameName: gamedata.gameName,
      });
      window.removeEventListener('keydown', getKeyDown);
      window.removeEventListener('keyup', getKeyUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (canvasRef.current === null) {
      alert(
        '게임을 실행할 수 없습니다(canvas is null). 관리자에게 문의하세요.',
      );
      dispatch(waitGame());
      history.push('/');
      return () => {};
    }

    socket?.on('gameLoop', (gameData: IGameDataProps) => {
      setGame(gameData);
    });

    if (game.frameInfo.frameHeight === 0) {
      // 게임 하다가 새로고침 눌렀을 때 처리
      dispatch(waitGame());
      dispatch(initGameData());
      history.push('/');
    }

    const canvas = canvasRef.current;
    canvas.width = game.frameInfo.frameWidth;
    canvas.height = game.frameInfo.frameHeight;
    const context = canvas.getContext('2d');

    if (!context) {
      alert(
        '게임을 실행할 수 없습니다(context is null). 관리자에게 문의하세요.',
      );
      dispatch(waitGame());
      history.push('/');
      return () => {};
    }

    const ball = game.ballInfo;
    const player1 = game.player1Info;
    const player2 = game.player2Info;

    function drawPong() {
      if (keyState.upKey === true) {
        socket?.emit('sendKeyEvent', {
          sender: mydata.username,
          gameName: gamedata.gameName,
          keyState: 'upKey',
        });
      }
      if (keyState.downKey === true) {
        socket?.emit('sendKeyEvent', {
          sender: mydata.username,
          gameName: gamedata.gameName,
          keyState: 'downKey',
        });
      }
      if (context === null) {
        return;
      }
      context.clearRect(0, 0, canvas.width, canvas.height);
      drawStick(
        context,
        player1.x,
        player1.y,
        player1.stickWidth,
        player1.stickHeight,
        player1.color,
      );
      drawStick(
        context,
        player2.x,
        player2.y,
        player2.stickWidth,
        player2.stickHeight,
        player2.color,
      );

      context.beginPath();
      drawBall(context, ball.x, ball.y, ball.radius, ball.color);
      context.closePath();
      context.fill();

      context.fillStyle = 'white';
      context.textAlign = 'left';
      context.font = '40px Skia';
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      context.fillText(`${gamedata.gameInfo.player1Nickname}`, 50, 50);
      context.textAlign = 'right';
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      context.fillText(
        `${gamedata.gameInfo.player2Nickname}`,
        canvas.width - 50,
        50,
      );
      context.textAlign = 'center';
      context.font = '60px Skia';
      context.fillText(
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        `${player1.score}      score      ${player2.score}`,
        canvas.width / 2,
        50,
      );
    }

    drawPong();
    if (player1.score >= 3 || player2.score >= 3) {
      const { player1: player1Name, player2: player2Name } = gamedata.gameInfo;
      const winnerName = player1.score >= 3 ? player1Name : player2Name;
      const loserName = player1.score >= 3 ? player2Name : player1Name;

      if (winnerName === mydata.username) {
        (async () => {
          const data = await getUserByUsername(loserName);
          socket?.emit('matchResult', {
            gameName: gamedata.gameName,
            createMatchDto: {
              player1Index:
                player1Name === mydata.username ? mydata.index : data.index,
              player2Index:
                player2Name === mydata.username ? mydata.index : data.index,
              player1Score: player1.score,
              player2Score: player2.score,
            },
          });
        })();
      }
      dispatch(waitGame());
      history.push('/');
    }
    return () => {
      socket?.off('gameLoop');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    game,
    history,
    socket,
    mydata,
    gamedata.gameName,
    gamedata.gameInfo,
    dispatch,
  ]);

  return <canvas ref={canvasRef} className={classes.canvas} />;
}

export default React.memo(PongGame);
