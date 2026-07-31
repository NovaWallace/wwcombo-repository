@echo off
setlocal EnableExtensions
chcp 65001 >nul
title WWCombo Windows one-click deployment

where powershell.exe >nul 2>nul
if errorlevel 1 (
  echo Windows PowerShell was not found.
  pause
  exit /b 1
)

powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0windows-deploy.ps1"
set "EXIT_CODE=%ERRORLEVEL%"

echo.
if not "%EXIT_CODE%"=="0" (
  echo Deployment failed. Review the message above.
) else (
  echo Deployment finished successfully.
)
pause
exit /b %EXIT_CODE%
