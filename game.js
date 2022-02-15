const board_border = "black";
const board_background = "aliceblue";
const snake_col = "lightblue";
const snake_border = "darkblue";

let snake = [
    {x: 200, y: 200},
    {x: 190, y: 200},
    {x: 180, y: 200},
    {x: 170, y: 200},
    {x: 160, y: 200}
];

let startSnake = [...snake];

const GAME_SPEED = 50;

let gameOver = false;

let score = 0;

let dx = 10;
let dy = 0;

let foodX;
let foodY;

let changingDirection = false;

const snakeboard = document.getElementById("snakeboard");
const snakeboard_ctx = snakeboard.getContext("2d");

document.addEventListener("keydown", changeDirection);

function startGame() {
    if (gameOver) {
        gameOver = false;
        snake = [...startSnake];
        dx = 10;
        dy = 0;
        score = 0;
        document.getElementById('score').innerHTML = score;
    }

    generateFood();
    main();

    document.getElementById('startButton').disabled = true;
    document.getElementById('startButton').innerHTML = "Game Running";
}

function main() {
    gameOver = gameEnded();

    if (gameOver) {
        document.getElementById('score').innerHTML = "Game Over!";
        document.getElementById('startButton').innerHTML = "Restart Game";
        document.getElementById('startButton').disabled = false;
        snake = [...startSnake];
        return;
    }

    changingDirection = false;

    setTimeout(function onTick() {
        clearBoard();
        drawFood();
        moveSnake();
        drawSnake();
        main();
    }, GAME_SPEED);
}

function clearBoard() {
    snakeboard_ctx.fillStyle = board_background;
    snakeboard_ctx.strokeStyle = board_border;
    snakeboard_ctx.fillRect(0, 0, snakeboard.width, snakeboard.height);
    snakeboard_ctx.strokeRect(0, 0, snakeboard.width, snakeboard.height);
}

function drawSnake() {
    snake.forEach(drawSnakePart);
}

function drawSnakePart(snakePart) {
    snakeboard_ctx.fillStyle = snake_col;
    snakeboard_ctx.strokeStyle = snake_border;
    snakeboard_ctx.fillRect(snakePart.x, snakePart.y, 10, 10);
    snakeboard_ctx.strokeRect(snakePart.x, snakePart.y, 10, 10);
}

function moveSnake() {
    const head = {x: snake[0].x + dx, y: snake[0].y + dy};
    snake.unshift(head);

    const ateFood = snake[0].x === foodX && snake[0].y === foodY;
    if (ateFood) {
        score += 10;
        document.getElementById('score').innerHTML = score;
        generateFood();
    }
    else snake.pop();
}

function changeDirection(event) {
    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const UP_KEY = 38;
    const DOWN_KEY = 40;

    const keyPressed = event.keyCode;
    const goingUp = (dy === -10);
    const goingDown = (dy === 10);
    const goingLeft = (dx === -10);
    const goingRight = (dx === 10);

    if (changingDirection) return;
    changingDirection = true;

    if (keyPressed === LEFT_KEY && !goingRight) {
        dx = -10;
        dy = 0;
    }

    if (keyPressed === RIGHT_KEY && !goingLeft) {
        dx = 10;
        dy = 0;
    }

    if (keyPressed === DOWN_KEY && !goingUp) {
        dx = 0;
        dy = 10;
    }

    if (keyPressed === UP_KEY && !goingDown) {
        dx = 0;
        dy = -10;
    }
}

function gameEnded() {
    for(let i = 4; i < snake.length; i++) {
        const hasCollided = snake[i].x === snake[0].x && snake[i].y === snake[0].y;

        if (hasCollided) return true;

        const hitLeftWall = snake[0].x < 0;
        const hitRightWall = snake[0].x > snakeboard.width - 10;
        const hitTopWall = snake[0].y < 0;
        const hitBottomWall = snake[0].y > snakeboard.height - 10;

        return hitLeftWall || hitRightWall || hitTopWall || hitBottomWall;
    }
}

function randomFood(min, max) {
    return Math.round((Math.random() * (max - min) + min) / 10) * 10;
}

function generateFood() {
    foodX = randomFood(0, snakeboard.width - 10);
    foodY = randomFood(0, snakeboard.height - 10);
    snake.forEach(function snakeAte(part) {
        const ateFood = part.x === foodX && part.y === foodY;
        if (ateFood) generateFood();
    });
}

function drawFood() {
    snakeboard_ctx.fillStyle = "lightgreen";
    snakeboard_ctx.strokeStyle = "darkgreen";
    snakeboard_ctx.fillRect(foodX, foodY, 10, 10);
    snakeboard_ctx.strokeRect(foodX, foodY, 10, 10);
}