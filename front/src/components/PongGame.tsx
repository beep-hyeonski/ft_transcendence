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

  // context.arc(300, 300, 15, 0, Math.PI * 2, false);
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
      // socket?.socket?.off('gameLoop');
      window.removeEventListener('keydown', getKeyDown);
      window.removeEventListener('keyup', getKeyUp);
      console.log('game end');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (canvasRef.current == null) {
      throw new Error('PongGame: canvasRef is null');
    }

    const callback = (gameData: any) => {
      // console.log(gameData);
      setGame(gameData);
    };

    socket?.socket?.on('gameLoop', callback);

    if (!game.frameInfo) {
      // 게임 하다가 새로고침 눌렀을 때 처리
      // 새로고침 누른 사람은 메인으로 나가지는데 상대방은 계속 게임 진행함
      // 이때 남아있는 상대가 플레이어1이면 전적이 남는데 플레이어2라면 전적 안남음..
      // 이긴 사람이 전적남기게 하도록 고쳐도 팅긴사람이 이겨버리면 ?
      console.log('no game no no no');
      dispatch(waitGame());
      history.push('/');
      return () => {
        socket?.socket?.off('gameLoop');
      };
    }

    const canvas = canvasRef.current;
    canvas.width = game.frameInfo.frameWidth;
    canvas.height = game.frameInfo.frameHeight;
    const context = canvas.getContext('2d');

    if (context == null) {
      throw new Error('PongGame: context is null');
    }

    const ball = game.ballInfo;

    // let collidePoint1 = ball.y - (canvas.width / 2 + canvas.height / 2 / 2);
    // collidePoint1 /= canvas.width / 2 + canvas.height / 2 / 2;
    // const angle1 = (Math.PI / 4) * collidePoint1;
    // const direction1 = ball.x + ball.radius < canvas.width / 2 ? 1 : -1;
    // ball.velocityX = Math.cos(angle1) * ball.speed * direction1;
    // ball.velocityY = Math.sin(angle1) * ball.speed;

    const player1 = game.player1Info;
    const player2 = game.player2Info;

    // const user1 = {
    //   x: 0,
    //   y: canvas.height / 2 - 150,
    //   w: 30,
    //   h: canvas.height / 5,
    //   score: 0,
    //   color: 'blue',
    // };

    // const user2 = {
    //   x: canvas.width - 30,
    //   y: canvas.height / 2 - 150,
    //   w: 30,
    //   h: canvas.height / 5,
    //   score: 0,
    //   color: 'red',
    // };

    function drawPong() {
      if (keyState.upKey === true) {
        socket?.socket?.emit('sendKeyEvent', {
          sender: mydata.username,
          gameName: gamedata.gameName,
          keyState: 'upKey',
        });
        // user2.y -= game.gameInfo.stickMoveSpeed;
        // if (user2.y < 0) {
        //   user2.y = 0;
        // }
      }
      if (keyState.downKey === true) {
        socket?.socket?.emit('sendKeyEvent', {
          sender: mydata.username,
          gameName: gamedata.gameName,
          keyState: 'downKey',
        });
        // user2.y += stickMoveSpeed;
        // if (user2.y + canvas.height / 5 > canvas.height) {
        //   user2.y = canvas.height - canvas.height / 5;
        // }
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
      context.fillText(`${gamedata.gameInfo.player2Nickname}`, canvas.width - 50, 50);
      context.textAlign = 'center';
      context.font = '60px Skia';
      context.fillText(
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        `${player1.score}      score      ${player2.score}`, canvas.width / 2, 50);
    }

    // function resizeCanvas() {
    //   canvas.width = window.innerWidth - 5;
    //   canvas.height = window.innerHeight - 5;
    //   user1.x = 0;
    //   user1.y = canvas.height / 2 - 150;
    //   user1.w = 30;
    //   user1.h = canvas.height / 3;
    //   user2.x = canvas.width - 30;
    //   user2.y = canvas.height / 2 - 150;
    //   user2.w = 30;
    //   user2.h = canvas.height / 3;
    //   drawPong();
    // }

    // function getKeyDown(evt: KeyboardEvent) {
    //   switch (evt.code) {
    //     case 'ArrowUp':
    //       keyState.upKey = true;
    //       break;
    //     case 'ArrowDown':
    //       keyState.downKey = true;
    //       break;
    //     default:
    //       break;
    //   }
    // }

    // function getKeyUp(evt: KeyboardEvent) {
    //   switch (evt.code) {
    //     case 'ArrowUp':
    //       keyState.upKey = false;
    //       break;
    //     case 'ArrowDown':
    //       keyState.downKey = false;
    //       break;
    //     default:
    //       break;
    //   }
    // }
    // window.addEventListener('keydown', getKeyDown);
    // window.addEventListener('keyup', getKeyUp);
    // window.addEventListener('resize', resizeCanvas);

    // const myVar = setInterval(drawPong, 300);
    // const stopVar = setInterval(() => {
    //   if (player1.score >= 3 || player2.score >= 3) {
    //     if (game.gameInfo.player1 === mydata.username) {
    //       socket?.socket?.emit('matchResult', {
    //         gameName: game.gameName,
    //         createMatchDto: {
    //           player1Index: mydata.index,
    //           player2Index: 2,
    //           player1Score: player1.score,
    //           player2Score: player2.score,
    //         },
    //       });
    //     }
    //     clearInterval(myVar);
    //     clearInterval(stopVar);
    //     history.push('/');
    //   }
    // }, 100);

    drawPong();
    if (player1.score >= 3 || player2.score >= 3) {
      if (gamedata.gameInfo.player1 === mydata.username) {
        (async () => {
          try {
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            const { data } = await axios.get(`${String(process.env.REACT_APP_API_URL)}/users/${gamedata.gameInfo.player2Nickname}`);
            socket?.socket?.emit('matchResult', {
              gameName: gamedata.gameName,
              createMatchDto: {
                player1Index: mydata.index,
                player2Index: data.index,
                player1Score: player1.score,
                player2Score: player2.score,
              },
            });
          } catch (err) {
            console.log(err);
          }
        })();
        // // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        // axios.get(`${String(process.env.REACT_APP_API_URL)}/users/${gamedata.gameInfo.player2Nickname}`).then((res) => {
        //   socket?.socket?.emit('matchResult', {
        //     gameName: gamedata.gameName,
        //     createMatchDto: {
        //       player1Index: mydata.index,
        //       player2Index: res.data.index,
        //       player1Score: player1.score,
        //       player2Score: player2.score,
        //     },
        //   });
        // }).catch((err) => {
        //   console.log(err);
        // });
      }
      dispatch(waitGame());
      history.push('/');
    }
    return () => {
      socket?.socket?.off('gameLoop');
    };

    // return () => {
    //   dispatch(waitGame());
    //   socket?.socket?.off('gameLoop');
    //   window.removeEventListener('keydown', getKeyDown);
    //   window.removeEventListener('keyup', getKeyUp);
    // };
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
