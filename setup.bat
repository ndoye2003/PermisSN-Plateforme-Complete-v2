@echo off
title Configuration Initiale PermisSN
echo ===================================================
echo   Configuration Initiale de PermisSN
echo ===================================================
echo.

cd /d "%~dp0backend"
echo [1/4] Verification du backend...
if not exist ".env" (
    copy .env.example .env
    echo .env cree.
)

echo [2/4] Installation des dependances Composer...
call composer install --no-interaction

echo [3/4] Generation de la cle d'application...
call php artisan key:generate

echo [4/4] Execution des migrations et donnees de test...
call php artisan migrate:fresh --seed

echo.
echo Configuration Backend terminee avec succes !
echo.
cd /d "%~dp0frontend"
echo Installation des modules Angular...
call npm install

echo.
echo ===================================================
echo   Installation terminee ! Vous pouvez lancer :
echo   - start-backend.bat
echo   - start-frontend.bat
echo ===================================================
pause
