// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('roadwayCanvas');
    if (!canvas) {
        console.error('Canvas element not found!');
        return;
    }
    
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        console.error('Could not get 2D context!');
        return;
    }

    // Configuration - must be defined before resizeCanvas
    const config = {
        speed: 0.12,
        gridSize: 100,
        colors: {
            primary: '#9b59b6',    // Purple
            secondary: '#1abc9c',  // Teal/Cyan
            white: '#ffffff',
            lightGray: '#f5f5f5',  // Light gray for white squares variation
            background: '#ffffff',  // White background
            gridLine: '#d0d0d0'     // Light gray grid lines
        },
        vanishingPoint: { x: 0, y: 0 }, // Will be set in resizeCanvas
        perspective: 0.45
    };

    // Set canvas size
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        config.vanishingPoint = { x: canvas.width / 2, y: canvas.height * 0.35 };
    }
    
    // Initialize canvas size
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Mandatory data-related terms from the comprehensive prompt
    const dataTerms = [
        'Data Engineering',
        'Python',
        'SQL',
        'Machine Learning',
        'Model Training',
        'Data Scientist',
        'ETL',
        'BIG DATA',
        'DATA PIPELINES',
        'CLOUD',
        'DATA QUALITY'
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

        // Determine checkerboard pattern - 3-color pattern (purple, teal, white/light gray)
        const gridX = Math.floor(x / config.gridSize);
        const gridY = Math.floor(y / config.gridSize);
        const patternIndex = (gridX + gridY) % 3;
        
        // Choose color based on checkerboard pattern
        // Pattern: purple, teal, white/light gray, purple, teal, white/light gray...
        let squareColor;
        if (patternIndex === 0) {
            squareColor = config.colors.primary; // Purple
        } else if (patternIndex === 1) {
            squareColor = config.colors.secondary; // Teal/Cyan
        } else {
            squareColor = config.colors.lightGray; // Light gray (for white squares variation)
        }
        
        // Opacity based on depth - maintain visibility longer
        const opacity = Math.min(1, Math.max(0.5, 1 - z / 180));
        
        ctx.fillStyle = squareColor;
        ctx.globalAlpha = opacity;
        
        // Draw square with rounded corners effect
        ctx.fillRect(
            pos.x - pos.size / 2,
            pos.y - pos.size / 2,
            pos.size,
            pos.size
        );
        
        // Add border on all squares for distinct checkerboard pattern
        ctx.strokeStyle = config.colors.gridLine;
        ctx.lineWidth = Math.max(1, pos.size * 0.02);
        ctx.globalAlpha = opacity * 0.7;
        ctx.strokeRect(
            pos.x - pos.size / 2,
            pos.y - pos.size / 2,
            pos.size,
            pos.size
        );
        
        ctx.globalAlpha = 1;
        
        // Draw term if provided and square is large enough
        // Show terms prominently on colored squares (purple and teal)
        if (term && pos.size > 25 && squareColor !== config.colors.lightGray) {
            // Use white text on colored squares for high contrast
            ctx.fillStyle = config.colors.white;
            ctx.font = `bold ${Math.max(14, pos.size * 0.18)}px Arial`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.globalAlpha = Math.min(1, opacity * 1.3);
            
            // Add text shadow for better readability
            ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
            ctx.shadowBlur = 2;
            ctx.shadowOffsetX = 1;
            ctx.shadowOffsetY = 1;
            
            // Word wrap for long terms
            const words = term.split(' ');
            const lineHeight = pos.size * 0.22;
            const startY = pos.y - (words.length - 1) * lineHeight / 2;
            
            words.forEach((word, i) => {
                ctx.fillText(word, pos.x, startY + i * lineHeight);
            });
            
            // Reset shadow
            ctx.shadowColor = 'transparent';
            ctx.shadowBlur = 0;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
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
        
        // Draw subtle perspective grid lines extending from vanishing point
        ctx.strokeStyle = config.colors.gridLine;
        ctx.lineWidth = 0.5;
        ctx.globalAlpha = 0.25;
        
        // Draw radial perspective lines from vanishing point (creating roadway effect)
        for (let i = -15; i <= 15; i++) {
            const angle = (i * Math.PI) / 30;
            const startX = config.vanishingPoint.x + Math.cos(angle) * canvas.width * 0.6;
            const startY = config.vanishingPoint.y + Math.sin(angle) * canvas.height * 0.6;
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo(config.vanishingPoint.x, config.vanishingPoint.y);
            ctx.stroke();
        }
        
        ctx.globalAlpha = 1;
        
        // Update animation offset for continuous forward movement
        animationOffset += config.speed;
        
        // Draw grid extending into the distance - seamless looping
        const depth = 300;
        
        for (let z = 0; z < depth; z += 1) {
            const zPos = z + animationOffset;
            const gridZ = Math.floor(zPos);
            
            // Calculate how many squares to draw at this depth
            const scale = config.perspective / (z + config.perspective);
            const visibleSize = config.gridSize * scale;
            const gridCount = Math.ceil(Math.max(canvas.width, canvas.height) / visibleSize) + 8;
            
            for (let i = -gridCount; i <= gridCount; i++) {
                for (let j = -gridCount; j <= gridCount; j++) {
                    const x = i * config.gridSize;
                    const y = j * config.gridSize;
                    
                    // Calculate position to check size before selecting term
                    const tempPos = getGridPosition(x, y, zPos);
                    
                    // Select term based on position - show more frequently and prominently
                    let term = null;
                    const patternIndex = (Math.floor(x / config.gridSize) + Math.floor(y / config.gridSize)) % 3;
                    
                    // Show terms on colored squares (purple and teal) more frequently
                    // Ensure all mandatory terms appear prominently
                    if (patternIndex !== 2 && z > 2 && tempPos.size > 35) {
                        // Increase frequency: show terms on every 2nd depth level and on alternating grid positions
                        if (z % 2 === 0 && (i % 2 === 0 || j % 2 === 0)) {
                            const termIndex = (Math.abs(i) + Math.abs(j) + gridZ) % dataTerms.length;
                            term = dataTerms[termIndex];
                        }
                    }
                    
                    drawGridSquare(x, y, zPos, term);
                }
            }
        }
        
        requestAnimationFrame(animate);
    }

    // Start animation
    requestAnimationFrame(animate);
});

