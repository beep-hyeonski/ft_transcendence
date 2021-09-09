/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
import React, { useEffect, useRef } from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles(() => createStyles({
  canvas: {
    backgroundColor: 'black',
    width: '100%',
    height: '100%',
  },
}));

const keyState = {
  upKey: false,
  downKey: false,
  wKey: false,
  sKey: false,
};

const stickMoveSpeed = 15;
const ballSpeed = 7;

function PongGame() {
  const classes = useStyles();
  const history = useHistory();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  // soohchoi find 5talja very very thanks

  const drawStick = (
    ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, color: string,
  ) => {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
  };

  // context.arc(300, 300, 15, 0, Math.PI * 2, false);
  const drawBall = (
    ctx: CanvasRenderingContext2D, x: number, y: number, r: number, color: string,
  ) => {
    ctx.fillStyle = color;
    ctx.arc(x, y, r, 0, Math.PI * 2, false);
  };

  useEffect(() => {
    if (canvasRef.current == null) {
      throw new Error('PongGame: canvasRef is null');
    }

    const canvas = canvasRef.current;
    canvas.width = window.innerWidth - 5;
    canvas.height = window.innerHeight - 5;
    const context = canvas.getContext('2d');

    if (context == null) {
      throw new Error('PongGame: context is null');
    }

    const ball = {
      x: canvas.width / 2,
      y: canvas.height / 2,
      radius: 15,
      velocityX: 5,
      velocityY: 2,
      speed: ballSpeed,
      color: 'yellow',
    };

    let collidePoint1 = ball.y - (canvas.width / 2 + canvas.height / 2 / 2);
    collidePoint1 /= (canvas.width / 2 + canvas.height / 2 / 2);
    const angle1 = (Math.PI / 4) * collidePoint1;
    const direction1 = ball.x + ball.radius < canvas.width / 2 ? 1 : -1;
    ball.velocityX = Math.cos(angle1) * ball.speed * direction1;
    ball.velocityY = Math.sin(angle1) * ball.speed;

    const user1 = {
      x: 0,
      y: canvas.height / 2 - 150,
      w: 30,
      h: canvas.height / 5,
      score: 0,
      color: 'blue',
    };

    const user2 = {
      x: canvas.width - 30,
      y: canvas.height / 2 - 150,
      w: 30,
      h: canvas.height / 5,
      score: 0,
      color: 'red',
    };

    function collision(b: any, user: any) {
      const usertop = user.y;
      const userbottom = user.y + user.h;
      const userleft = user.x;
      const userright = user.x + user.w;

      const btop = b.y - b.radius;
      const bbottom = b.y + b.radius;
      const bleft = b.x - b.radius;
      const bright = b.x + b.radius;
      return (
        bright > userleft && bbottom > usertop && bleft < userright && btop < userbottom
      );
    }
    function mySleep(delay: number) {
      return new Promise((resolve) => setTimeout(resolve, delay));
    }

    let timeout = false;

    function ballReset() {
      ball.x = canvas.width / 2;
      ball.y = canvas.height / 2;
      timeout = true;
      mySleep(500).then(() => {
        ball.speed = ballSpeed;
        ball.velocityY = Math.floor(Math.random() * 4);
        ball.velocityX *= -1;
        if (ball.velocityY % 2 === 0) {
          ball.velocityY *= -1;
        }
        timeout = false;
      }).catch(() => {});
    }

    function drawPong() {
      if (keyState.upKey === true) {
        user2.y -= stickMoveSpeed;
        if (user2.y < 0) {
          user2.y = 0;
        }
      }
      if (keyState.downKey === true) {
        user2.y += stickMoveSpeed;
        if (user2.y + canvas.height / 5 > canvas.height) {
          user2.y = canvas.height - canvas.height / 5;
        }
      }
      if (keyState.wKey === true) {
        user1.y -= stickMoveSpeed;
        if (user1.y < 0) {
          user1.y = 0;
        }
      }
      if (keyState.sKey === true) {
        user1.y += stickMoveSpeed;
        if (user1.y + canvas.height / 5 > canvas.height) {
          user1.y = canvas.height - canvas.height / 5;
        }
      }
      if (context === null) {
        return;
      }
      context.clearRect(0, 0, canvas.width, canvas.height);
      drawStick(context, user1.x, user1.y, user1.w, user1.h, user1.color);
      drawStick(context, user2.x, user2.y, user2.w, user2.h, user2.color);
      if (!timeout) {
        context.beginPath();
        drawBall(context, ball.x, ball.y, ball.radius, ball.color);
        context.closePath();
        context.fill();
      }
      context.fillStyle = 'white';
      context.textAlign = 'center';
      context.font = '60px Skia';
      context.fillText(`${user1.score}      score      ${user2.score}`, canvas.width / 2, 50);
      const user = ball.x + ball.radius < canvas.width / 2 ? user1 : user2;

      if (collision(ball, user)) {
        let collidePoint = ball.y - (user.y + user.h / 2);
        collidePoint /= (user.y + user.h / 2);
        const angle = (Math.PI / 4) * collidePoint;
        const direction = ball.x + ball.radius < canvas.width / 2 ? 1 : -1;
        ball.velocityX = Math.cos(angle) * ball.speed * direction;
        ball.velocityY = Math.sin(angle) * ball.speed;
        ball.speed += 0.2;
      }

      if (ball.y + ball.radius >= canvas.height || ball.y - ball.radius <= 0) {
        ball.velocityY *= -1;
      }

      if (ball.x - ball.radius < 0) {
        user2.score += 1;
        ballReset();
      }

      if (ball.x + ball.radius > canvas.width) {
        user1.score += 1;
        ballReset();
      }

      if (!timeout) {
        ball.x += ball.velocityX;
        ball.y += ball.velocityY;
      }
    }

    function resizeCanvas() {
      canvas.width = window.innerWidth - 5;
      canvas.height = window.innerHeight - 5;
      user1.x = 0;
      user1.y = canvas.height / 2 - 150;
      user1.w = 30;
      user1.h = canvas.height / 3;
      user2.x = canvas.width - 30;
      user2.y = canvas.height / 2 - 150;
      user2.w = 30;
      user2.h = canvas.height / 3;
      drawPong();
    }

    function getKeyDown(evt: KeyboardEvent) {
      switch (evt.code) {
        case 'ArrowUp':
          keyState.upKey = true;
          break;
        case 'ArrowDown':
          keyState.downKey = true;
          break;
        case 'KeyW':
          keyState.wKey = true;
          break;
        case 'KeyS':
          keyState.sKey = true;
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
        case 'KeyW':
          keyState.wKey = false;
          break;
        case 'KeyS':
          keyState.sKey = false;
          break;
        default:
          break;
      }
    }
    window.addEventListener('keydown', getKeyDown);
    window.addEventListener('keyup', getKeyUp);
    window.addEventListener('resize', resizeCanvas);

    const myVar = setInterval(drawPong, 10);
    const stopVar = setInterval(() => {
      if (user1.score >= 3 || user2.score >= 3) {
        clearInterval(myVar);
        clearInterval(stopVar);
        history.push('/');
      }
    }, 100);
  });

  return (
    <canvas ref={canvasRef} className={classes.canvas} />
  );
}

export default React.memo(PongGame);
