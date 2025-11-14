# GitHub Setup Script for Data Roadway Animation
Write-Host "=== GitHub Deployment Setup ===" -ForegroundColor Cyan
Write-Host ""

# Check if GitHub CLI is installed
$ghInstalled = Get-Command gh -ErrorAction SilentlyContinue
if ($ghInstalled) {
    Write-Host "GitHub CLI detected! Creating repository..." -ForegroundColor Green
    Write-Host ""
    $repoName = Read-Host "Enter repository name (or press Enter for 'data-roadway-animation')"
    if ([string]::IsNullOrWhiteSpace($repoName)) {
        $repoName = "data-roadway-animation"
    }
    
    Write-Host "Creating repository: $repoName" -ForegroundColor Yellow
    gh repo create $repoName --public --source=. --remote=origin --push
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "Repository created and code pushed!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Next: Enable GitHub Pages" -ForegroundColor Yellow
        $ghUser = gh api user --jq .login
        Write-Host "1. Visit: https://github.com/$ghUser/$repoName/settings/pages" -ForegroundColor Cyan
        Write-Host "2. Source: Branch 'main', Folder '/ (root)'" -ForegroundColor White
        Write-Host "3. Click Save" -ForegroundColor White
        Write-Host ""
        Write-Host "Your site will be live at:" -ForegroundColor Green
        Write-Host "https://$ghUser.github.io/$repoName/" -ForegroundColor Cyan
    }
} else {
    Write-Host "GitHub CLI not found. Manual setup required:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "STEP 1: Create GitHub Repository" -ForegroundColor Cyan
    Write-Host "1. Go to: https://github.com/new" -ForegroundColor White
    Write-Host "2. Repository name: data-roadway-animation (or your choice)" -ForegroundColor White
    Write-Host "3. Set to Public" -ForegroundColor White
    Write-Host "4. DO NOT initialize with README, .gitignore, or license" -ForegroundColor Yellow
    Write-Host "5. Click 'Create repository'" -ForegroundColor White
    Write-Host ""
    
    $username = Read-Host "Enter your GitHub username"
    $repoName = Read-Host "Enter repository name (or press Enter for 'data-roadway-animation')"
    if ([string]::IsNullOrWhiteSpace($repoName)) {
        $repoName = "data-roadway-animation"
    }
    
    Write-Host ""
    Write-Host "STEP 2: Connecting and pushing..." -ForegroundColor Cyan
    Write-Host ""
    
    $remoteUrl = "https://github.com/$username/$repoName.git"
    git remote add origin $remoteUrl
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Remote added" -ForegroundColor Green
        git branch -M main
        git push -u origin main
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host ""
            Write-Host "Code pushed successfully!" -ForegroundColor Green
            Write-Host ""
            Write-Host "STEP 3: Enable GitHub Pages" -ForegroundColor Cyan
            Write-Host "1. Visit: https://github.com/$username/$repoName/settings/pages" -ForegroundColor White
            Write-Host "2. Under 'Source':" -ForegroundColor White
            Write-Host "   - Branch: main" -ForegroundColor Yellow
            Write-Host "   - Folder: / (root)" -ForegroundColor Yellow
            Write-Host "3. Click 'Save'" -ForegroundColor White
            Write-Host "4. Wait 1-2 minutes for deployment" -ForegroundColor White
            Write-Host ""
            Write-Host "Your site will be live at:" -ForegroundColor Green
            Write-Host "https://$username.github.io/$repoName/" -ForegroundColor Cyan
        } else {
            Write-Host "Error pushing to GitHub. Please check your credentials." -ForegroundColor Red
        }
    } else {
        Write-Host "Remote might already exist. Updating..." -ForegroundColor Yellow
        git remote set-url origin $remoteUrl
        git push -u origin main
    }
}

Write-Host ""
Write-Host "Alternative: Instant deploy with Netlify" -ForegroundColor Cyan
Write-Host "Visit: https://app.netlify.com/drop" -ForegroundColor Green
Write-Host ""
