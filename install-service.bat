@echo off
setlocal

:: Change to directory where this .bat file lives
cd /d "%~dp0"

:: Define variables
set "SERVICE_NAME=BunScraperService"
set "BUN_CMD=bun"
set "APP_DIR=%CD%"
set "SCRIPT=run ./index.js"
set "NSSM_PATH=./nssm.exe"

:: Stop and remove old service if exists
%NSSM_PATH% stop %SERVICE_NAME%
%NSSM_PATH% remove %SERVICE_NAME% confirm

:: Install service
%NSSM_PATH% install %SERVICE_NAME% %BUN_CMD%
%NSSM_PATH% set %SERVICE_NAME% AppDirectory %APP_DIR%
%NSSM_PATH% set %SERVICE_NAME% AppParameters %SCRIPT%
%NSSM_PATH% set %SERVICE_NAME% Start SERVICE_AUTO_START
%NSSM_PATH% set %SERVICE_NAME% AppRestartDelay 5000
%NSSM_PATH% set %SERVICE_NAME% AppThrottle 15000
%NSSM_PATH% set %SERVICE_NAME% AppStdout %APP_DIR%\logs\stdout.log
%NSSM_PATH% set %SERVICE_NAME% AppStderr %APP_DIR%\logs\stderr.log

:: Restart every 8 hours using service recovery
%NSSM_PATH% set %SERVICE_NAME% AppExit Default Restart
%NSSM_PATH% set %SERVICE_NAME% AppRestartDelay 5000
%NSSM_PATH% set %SERVICE_NAME% AppStopMethodSkip 6

:: Recovery actions: restart service every 8 hours
sc failure %SERVICE_NAME% reset= 0 actions= restart/28800000

:: Start the service
%NSSM_PATH% start %SERVICE_NAME%

:: Done
echo Service %SERVICE_NAME% installed and started.
exit
