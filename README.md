# Data Engineering Roadway Animation

An animated one-point perspective grid roadway featuring data engineering and technology terms.

## Quick Start

### Option 1: Using npm (Recommended)
```bash
npm install
npm start
```
The page will open automatically at `http://localhost:8000`

### Option 2: Using Python
```bash
# Python 3
python -m http.server 8000

# Then open http://localhost:8000 in your browser
```

### Option 3: Using VS Code Live Server
- Install "Live Server" extension
- Right-click on `index.html` → "Open with Live Server"

## Features

- ✅ One-point perspective checkerboard grid
- ✅ Continuous forward animation
- ✅ Data-related terms overlaid on grid squares
- ✅ Responsive design
- ✅ Smooth looping animation
- ✅ Depth-based opacity for 3D effect

## Deployment

### Netlify (Easiest)
1. Go to [netlify.com/drop](https://app.netlify.com/drop)
2. Drag and drop this folder
3. Get instant live link!

### Vercel
```bash
npx vercel
```

### GitHub Pages
1. Push to GitHub repository
2. Go to Settings → Pages
3. Select main branch
4. Your site will be live at `https://yourusername.github.io/repo-name`

## Customization

Edit `animation.js` to customize:
- `config.speed`: Animation speed (default: 0.08)
- `config.gridSize`: Grid square size (default: 60)
- `config.colors`: Color scheme
- `dataTerms`: Array of terms to display

