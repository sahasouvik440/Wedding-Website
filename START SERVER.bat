@echo off
echo =========================================================================
echo  Eleanor ^& Alexander Wedding Celebration - Live Server
echo  Opening http://localhost:8080/
echo =========================================================================
start http://localhost:8080/
powershell -ExecutionPolicy Bypass -File "%~dp0start-server.ps1"
pause
