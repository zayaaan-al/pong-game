const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');

// --- Game Constants ---
const WIDTH = canvas.width;
const HEIGHT = canvas.height;

const PADDLE_WIDTH = 12;
const PADDLE_HEIGHT = 80;
const PADDLE_MARGIN = 20;

const BALL_RADIUS = 10;
const BALL_SPEED_INIT = 5;
const PADDLE_SPEED = 5;

// --- Game Objects ---
let leftPaddle = {
    x: PADDLE_MARGIN,
    y: HEIGHT / 2 - PADDLE_HEIGHT / 2,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT
};

let rightPaddle = {
    x: WIDTH - PADDLE_WIDTH - PADDLE_MARGIN,
    y: HEIGHT / 2 - PADDLE_HEIGHT / 2,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT
};

let ball = {
    x: WIDTH / 2,
    y: HEIGHT / 2,
    vx: BALL_SPEED_INIT * (Math.random() < 0.5 ? 1 : -1),
    vy: BALL_SPEED_INIT * (Math.random() * 2 - 1),
    radius: BALL_RADIUS
};

// --- Mouse Paddle Control ---
canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    let mouseY = e.clientY - rect.top;
    // Center paddle on mouse
    leftPaddle.y = mouseY - leftPaddle.height / 2;

    // Clamp so paddle doesn't go out of bounds
    leftPaddle.y = Math.max(0, Math.min(HEIGHT - leftPaddle.height, leftPaddle.y));
});

// --- AI for Right Paddle ---
function updateRightPaddle() {
    // Move paddle towards the ball
    let centerY = rightPaddle.y + rightPaddle.height / 2;
    if (ball.y < centerY - 8) {
        rightPaddle.y -= PADDLE_SPEED;
    } else if (ball.y > centerY + 8) {
        rightPaddle.y += PADDLE_SPEED;
    }
    // Clamp
    rightPaddle.y = Math.max(0, Math.min(HEIGHT - rightPaddle.height, rightPaddle.y));
}

// --- Ball Logic ---
function resetBall() {
    ball.x = WIDTH / 2;
    ball.y = HEIGHT / 2;
    ball.vx = BALL_SPEED_INIT * (Math.random() < 0.5 ? 1 : -1);
    ball.vy = BALL_SPEED_INIT * (Math.random() * 2 - 1);
}

function updateBall() {
    ball.x += ball.vx;
    ball.y += ball.vy;

    // Top/bottom wall collision
    if (ball.y - ball.radius < 0) {
        ball.y = ball.radius;
        ball.vy *= -1;
    }
    if (ball.y + ball.radius > HEIGHT) {
        ball.y = HEIGHT - ball.radius;
        ball.vy *= -1;
    }

    // Left paddle collision
    if (
        ball.x - ball.radius < leftPaddle.x + leftPaddle.width &&
        ball.x - ball.radius > leftPaddle.x &&
        ball.y > leftPaddle.y &&
        ball.y < leftPaddle.y + leftPaddle.height
    ) {
        ball.x = leftPaddle.x + leftPaddle.width + ball.radius;
        ball.vx *= -1;
        // Add some randomness to Y velocity
        ball.vy += (Math.random() - 0.5) * 2;
    }

    // Right paddle collision
    if (
        ball.x + ball.radius > rightPaddle.x &&
        ball.x + ball.radius < rightPaddle.x + rightPaddle.width &&
        ball.y > rightPaddle.y &&
        ball.y < rightPaddle.y + rightPaddle.height
    ) {
        ball.x = rightPaddle.x - ball.radius;
        ball.vx *= -1;
        // Add some randomness to Y velocity
        ball.vy += (Math.random() - 0.5) * 2;
    }

    // Out of bounds (reset ball)
    if (ball.x < 0 || ball.x > WIDTH) {
        resetBall();
    }
}

// --- Drawing ---
function drawRect(x, y, w, h, color = '#fff') {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

function drawCircle(x, y, r, color = '#fff') {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
}

function drawNet() {
    ctx.strokeStyle = "#666";
    ctx.setLineDash([8, 12]);
    ctx.beginPath();
    ctx.moveTo(WIDTH / 2, 0);
    ctx.lineTo(WIDTH / 2, HEIGHT);
    ctx.stroke();
    ctx.setLineDash([]);
}

function draw() {
    // Clear
    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    // Net
    drawNet();

    // Paddles
    drawRect(leftPaddle.x, leftPaddle.y, leftPaddle.width, leftPaddle.height);
    drawRect(rightPaddle.x, rightPaddle.y, rightPaddle.width, rightPaddle.height);

    // Ball
    drawCircle(ball.x, ball.y, ball.radius);
}

// --- Main Loop ---
function gameLoop() {
    updateBall();
    updateRightPaddle();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();