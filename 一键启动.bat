@echo off
setlocal EnableExtensions
chcp 65001 >nul
title WWCombo one-click startup
cd /d "%~dp0"

if not exist "%~dp0server\windows-deploy.ps1" (
  echo Missing server\windows-deploy.ps1. Please clone the complete repository again.
  pause
  exit /b 1
)

where powershell.exe >nul 2>nul
if errorlevel 1 (
  echo Windows PowerShell was not found.
  pause
  exit /b 1
)

powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0server\windows-deploy.ps1"
set "EXIT_CODE=%ERRORLEVEL%"

echo.
if not "%EXIT_CODE%"=="0" (
  echo Startup failed. Review the message above.
) else (
  echo WWCombo is installed and running.
)
pause
exit /b %EXIT_CODE%
