# GitHub Deployment - Quick Guide

## Step 1: Create GitHub Repository
1. Visit: https://github.com/new
2. Repository name: `data-roadway-animation` (or your choice)
3. Set to **Public**
4. **DO NOT** check "Add a README file"
5. Click **"Create repository"**

## Step 2: Connect and Push

Replace `YOUR_USERNAME` and `REPO_NAME` with your actual values, then run:

```powershell
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git
git branch -M main
git push -u origin main
```

## Step 3: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** → **Pages** (left sidebar)
3. Under **Source**:
   - Branch: Select **`main`**
   - Folder: Select **`/ (root)`**
4. Click **Save**
5. Wait 1-2 minutes for deployment

## Your Live Site

Your site will be available at:
```
https://YOUR_USERNAME.github.io/REPO_NAME/
```

## Example

If your username is `john` and repo is `data-roadway-animation`:
- Site URL: `https://john.github.io/data-roadway-animation/`

---

## Troubleshooting

### If remote already exists:
```powershell
git remote set-url origin https://github.com/YOUR_USERNAME/REPO_NAME.git
git push -u origin main
```

### If you need to authenticate:
GitHub may prompt for credentials. Use a Personal Access Token:
1. Go to: https://github.com/settings/tokens
2. Generate new token (classic)
3. Select scope: `repo`
4. Use token as password when prompted

