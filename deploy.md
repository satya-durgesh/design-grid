# Deployment Instructions

## Quick Deploy to GitHub Pages

### Step 1: Create GitHub Repository
1. Go to https://github.com/new
2. Create a new repository (e.g., `data-roadway-animation`)
3. **DO NOT** initialize with README, .gitignore, or license

### Step 2: Push to GitHub
Run these commands (replace `YOUR_USERNAME` and `REPO_NAME` with your actual values):

```bash
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git
git branch -M main
git push -u origin main
```

### Step 3: Enable GitHub Pages
1. Go to your repository on GitHub
2. Click **Settings** → **Pages**
3. Under **Source**, select:
   - Branch: `main`
   - Folder: `/ (root)`
4. Click **Save**
5. Wait 1-2 minutes for deployment
6. Your site will be live at: `https://YOUR_USERNAME.github.io/REPO_NAME/`

## Alternative: Deploy to Netlify (Instant)

1. Go to https://app.netlify.com/drop
2. Drag and drop this entire folder
3. Get instant live link!

## Alternative: Deploy to Vercel

```bash
npx vercel
```

Follow the prompts to deploy.

