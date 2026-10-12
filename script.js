const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const scoreDisplay = document.getElementById("score");
const restartButton = document.getElementById("restart");

const gridSize = 20;
const tileSize = 20;

let snake;
let food;
let direction;
let nextDirection;
let score;
let gameTimer;
let gameOver;

// Generate food in a random empty square
function generateFood() {
    let newFood;

    do {
        newFood = {
            x: Math.floor(Math.random() * gridSize),
            y: Math.floor(Math.random() * gridSize)
        };
    } while (snake.some(part =>
        part.x === newFood.x && part.y === newFood.y
    ));

    return newFood;
}

// Start or restart the game
function startGame() {
    clearInterval(gameTimer);

    snake = [
        { x: 10, y: 10 },
        { x: 9, y: 10 },
        { x: 8, y: 10 }
    ];

    direction = { x: 1, y: 0 };
    nextDirection = { x: 1, y: 0 };

    score = 0;
    gameOver = false;
    scoreDisplay.textContent = score;

    food = generateFood();

    drawGame();
    gameTimer = setInterval(updateGame, 130);
}

// Draw the game
function drawGame() {
    // Clear the board
    ctx.fillStyle = "#020617";
    ctx.fillRect(0, 0, 400, 400);

    // Draw food
    ctx.fillStyle = "#f87171";
    ctx.fillRect(
        food.x * tileSize,
        food.y * tileSize,
        tileSize - 2,
        tileSize - 2
    );

    // Draw the snake
    snake.forEach((part, index) => {
        ctx.fillStyle = index === 0 ? "#86efac" : "#4ade80";

        ctx.fillRect(
            part.x * tileSize,
            part.y * tileSize,
            tileSize - 2,
            tileSize - 2
        );
    });

    // Game over message
    if (gameOver) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
        ctx.fillRect(0, 0, 400, 400);

        ctx.fillStyle = "white";
        ctx.font = "bold 32px Arial";
        ctx.textAlign = "center";
        ctx.fillText("Game Over!", 200, 190);

        ctx.font = "16px Arial";
        ctx.fillText("Click Restart to play again", 200, 225);
    }
}

// Update the snake's position
function updateGame() {
    direction = nextDirection;

    const head = {
        x: snake[0].x + direction.x,
        y: snake[0].y + direction.y
    };

    const eating = head.x === food.x && head.y === food.y;

    // The tail moves away unless the snake is eating
    const body = eating ? snake : snake.slice(0, -1);

    const hitWall =
        head.x < 0 || head.x >= gridSize ||
        head.y < 0 || head.y >= gridSize;

    const hitSnake = body.some(part =>
        part.x === head.x && part.y === head.y
    );

    if (hitWall || hitSnake) {
        gameOver = true;
        clearInterval(gameTimer);
        drawGame();
        return;
    }

    // Move the snake forward
    snake.unshift(head);

    if (eating) {
        score += 10;
        scoreDisplay.textContent = score;

        // Win if the snake fills the entire board
        if (snake.length === gridSize * gridSize) {
            clearInterval(gameTimer);
            drawGame();
            ctx.fillStyle = "white";
            ctx.font = "bold 32px Arial";
            ctx.textAlign = "center";
            ctx.fillText("You Win!", 200, 200);
            return;
        }

        food = generateFood();
    } else {
        snake.pop();
    }

    drawGame();
}

// Keyboard controls
document.addEventListener("keydown", function(event) {
    const controls = {
        ArrowUp: { x: 0, y: -1 },
        ArrowDown: { x: 0, y: 1 },
        ArrowLeft: { x: -1, y: 0 },
        ArrowRight: { x: 1, y: 0 }
    };

    const newDirection = controls[event.key];

    if (!newDirection) return;

    event.preventDefault();

    // Prevent the snake from reversing directly
    if (
        newDirection.x === -direction.x &&
        newDirection.y === -direction.y
    ) {
        return;
    }

    nextDirection = newDirection;
});

// Restart button
restartButton.addEventListener("click", startGame);

// Start when the page loads
startGame();
