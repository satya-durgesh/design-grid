const canvas = document.getElementById('roadwayCanvas');
const ctx = canvas.getContext('2d');

// Set canvas size
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    config.vanishingPoint = { x: canvas.width / 2, y: canvas.height * 0.4 };
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Configuration
const config = {
    speed: 0.1,
    gridSize: 80,
    colors: {
        primary: '#9b59b6',    // Purple
        secondary: '#1abc9c',  // Teal
        white: '#ffffff',
        background: '#ffffff',  // White background
        gridLine: '#e0e0e0'     // Light gray grid lines
    },
    vanishingPoint: { x: canvas.width / 2, y: canvas.height * 0.4 }, // Higher vanishing point for roadway effect
    perspective: 0.5
};

// Data-related terms - prioritizing the key terms from reference images
const dataTerms = [
    'Data Engineering', 'Python', 'SQL', 'Machine Learning',
    'Model Training', 'ETL', 'BIG DATA', 'Data Scientist',
    'DATA PIPELINES', 'DATA QUALITY', 'CLOUD', 'Data'
];

// Animation state
let animationOffset = 0;
let lastTime = 0;

// Calculate grid position in 3D space
function getGridPosition(x, y, z) {
    const scale = config.perspective / (z + config.perspective);
    const screenX = config.vanishingPoint.x + (x - config.vanishingPoint.x) * scale;
    const screenY = config.vanishingPoint.y + (y - config.vanishingPoint.y) * scale;
    const screenSize = config.gridSize * scale;
    return { x: screenX, y: screenY, size: screenSize, scale: scale };
}

// Draw a single grid square
function drawGridSquare(x, y, z, term = null) {
    const pos = getGridPosition(x, y, z);
    
    if (pos.size < 1 || pos.x < -200 || pos.x > canvas.width + 200 || 
        pos.y < -200 || pos.y > canvas.height + 200) {
        return;
    }

    // Determine checkerboard pattern - 3-color pattern (purple, teal, white)
    const gridX = Math.floor(x / config.gridSize);
    const gridY = Math.floor(y / config.gridSize);
    const patternIndex = (gridX + gridY) % 3;
    
    // Choose color based on checkerboard pattern
    // Pattern: purple, teal, white, purple, teal, white...
    let squareColor;
    if (patternIndex === 0) {
        squareColor = config.colors.primary; // Purple
    } else if (patternIndex === 1) {
        squareColor = config.colors.secondary; // Teal
    } else {
        squareColor = config.colors.white; // White
    }
    
    // Opacity based on depth - less fade for better visibility
    const opacity = Math.min(1, Math.max(0.4, 1 - z / 200));
    
    ctx.fillStyle = squareColor;
    ctx.globalAlpha = opacity;
    
    // Draw square with rounded corners effect
    ctx.fillRect(
        pos.x - pos.size / 2,
        pos.y - pos.size / 2,
        pos.size,
        pos.size
    );
    
    // Add border - only on colored squares, not white ones
    if (squareColor !== config.colors.white) {
        ctx.strokeStyle = config.colors.gridLine;
        ctx.lineWidth = Math.max(1, pos.size * 0.015);
        ctx.globalAlpha = opacity * 0.6;
        ctx.strokeRect(
            pos.x - pos.size / 2,
            pos.y - pos.size / 2,
            pos.size,
            pos.size
        );
    }
    
    ctx.globalAlpha = 1;
    
    // Draw term if provided and square is large enough
    // Only show terms on colored squares (not white)
    if (term && pos.size > 20 && squareColor !== config.colors.white) {
        // Use white text on colored squares, dark text on white squares (though we skip white)
        ctx.fillStyle = config.colors.white;
        ctx.font = `bold ${Math.max(12, pos.size * 0.15)}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.globalAlpha = Math.min(1, opacity * 1.2);
        
        // Word wrap for long terms
        const words = term.split(' ');
        const lineHeight = pos.size * 0.2;
        const startY = pos.y - (words.length - 1) * lineHeight / 2;
        
        words.forEach((word, i) => {
            ctx.fillText(word, pos.x, startY + i * lineHeight);
        });
        
        ctx.globalAlpha = 1;
    }
}

// Main animation loop
function animate(currentTime) {
    if (!lastTime) lastTime = currentTime;
    const deltaTime = currentTime - lastTime;
    lastTime = currentTime;
    
    // Clear canvas with white background (matching reference images)
    ctx.fillStyle = config.colors.background;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw subtle grid lines extending from the perspective
    ctx.strokeStyle = config.colors.gridLine;
    ctx.lineWidth = 0.5;
    ctx.globalAlpha = 0.3;
    
    // Draw perspective lines from vanishing point
    for (let i = -10; i <= 10; i++) {
        const angle = (i * Math.PI) / 20;
        const startX = config.vanishingPoint.x + Math.cos(angle) * 100;
        const startY = config.vanishingPoint.y + Math.sin(angle) * 100;
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(config.vanishingPoint.x, config.vanishingPoint.y);
        ctx.stroke();
    }
    
    ctx.globalAlpha = 1;
    
    // Update animation offset
    animationOffset += config.speed;
    
    // Draw grid extending into the distance
    const depth = 250;
    const gridExtent = 25;
    
    for (let z = 0; z < depth; z += 1) {
        const zPos = z + animationOffset;
        const gridZ = Math.floor(zPos);
        
        // Calculate how many squares to draw at this depth
        const scale = config.perspective / (z + config.perspective);
        const visibleSize = config.gridSize * scale;
        const gridCount = Math.ceil(Math.max(canvas.width, canvas.height) / visibleSize) + 6;
        
        for (let i = -gridCount; i <= gridCount; i++) {
            for (let j = -gridCount; j <= gridCount; j++) {
                const x = i * config.gridSize;
                const y = j * config.gridSize;
                
                // Calculate position to check size before selecting term
                const tempPos = getGridPosition(x, y, zPos);
                
                // Select term based on position - show more frequently
                let term = null;
                // Show terms more often, especially on colored squares
                const patternIndex = (Math.floor(x / config.gridSize) + Math.floor(y / config.gridSize)) % 3;
                if (patternIndex !== 2 && z % 3 === 0 && (i % 2 === 0 || j % 2 === 0) && z > 3 && tempPos.size > 30) {
                    const termIndex = (Math.abs(i) + Math.abs(j) + gridZ) % dataTerms.length;
                    term = dataTerms[termIndex];
                }
                
                drawGridSquare(x, y, zPos, term);
            }
        }
    }
    
    requestAnimationFrame(animate);
}

// Start animation
requestAnimationFrame(animate);

