// Game variables
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const startScreen = document.getElementById('start-screen');
const startButton = document.getElementById('start-button');

// Game constants
const FLAP_SPEED = -5;
const GRAVITY = 0.25;
const BIRD_WIDTH = 34;
const BIRD_HEIGHT = 24;
const PIPE_WIDTH = 52;
const PIPE_GAP = 125;
const PIPE_SPEED = 2;
const PIPE_SPAWN_RATE = 120; // frames

// Game state
let gameStarted = false;
let frames = 0;
let score = 0;
let bestScore = 0;

// Bird object
const bird = {
    x: 50,
    y: canvas.height / 2 - BIRD_HEIGHT / 2,
    width: BIRD_WIDTH,
    height: BIRD_HEIGHT,
    velocity: 0,
    
    draw: function() {
        ctx.fillStyle = '#FFD700'; // Yellow color for the bird
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Draw bird eye
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(this.x + this.width - 5, this.y + 10, 3, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw bird beak
        ctx.fillStyle = '#FF6347';
        ctx.beginPath();
        ctx.moveTo(this.x + this.width, this.y + 10);
        ctx.lineTo(this.x + this.width + 10, this.y + 15);
        ctx.lineTo(this.x + this.width, this.y + 20);
        ctx.fill();
    },
    
    update: function() {
        if (gameStarted) {
            this.velocity += GRAVITY;
            this.y += this.velocity;
            
            // Check for collision with ground or ceiling
            if (this.y + this.height >= canvas.height) {
                this.y = canvas.height - this.height;
                gameOver();
            }
            
            if (this.y <= 0) {
                this.y = 0;
                this.velocity = 0;
            }
        }
    },
    
    flap: function() {
        this.velocity = FLAP_SPEED;
    },
    
    reset: function() {
        this.y = canvas.height / 2 - BIRD_HEIGHT / 2;
        this.velocity = 0;
    }
};

// Pipes array
let pipes = [];

// Pipe object constructor
function Pipe() {
    this.x = canvas.width;
    this.width = PIPE_WIDTH;
    this.topHeight = Math.floor(Math.random() * (canvas.height - PIPE_GAP - 60)) + 20;
    this.bottomY = this.topHeight + PIPE_GAP;
    this.bottomHeight = canvas.height - this.bottomY;
    this.passed = false;
    
    this.draw = function() {
        // Draw top pipe
        ctx.fillStyle = '#75C147'; // Green color for pipes
        ctx.fillRect(this.x, 0, this.width, this.topHeight);
        
        // Draw pipe cap
        ctx.fillStyle = '#558B2F';
        ctx.fillRect(this.x - 3, this.topHeight - 10, this.width + 6, 10);
        
        // Draw bottom pipe
        ctx.fillStyle = '#75C147';
        ctx.fillRect(this.x, this.bottomY, this.width, this.bottomHeight);
        
        // Draw pipe cap
        ctx.fillStyle = '#558B2F';
        ctx.fillRect(this.x - 3, this.bottomY, this.width + 6, 10);
    };
    
    this.update = function() {
        this.x -= PIPE_SPEED;
        
        // Check if pipe is passed
        if (!this.passed && this.x + this.width < bird.x) {
            score++;
            this.passed = true;
        }
        
        // Check for collision with bird
        if (
            bird.x + bird.width > this.x && 
            bird.x < this.x + this.width && 
            (bird.y < this.topHeight || bird.y + bird.height > this.bottomY)
        ) {
            gameOver();
        }
    };
}

// Game functions
function gameOver() {
    gameStarted = false;
    if (score > bestScore) {
        bestScore = score;
    }
    startScreen.style.display = 'block';
    startScreen.innerHTML = `
        <h2>Game Over</h2>
        <p>Score: ${score}</p>
        <p>Best Score: ${bestScore}</p>
        <button id="restart-button">Play Again</button>
    `;
    document.getElementById('restart-button').addEventListener('click', startGame);
}

function startGame() {
    gameStarted = true;
    frames = 0;
    score = 0;
    pipes = [];
    bird.reset();
    startScreen.style.display = 'none';
}

function drawBackground() {
    // Draw sky
    ctx.fillStyle = '#70C5CE';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw ground
    ctx.fillStyle = '#DED895';
    ctx.fillRect(0, canvas.height - 20, canvas.width, 20);
    
    // Draw grass
    ctx.fillStyle = '#5EAA15';
    ctx.fillRect(0, canvas.height - 20, canvas.width, 5);
}

function drawScore() {
    ctx.fillStyle = '#FFF';
    ctx.font = '35px Arial';
    ctx.fillText(score, canvas.width / 2 - 10, 50);
}

// Game loop
function update() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw background
    drawBackground();
    
    // Update and draw bird
    bird.update();
    bird.draw();
    
    // Update and draw pipes
    if (gameStarted) {
        if (frames % PIPE_SPAWN_RATE === 0) {
            pipes.push(new Pipe());
        }
        
        for (let i = 0; i < pipes.length; i++) {
            pipes[i].update();
            pipes[i].draw();
            
            // Remove pipes that are off screen
            if (pipes[i].x + pipes[i].width < 0) {
                pipes.splice(i, 1);
                i--;
            }
        }
        
        frames++;
    }
    
    // Draw score
    drawScore();
    
    // Request next frame
    requestAnimationFrame(update);
}

// Event listeners
startButton.addEventListener('click', startGame);

document.addEventListener('keydown', function(e) {
    if (e.code === 'Space') {
        if (!gameStarted) {
            startGame();
        }
        bird.flap();
    }
});

canvas.addEventListener('click', function() {
    if (gameStarted) {
        bird.flap();
    }
});

// Start the game loop
update(); 