@echo off
echo =========================================================================
echo  Eleanor ^& Alexander Wedding Celebration - Live Server
echo  Opening http://localhost:8080/
echo =========================================================================
powershell -ExecutionPolicy Bypass -File "%~dp0start-server.ps1"
pause
