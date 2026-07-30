@echo off
setlocal
chcp 65001 >nul
title WWCombo Windows deployment

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
