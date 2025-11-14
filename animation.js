const canvas = document.getElementById('roadwayCanvas');
const ctx = canvas.getContext('2d');

// Set canvas size
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    config.vanishingPoint = { x: canvas.width / 2, y: canvas.height / 2 };
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Configuration
const config = {
    speed: 0.08,
    gridSize: 60,
    colors: {
        primary: '#9b59b6',    // Purple
        secondary: '#1abc9c',  // Teal
        white: '#ffffff',
        dark: '#1a1a2e'
    },
    vanishingPoint: { x: canvas.width / 2, y: canvas.height / 2 },
    perspective: 0.6
};

// Data-related terms
const dataTerms = [
    'Data Engineering', 'Python', 'SQL', 'Machine Learning',
    'Model Training', 'ETL', 'BIG DATA', 'Data Scientist',
    'DATA PIPELINES', 'Apache Spark', 'Hadoop', 'Kafka',
    'Data Warehouse', 'Data Lake', 'TensorFlow', 'PyTorch',
    'Pandas', 'NumPy', 'Scikit-learn', 'Deep Learning',
    'Neural Networks', 'Feature Engineering', 'Data Mining',
    'Data Analytics', 'Cloud Computing', 'AWS', 'Azure'
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

    // Determine checkerboard pattern
    const gridX = Math.floor(x / config.gridSize);
    const gridY = Math.floor(y / config.gridSize);
    const isEven = (gridX + gridY) % 2 === 0;
    
    // Choose color based on checkerboard pattern with depth-based opacity
    const opacity = Math.min(1, Math.max(0.3, 1 - z / 150));
    const primaryColor = config.colors.primary;
    const secondaryColor = config.colors.secondary;
    
    ctx.fillStyle = isEven ? primaryColor : secondaryColor;
    ctx.globalAlpha = opacity;
    
    // Draw square with rounded corners effect
    ctx.fillRect(
        pos.x - pos.size / 2,
        pos.y - pos.size / 2,
        pos.size,
        pos.size
    );
    
    // Add border
    ctx.strokeStyle = config.colors.white;
    ctx.lineWidth = Math.max(0.5, pos.size * 0.02);
    ctx.globalAlpha = opacity * 0.8;
    ctx.strokeRect(
        pos.x - pos.size / 2,
        pos.y - pos.size / 2,
        pos.size,
        pos.size
    );
    
    ctx.globalAlpha = 1;
    
    // Draw term if provided and square is large enough
    if (term && pos.size > 25) {
        ctx.fillStyle = config.colors.white;
        ctx.font = `bold ${Math.max(10, pos.size * 0.12)}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.globalAlpha = Math.min(1, opacity * 1.5);
        
        // Word wrap for long terms
        const words = term.split(' ');
        const lineHeight = pos.size * 0.18;
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
    
    // Clear canvas with gradient background
    const gradient = ctx.createRadialGradient(
        config.vanishingPoint.x, config.vanishingPoint.y, 0,
        config.vanishingPoint.x, config.vanishingPoint.y, canvas.width
    );
    gradient.addColorStop(0, '#1a1a2e');
    gradient.addColorStop(1, '#0a0a0a');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
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
                
                // Select term based on position (for variety)
                let term = null;
                if (z % 4 === 0 && i % 3 === 0 && j % 3 === 0 && z > 5) {
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

