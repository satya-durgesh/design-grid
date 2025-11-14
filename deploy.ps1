# PowerShell script to deploy to GitHub Pages
# Run this script after creating a GitHub repository

Write-Host "=== Data Engineering Roadway Animation - Deployment ===" -ForegroundColor Cyan
Write-Host ""

# Check if git remote exists
$remoteExists = git remote get-url origin 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "No GitHub remote found. Please follow these steps:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "1. Create a new repository on GitHub:" -ForegroundColor White
    Write-Host "   https://github.com/new" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "2. Then run this command (replace YOUR_USERNAME and REPO_NAME):" -ForegroundColor White
    Write-Host "   git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git" -ForegroundColor Green
    Write-Host "   git push -u origin main" -ForegroundColor Green
    Write-Host ""
    Write-Host "3. Enable GitHub Pages:" -ForegroundColor White
    Write-Host "   - Go to your repo → Settings → Pages" -ForegroundColor Cyan
    Write-Host "   - Source: Branch 'main', Folder '/ (root)'" -ForegroundColor Cyan
    Write-Host "   - Save and wait 1-2 minutes" -ForegroundColor Cyan
    Write-Host ""
} else {
    Write-Host "Remote found: $remoteExists" -ForegroundColor Green
    Write-Host ""
    Write-Host "Pushing to GitHub..." -ForegroundColor Yellow
    git push -u origin main
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "✓ Successfully pushed to GitHub!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Next steps:" -ForegroundColor Yellow
        Write-Host "1. Go to your repository on GitHub" -ForegroundColor White
        Write-Host "2. Settings → Pages" -ForegroundColor White
        Write-Host "3. Select Branch: main, Folder: / (root)" -ForegroundColor White
        Write-Host "4. Save and wait for deployment" -ForegroundColor White
        Write-Host ""
    }
}

Write-Host "Alternative: Deploy instantly with Netlify" -ForegroundColor Cyan
Write-Host "Visit: https://app.netlify.com/drop" -ForegroundColor Green
Write-Host ""

