const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
let width = canvas.width;
let height = canvas.height;

// Definir la velocidad de la maquina
const MAX_COMPUTER_SPEED = 4;

// determinar velocidad
let xSpeed;
let ySpeed;

// valores de la pelota
const BALL_SIZE = 10;
let ballPosition;

function initBall(player) {
  ballPosition = {
    x: player === "left" ? 20 : width - 20,
    y: 30,
  };

  xSpeed = player === "left" ? 8 : -8;
  ySpeed = 4;
}

// valores de las paletas
const PADDLE_WIDTH = 10;
const PADDLE_HEIGHT = 40;
const PADDLE_OFFSET = 20; // distancia de la paleta desde uno de los extremos
let leftPaddleTop = 20; // La posición actual de la paleta con respecto al extremo superior del canvas
let rightPaddleTop = 40; // "    "

// Score
let leftScore = 0;
let rightScore = 0;
let gameOver;

function draw() {
  // Darle color al fondo de mi canvas
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, width, height);

  // Crear la pelota
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(ballPosition.x, ballPosition.y, BALL_SIZE, BALL_SIZE);

  // Dibujar las paletas
  ctx.fillStyle = "#00FF00";
  ctx.fillRect(PADDLE_OFFSET, leftPaddleTop, PADDLE_WIDTH, PADDLE_HEIGHT);

  ctx.fillStyle = "#00FF00";
  ctx.fillRect(
    width - PADDLE_OFFSET,
    rightPaddleTop,
    PADDLE_WIDTH,
    PADDLE_HEIGHT
  );

  // dibujar los scores
  ctx.fillStyle = "#FFFFFF";
  ctx.font = "50px monospace";
  ctx.textAlign = "left";
  ctx.fillText(leftScore.toString(), 50, 50);

  ctx.textAlign = "right";
  ctx.fillText(rightScore.toString(), width - 50, 50);
}

// Hacer que la maquina siga a la pelota
function followBall() {
  let ball = {
    top: ballPosition.y,
    bottom: ballPosition.y + BALL_SIZE,
  };

  let leftPaddle = {
    top: leftPaddleTop,
    bottom: leftPaddleTop + PADDLE_HEIGHT,
  };

  if (ball.top < leftPaddle.top) {
    leftPaddleTop -= MAX_COMPUTER_SPEED;
  } else if (ball.bottom > leftPaddle.bottom) {
    leftPaddleTop += MAX_COMPUTER_SPEED;
  }
}

function drawGameOver() {
  // sonido
  const synth = new Tone.Synth().toDestination();
  synth.triggerAttackRelease("C2", "2n");

  ctx.fillStyle = "#FFFFFF";
  ctx.font = "50px monospace";
  ctx.textAlign = "center";
  ctx.fillText("GAME OVER", width / 2, height / 2);
  let div = document.getElementById("div");
  let button = document.getElementById("button");
  button.classList.remove("invisible");
  div.classList.remove("invisible");
  if (button) {
    button.addEventListener("click", function (e) {
      console.log("¡Hiciste click en Play Again!");
      resetGame();
    });
  } else {
    console.error("El botón 'Play Again' no fue encontrado");
  }
}

function resetGame() {
  // Restablece los valores del juego
  leftScore = 0;
  rightScore = 0;
  gameOver = false;

  // Oculta el botón después de hacer clic
  let button = document.getElementById("button");
  let div = document.getElementById("div");
  button.classList.add("invisible");
  div.classList.add("invisible");

  // Se reinicia la pelota y el juego
  initBall("left");
  gameLoop();
}

function update() {
  ballPosition.x += xSpeed;
  ballPosition.y += ySpeed;
  followBall();
}

// distanceFromTop/Bottom: distancia de la pelota desde el borde superior/inferior de la paleta
function adjustAngle(distanceFromTop, distanceFromBottom) {
  console.log("se ajusta angulo");
  if (distanceFromTop < 0) {
    // Si la pelota golpea la parte superior de la paleta, se reduce la velocidad
    ySpeed -= 0.5; // ySpeed = ySpeed - 0.5
    console.log("golpea la parte superio");
  } else if (distanceFromBottom < 0) {
    // Si la pelota golpea cerca de la parte inferior de la paleta, aumenta la velocidad
    ySpeed += 0.5; // ySpeed = ySpeed + 0.5
    console.log("golpea la parte inferior");
  }
}

function checkPaddleCollision(ball, paddle) {
  return (
    ball.left < paddle.right &&
    ball.right > paddle.left &&
    ball.top < paddle.bottom &&
    ball.bottom > paddle.top
  );
}

function checkCollision() {
  // definir los bordes de la pelota
  let ball = {
    left: ballPosition.x,
    right: ballPosition.x + BALL_SIZE,
    top: ballPosition.y,
    bottom: ballPosition.y + BALL_SIZE,
  };

  let leftPaddle = {
    left: PADDLE_OFFSET,
    right: PADDLE_OFFSET + PADDLE_WIDTH,
    top: leftPaddleTop,
    bottom: leftPaddleTop + PADDLE_HEIGHT,
  };

  let rightPaddle = {
    left: width - PADDLE_WIDTH - PADDLE_OFFSET,
    right: width - PADDLE_OFFSET,
    top: rightPaddleTop,
    bottom: rightPaddleTop + PADDLE_HEIGHT,
  };

  // Verificar colision con la paleta derecha
  if (checkPaddleCollision(ball, rightPaddle)) {
    // sonido
    const synth = new Tone.Synth().toDestination();
    synth.triggerAttackRelease("C4", "8n");

    let distanceFromTop = ball.top - rightPaddle.top;
    let distanceFromBottom = rightPaddle.bottom - ball.bottom;
    adjustAngle(distanceFromTop, distanceFromBottom);
    xSpeed = -Math.abs(xSpeed); // al colocar Math.abs y luego ponerle un signo negativo me aseguro de que si o si el sentido se vuelva negativo
  }

  if (checkPaddleCollision(ball, leftPaddle)) {
    // sonido
    const synth = new Tone.Synth().toDestination();
    synth.triggerAttackRelease("C4", "8n");

    let distanceFromTop = ball.top - leftPaddle.top;
    let distanceFromBottom = leftPaddle.bottom - ball.bottom;
    adjustAngle(distanceFromTop, distanceFromBottom);
    xSpeed = Math.abs(xSpeed); // el sentido es positivo para que la pelota se diriga hacia la derecha
  }

  // verificar la colision en el eje X
  if (ball.left < 0 || ball.right > width) {
    xSpeed = -xSpeed;
    if (ball.left < 0) {
      // toque la pared izquierda
      rightScore++;
      initBall("right"); // cada vez que se marca un punto, vuelvo a iniciar el saque (saca el de la der)
    } else {
      // toque la pared derecha
      leftScore++;
      initBall("left"); // cada vez que se marca un punto, vuelvo a iniciar el saque (saca el de la izq)
    }

    if (leftScore > 3 || rightScore > 3) {
      gameOver = true;
    }
  }

  // verificar la colision en el eje Y
  if (ball.top < 0 || ball.bottom > height) {
    ySpeed = -ySpeed;
  }
}

// Eventos
document.addEventListener("mousemove", function (e) {
  if (
    e.y - canvas.offsetTop + PADDLE_HEIGHT >= height ||
    e.y <= canvas.offsetTop
  ) {
    return;
  }
  rightPaddleTop = e.y - canvas.offsetTop;
  // canvas.offsetTop: creo que es la distancia del canvas (parte superior) a la "pantalla".
  // e.y: distancia del mouse en toda la pantalla.
});

// Inicializa el juego
function gameLoop() {
  draw();
  update();
  checkCollision();

  if (gameOver) {
    draw();
    drawGameOver();
  } else {
    setTimeout(gameLoop, 30);
  }
}

initBall("left");
gameLoop();
