@echo off
title PermisSN - Frontend Angular
echo ===================================================
echo   PermisSN - Serveur Frontend Angular
echo ===================================================
cd /d "%~dp0frontend"

if not exist "node_modules" (
    echo Installation des modules Angular (cela peut prendre 1 a 2 minutes)...
    call npm install
)

echo.
echo ===================================================
echo Demarrage de l'application Angular sur http://localhost:4200 ...
echo Ouverture automatique de votre navigateur...
echo ===================================================
echo.
start http://localhost:4200
call npm start
pause
