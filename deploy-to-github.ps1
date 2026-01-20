# Quick Deployment Script for Komak Project
# Run this after creating the GitHub repository

Write-Host "🚀 Komak Project - GitHub Push Script" -ForegroundColor Cyan
Write-Host ""

# Check if git is initialized
if (-Not (Test-Path ".git")) {
    Write-Host "❌ Git not initialized. Run 'git init' first." -ForegroundColor Red
    exit 1
}

Write-Host "Step 1: Checking git status..." -ForegroundColor Yellow
git status

Write-Host ""
Write-Host "Step 2: Setting remote URL..." -ForegroundColor Yellow
Write-Host "Current remote:" -ForegroundColor Gray
git remote -v

$repoUrl = Read-Host "Enter your GitHub repository URL (e.g., https://github.com/AmineBN/Komak.git)"

# Update or add remote
if (git remote | Select-String -Pattern "origin") {
    git remote set-url origin $repoUrl
    Write-Host "✅ Updated remote origin" -ForegroundColor Green
} else {
    git remote add origin $repoUrl
    Write-Host "✅ Added remote origin" -ForegroundColor Green
}

Write-Host ""
Write-Host "Step 3: Pushing to GitHub..." -ForegroundColor Yellow
git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Successfully pushed to GitHub!" -ForegroundColor Green
    Write-Host ""
    Write-Host "🎯 Next Steps:" -ForegroundColor Cyan
    Write-Host "1. Go to https://vercel.com" -ForegroundColor White
    Write-Host "2. Click 'Add New' → 'Project'" -ForegroundColor White
    Write-Host "3. Import your GitHub repository" -ForegroundColor White
    Write-Host "4. Add environment variables:" -ForegroundColor White
    Write-Host "   - VITE_SUPABASE_URL: https://tbfajuryfbbiqpykzvra.supabase.co" -ForegroundColor Gray
    Write-Host "   - VITE_SUPABASE_ANON_KEY: (from your .env file)" -ForegroundColor Gray
    Write-Host "5. Click 'Deploy' 🚀" -ForegroundColor White
} else {
    Write-Host ""
    Write-Host "❌ Push failed. Common solutions:" -ForegroundColor Red
    Write-Host "1. Make sure the repository exists on GitHub" -ForegroundColor Yellow
    Write-Host "2. Check your GitHub authentication" -ForegroundColor Yellow
    Write-Host "3. Try: git push -u origin main --force (if you're sure)" -ForegroundColor Yellow
}
