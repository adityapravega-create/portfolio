@echo off
setlocal enabledelayedexpansion
title Deploy portfolio to GitHub Pages
color 0B

echo ============================================================
echo   ADITYA - PORTFOLIO DEPLOY
echo ============================================================
echo.

cd /d "%~dp0"

where git >nul 2>nul
if errorlevel 1 (
  echo [X] Git is not installed on this PC.
  echo.
  echo     Install it from:  https://git-scm.com/download/win
  echo     Click Next through every screen, then run this file again.
  echo.
  pause
  exit /b 1
)
echo [OK] Git found.
echo.

set /p GHUSER="Your GitHub username: "
if "%GHUSER%"=="" (
  echo No username entered. Exiting.
  pause
  exit /b 1
)

set REPO=portfolio
set /p REPO="Repo name [portfolio]: "
if "%REPO%"=="" set REPO=portfolio

echo.
echo ------------------------------------------------------------
echo   BEFORE CONTINUING - create the empty repo on GitHub:
echo.
echo   1. Open  https://github.com/new
echo   2. Repository name:  %REPO%
echo   3. Select PUBLIC
echo   4. Do NOT tick "Add a README file"
echo   5. Click "Create repository"
echo ------------------------------------------------------------
echo.
pause

echo.
echo Preparing repository...
if not exist ".git" (
  git init -b main
) else (
  git checkout -B main
)

git config user.name "%GHUSER%" >nul 2>nul
git add -A
git commit -m "Portfolio site" 2>nul
if errorlevel 1 echo   (nothing new to commit - continuing)

git remote remove origin 2>nul
git remote add origin https://github.com/%GHUSER%/%REPO%.git

echo.
echo Pushing to GitHub...
echo (A browser window may open asking you to sign in to GitHub - that is normal.)
echo.
git push -u origin main --force
if errorlevel 1 (
  echo.
  echo [X] Push failed.
  echo     Most common causes:
  echo       - the repo %REPO% does not exist yet on GitHub
  echo       - the username %GHUSER% is wrong
  echo       - you cancelled the sign-in window
  echo.
  pause
  exit /b 1
)

echo.
echo ============================================================
echo   PUSHED SUCCESSFULLY
echo ============================================================
echo.
echo   LAST STEP - turn Pages on:
echo.
echo   1. Open  https://github.com/%GHUSER%/%REPO%/settings/pages
echo   2. Source: "Deploy from a branch"
echo   3. Branch: main    Folder: / (root)
echo   4. Click Save, then wait about a minute
echo.
echo   Your site will be live at:
echo     https://%GHUSER%.github.io/%REPO%/
echo.
echo ============================================================
echo.
start "" "https://github.com/%GHUSER%/%REPO%/settings/pages"
pause
