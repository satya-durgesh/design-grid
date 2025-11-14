// Optimized animated perspective grid background
(function() {
    'use strict';
    
    let canvas, ctx;
    let animationFrame;
    let animationOffset = 0;
    
    // Configuration
    const config = {
        speed: 2,
        gridSize: 120,
        perspective: 0.5,
        colors: {
            purple: '#9b59b6',
            teal: '#1abc9c',
            white: '#ffffff',
            lightGray: '#f5f5f5',
            gridLine: '#d0d0d0'
        },
        vanishingPoint: { x: 0, y: 0 }
    };
    
    // Data terms - matching reference images
    const dataTerms = [
        'Data Engineering', 'Python', 'SQL', 'Machine Learning',
        'Model Training', 'Data Scientist', 'ETL', 'BIG DATA',
        'DATA PIPELINES', 'CLOUD', 'DATA QUALITY'
    ];
    
    // Initialize
    function init() {
        canvas = document.getElementById('roadwayCanvas');
        if (!canvas) {
            console.error('Canvas not found');
            return false;
        }
        
        ctx = canvas.getContext('2d');
        if (!ctx) {
            console.error('Canvas context not available');
            return false;
        }
        
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        
        // Start animation
        animate();
        return true;
    }
    
    // Resize canvas
    function resizeCanvas() {
        if (!canvas) return;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        config.vanishingPoint.x = canvas.width / 2;
        config.vanishingPoint.y = canvas.height * 0.35;
    }
    
    // Get 3D position
    function get3DPosition(x, y, z) {
        const scale = config.perspective / (z + config.perspective);
        return {
            x: config.vanishingPoint.x + (x - config.vanishingPoint.x) * scale,
            y: config.vanishingPoint.y + (y - config.vanishingPoint.y) * scale,
            size: config.gridSize * scale,
            scale: scale
        };
    }
    
    // Draw grid square
    function drawSquare(x, y, z, term) {
        const pos = get3DPosition(x, y, z);
        
        // Skip if too small or off screen
        if (pos.size < 2) return;
        if (pos.x < -pos.size || pos.x > canvas.width + pos.size) return;
        if (pos.y < -pos.size || pos.y > canvas.height + pos.size) return;
        
        // Determine checkerboard pattern (3-color: purple, teal, light gray)
        const gridX = Math.floor(x / config.gridSize);
        const gridY = Math.floor(y / config.gridSize);
        const pattern = (gridX + gridY) % 3;
        
        let color;
        if (pattern === 0) {
            color = config.colors.purple;
        } else if (pattern === 1) {
            color = config.colors.teal;
        } else {
            color = config.colors.lightGray;
        }
        
        // Opacity based on depth
        const opacity = Math.min(1, Math.max(0.4, 1 - z / 150));
        
        // Draw square
        ctx.fillStyle = color;
        ctx.globalAlpha = opacity;
        ctx.fillRect(pos.x - pos.size / 2, pos.y - pos.size / 2, pos.size, pos.size);
        
        // Draw border
        ctx.strokeStyle = config.colors.gridLine;
        ctx.lineWidth = Math.max(1, pos.size * 0.015);
        ctx.globalAlpha = opacity * 0.6;
        ctx.strokeRect(pos.x - pos.size / 2, pos.y - pos.size / 2, pos.size, pos.size);
        
        // Draw term on colored squares
        if (term && pattern !== 2 && pos.size > 30) {
            ctx.fillStyle = config.colors.white;
            ctx.font = `bold ${Math.max(12, pos.size * 0.16)}px Arial`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.globalAlpha = Math.min(1, opacity * 1.2);
            
            // Text shadow for readability
            ctx.shadowColor = 'rgba(0,0,0,0.5)';
            ctx.shadowBlur = 2;
            ctx.shadowOffsetX = 1;
            ctx.shadowOffsetY = 1;
            
            // Split multi-word terms
            const words = term.split(' ');
            const lineHeight = pos.size * 0.2;
            const startY = pos.y - (words.length - 1) * lineHeight / 2;
            
            words.forEach((word, i) => {
                ctx.fillText(word, pos.x, startY + i * lineHeight);
            });
            
            // Reset shadow
            ctx.shadowColor = 'transparent';
            ctx.shadowBlur = 0;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
        }
        
        ctx.globalAlpha = 1;
    }
    
    // Main animation loop
    function animate() {
        if (!canvas || !ctx) return;
        
        // Clear with white background
        ctx.fillStyle = config.colors.white;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw perspective lines (subtle)
        ctx.strokeStyle = config.colors.gridLine;
        ctx.lineWidth = 0.5;
        ctx.globalAlpha = 0.2;
        for (let i = -12; i <= 12; i++) {
            const angle = (i * Math.PI) / 24;
            const dist = Math.min(canvas.width, canvas.height) * 0.5;
            const startX = config.vanishingPoint.x + Math.cos(angle) * dist;
            const startY = config.vanishingPoint.y + Math.sin(angle) * dist;
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo(config.vanishingPoint.x, config.vanishingPoint.y);
            ctx.stroke();
        }
        ctx.globalAlpha = 1;
        
        // Update animation
        animationOffset += config.speed;
        
        // Draw grid layers
        const depth = 200;
        for (let z = 0; z < depth; z++) {
            const zPos = z + animationOffset;
            const scale = config.perspective / (z + config.perspective);
            const visibleSize = config.gridSize * scale;
            const gridCount = Math.ceil(Math.max(canvas.width, canvas.height) / visibleSize) + 6;
            
            for (let i = -gridCount; i <= gridCount; i++) {
                for (let j = -gridCount; j <= gridCount; j++) {
                    const x = i * config.gridSize;
                    const y = j * config.gridSize;
                    
                    // Select term for colored squares
                    let term = null;
                    const gridX = Math.floor(x / config.gridSize);
                    const gridY = Math.floor(y / config.gridSize);
                    const pattern = (gridX + gridY) % 3;
                    
                    if (pattern !== 2 && z > 2 && z % 2 === 0 && (i % 2 === 0 || j % 2 === 0)) {
                        const tempPos = get3DPosition(x, y, zPos);
                        if (tempPos.size > 35) {
                            const termIndex = (Math.abs(i) + Math.abs(j) + Math.floor(zPos)) % dataTerms.length;
                            term = dataTerms[termIndex];
                        }
                    }
                    
                    drawSquare(x, y, zPos, term);
                }
            }
        }
        
        // Continue animation loop
        animationFrame = requestAnimationFrame(animate);
    }
    
    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    // Cleanup on page unload
    window.addEventListener('beforeunload', function() {
        if (animationFrame) {
            cancelAnimationFrame(animationFrame);
        }
    });
})();


