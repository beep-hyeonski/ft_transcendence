/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
import React, { useEffect, useRef, useState } from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { RootState } from '../modules';
import { waitGame } from '../modules/gamestate';
import { IGameDataProps } from '../modules/gamedata';

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

// interface IBallInfo {
//   x: number;
//   y: number;
//   radius: number;
//   velocityX: number;
//   velocityY: number;
//   speed: number;
//   color: string;
// }

// interface IFrameInfo {
//   frameWidth: number;
//   frameHeight: number;
// }

// interface IGameInfo {
//   ballSpeed: number;
//   stickMoveSpeed: number;
//   player1: string;
//   player1Nickname: string;
//   player2: string;
//   player2Nickname: string;
// }

// interface IPlayerInfo {
//   x: number;
//   y: number;
//   stickWidth: number;
//   stickHeight: number;
//   score: number;
//   color: string;
// }

// interface ILoopGameDataProps {
//   status: string;
//   gameName: string;
//   ballInfo: IBallInfo;
//   frameInfo: IFrameInfo;
//   gameInfo: IGameInfo;
//   player1Info: IPlayerInfo;
//   player2Info: IPlayerInfo;
// }

function PongGame(): JSX.Element {
  const classes = useStyles();
  const history = useHistory();
  const socket = useSelector((state: RootState) => state.socketModule);
  const mydata = useSelector((state: RootState) => state.userModule);
  const dispatch = useDispatch();
  const { gamedata } = useSelector((state: RootState) => state.gameDataMoudle);
  const [game, setGame] = useState(gamedata);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  // soohchoi find 5talja very very thanks

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
      socket?.socket?.emit('quitGame', {
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

    const callback = (gameData: IGameDataProps) => {
      setGame(gameData);
    };

    socket?.socket?.on('gameLoop', callback);

    if (game.frameInfo.frameHeight === 0) {
      // 게임 하다가 새로고침 눌렀을 때 처리
      // 새로고침 누른 사람은 메인으로 나가지는데 상대방은 계속 게임 진행함
      // 이때 남아있는 상대가 플레이어1이면 전적이 남는데 플레이어2라면 전적 안남음..
      // 이긴 사람이 전적남기게 하도록 고쳐도 팅긴사람이 이겨버리면 ?
      dispatch(waitGame());
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
        socket?.socket?.emit('sendKeyEvent', {
          sender: mydata.username,
          gameName: gamedata.gameName,
          keyState: 'upKey',
        });
      }
      if (keyState.downKey === true) {
        socket?.socket?.emit('sendKeyEvent', {
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
      if (gamedata.gameInfo.player1 === mydata.username) {
        (async () => {
          try {
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            const { data } = await axios.get(
              `/users/${gamedata.gameInfo.player2Nickname}`,
            );
            socket?.socket?.emit('matchResult', {
              gameName: gamedata.gameName,
              createMatchDto: {
                player1Index: mydata.index,
                player2Index: data.index,
                player1Score: player1.score,
                player2Score: player2.score,
              },
            });
          } catch (err: any) {
            console.log(err.response);
          }
        })();
      }
      dispatch(waitGame());
      history.push('/');
    }
    return () => {
      socket?.socket?.off('gameLoop');
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
