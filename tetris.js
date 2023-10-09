const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const boxSize = 30; 
const rows = canvas.height / boxSize;
const cols = canvas.width / boxSize;

// Initialize a grid to keep track of filled positions
const grid = Array(rows).fill().map(() => Array(cols).fill(null));

// Tetris shapes and their colors
const tetrominoes = [
    {shape: [{x: 0, y: 0}, {x: 1, y: 0}, {x: 0, y: 1}, {x: 1, y: 1}], color: 'blue'}, // Square
    {shape: [{x: 0, y: 1}, {x: 1, y: 1}, {x: 2, y: 1}, {x: 3, y: 1}], color: 'red'},  // Line
    {shape: [{x: 2, y: 0}, {x: 0, y: 1}, {x: 1, y: 1}, {x: 2, y: 1}], color: 'green'}, // T
    {shape: [{x: 1, y: 0}, {x: 2, y: 0}, {x: 0, y: 1}, {x: 1, y: 1}], color: 'yellow'}, // L
];

function getRandomTetromino() {
    return {...tetrominoes[Math.floor(Math.random() * tetrominoes.length)]};
}

let currentTetromino = getRandomTetromino();
let position = {x: 5, y: 0};
let counter = 0;
const speed = 60;
let dropSpeed = 1;

function drawBlock(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x * boxSize, y * boxSize, boxSize, boxSize);
}

function rotate(shape) {
    const pivot = shape[1]; 
    const rotated = shape.map(p => ({ 
        x: pivot.x + (p.y - pivot.y), 
        y: pivot.y - (p.x - pivot.x) 
    }));
    return rotated;
}

document.addEventListener('keydown', function(event) {
    if (event.key === 'ArrowUp') {
        currentTetromino.shape = rotate(currentTetromino.shape);
    } else if (event.key === 'ArrowDown') {
        dropSpeed = 5;
    } else if (event.key === 'ArrowLeft' && canMove(currentTetromino.shape, {x: -1, y: 0})) {
        position.x--;
    } else if (event.key === 'ArrowRight' && canMove(currentTetromino.shape, {x: 1, y: 0})) {
        position.x++;
    }
});

document.addEventListener('keyup', function(event) {
    if (event.key === 'ArrowDown') {
        dropSpeed = 1;
    }
});

function canMove(shape, offset) {
    return shape.every(p => 
        p.x + position.x + offset.x >= 0 && 
        p.x + position.x + offset.x < cols &&
        p.y + position.y + offset.y < rows &&
        !grid[p.y + position.y + offset.y][p.x + position.x + offset.x]
    );
}

function placeTetromino() {
    for (let block of currentTetromino.shape) {
        grid[block.y + position.y][block.x + position.x] = currentTetromino.color;
    }
    position = {x: 5, y: 0};
    currentTetromino = getRandomTetromino();
}

function updateGameArea() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the filled positions from the grid
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            if (grid[y][x]) {
                drawBlock(x, y, grid[y][x]);
            }
        }
    }

    // Draw current shape
    for (let block of currentTetromino.shape) {
        drawBlock(block.x + position.x, block.y + position.y, currentTetromino.color);
    }

    counter += dropSpeed;
    if (counter >= speed) {
        if (canMove(currentTetromino.shape, {x: 0, y: 1})) {
            position.y++;
        } else {
            placeTetromino();
        }
        counter = 0;  // Reset the counter
    }

    requestAnimationFrame(updateGameArea);
}

updateGameArea();
