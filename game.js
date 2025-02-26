const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game Variables
let birdY = canvas.height / 2;
let birdSpeed = 0;
const gravity = 0.1;
let gameActive = false;
let score = 0;
let stars = [];
let obstacles = [];
let particles = [];
let starSpeed = 2;
let obstacleSpeed = 2;
let currentStarName = '';  // Variable to store the current star name

// Load Bird Frames for Animation
const birdFrames = [
    'owl_frame1.png',
    'owl_frame2.png',
    'owl_frame3.png',
    'owl_frame4.png'
];
let birdFrameIndex = 0;
let birdImg = new Image();
birdImg.src = birdFrames[birdFrameIndex];

// Load Background and Foreground Images
const backgroundImg = new Image();
backgroundImg.src = 'background1b.png';

const foregroundImg = new Image();
foregroundImg.src = 'background1a.png';

// Load Obstacle Image
const obstacleImg = new Image();
obstacleImg.src = 'glowing_ball.png';  // Make sure this image file exists in the directory

// Load and reference Background Music
const backgroundMusic = document.getElementById('backgroundMusic');
backgroundMusic.volume = 0.02;

// Load Star Sounds and Set Volume
const starAudios = [
    { audio: document.getElementById('tipuanukuAudio'), name: 'Tupuānuku', src: 'Tipuanuku.png', volume: 0.8 },
    { audio: document.getElementById('hiwaiterangiAudio'), name: 'Hiwa-i-te-rangi', src: 'Hiwaiterangi.png', volume: 0.8 },
    { audio: document.getElementById('matarikiAudio'), name: 'Matariki', src: 'Matariki.png', volume: 0.8 },
    { audio: document.getElementById('pohutukawaAudio'), name: 'Pōhutukawa', src: 'Pohutukawa.png', volume: 0.8 },
    { audio: document.getElementById('tipuarangiAudio'), name: 'Tupuārangi', src: 'Tupuarangi.png', volume: 0.8 },
    { audio: document.getElementById('ururangiAudio'), name: 'Ururangi', src: 'Ururangi.png', volume: 0.8 },
    { audio: document.getElementById('waipunarangiAudio'), name: 'Waipunarangi', src: 'Waipunarangi.png', volume: 0.8 },
    { audio: document.getElementById('waitaAudio'), name: 'Waitā', src: 'Waita.png', volume: 0.8 },
    { audio: document.getElementById('waitiAudio'), name: 'Waitī', src: 'Waiti.png', volume: 0.8 }
];

// Set volumes for star audios
starAudios.forEach(starAudio => {
    starAudio.audio.volume = starAudio.volume;
});

// Particle Class
class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 5 + 2;
        this.speedX = (Math.random() * 2 - 1) * 2;
        this.speedY = (Math.random() * 2 - 1) * 2;
        this.color = 'rgba(255, 255, 255, 0.8)';
        this.life = Math.random() * 50 + 50;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.life--;
        if (this.life < 0 && this.size > 0) {
            this.size -= 0.1;
        }
    }

    draw() {
        if (this.size > 0) {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}

// Function for triggering bird jump (space and touch)
function flapAction() {
    if (!gameActive) {
        backgroundMusic.play(); // Play the background music on the first interaction
    }
    if (gameActive) {
        birdSpeed = -4; // Adjust this value for bird's upward movement
    } else {
        gameActive = true;
        score = 0;
        stars = [];
        obstacles = [];
        particles = [];
        birdY = canvas.height / 2;
        birdSpeed = 0;
        starSpeed = 2;
        obstacleSpeed = 2;
        currentStarName = ''; // Reset the star name
    }
    console.log("Jump triggered, gameActive:", gameActive);
}

// Event Listener for Space Key
document.addEventListener('keydown', function(event) {
    if (event.code === 'Space') {
        flapAction();
    }
});

// Event Listener for Touch (for iPad and mobile)
document.addEventListener('touchstart', function() {
    flapAction();
});

// Foreground animation variables
let fgX = 0;
const fgSpeed = 2; // Speed of the foreground animation

// Timer for Bird Animation
let lastFrameTime = 0;
function updateBirdAnimation(timestamp) {
    if (timestamp - lastFrameTime > 200) { // Change frame every 200 ms
        birdFrameIndex = (birdFrameIndex + 1) % birdFrames.length;
        birdImg.src = birdFrames[birdFrameIndex];
        lastFrameTime = timestamp;
    }
    requestAnimationFrame(updateBirdAnimation);
}

// Start Bird Animation Loop
requestAnimationFrame(updateBirdAnimation);

// Game Loop
function gameLoop(timestamp) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Background
    ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);

    // Draw Foreground
    ctx.drawImage(foregroundImg, fgX, 0, canvas.width, canvas.height);
    ctx.drawImage(foregroundImg, fgX + canvas.width, 0, canvas.width, canvas.height);

    // Move Foreground
    fgX -= fgSpeed;
    if (fgX <= -canvas.width) {
        fgX = 0;
    }

    // Draw Bird
    let birdWidth = 50; // Adjust the width for scaling
    let birdHeight = 50; // Adjust the height for scaling
    ctx.drawImage(birdImg, 50, birdY, birdWidth, birdHeight);

    // Bird Physics
    if (gameActive) {
        birdSpeed += gravity;
        birdY += birdSpeed;
    }

    // Display Score
    ctx.fillStyle = '#fff';
    ctx.font = '24px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`Score: ${score}`, 10, 30);

    requestAnimationFrame(gameLoop);
}

// Start Game Loop
requestAnimationFrame(gameLoop);
