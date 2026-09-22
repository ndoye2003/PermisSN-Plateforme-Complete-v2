@echo off
title PermisSN - Backend Laravel
echo ===================================================
echo   PermisSN - Serveur Backend Laravel (API)
echo ===================================================
cd /d "%~dp0backend"

if not exist ".env" (
    echo Fichier .env manquant, copie depuis .env.example...
    copy .env.example .env
    php artisan key:generate
)

if not exist "vendor" (
    echo Installation des dependances Composer...
    call composer install --no-interaction
)

echo.
echo ===================================================
echo Serveur API en cours sur : http://127.0.0.1:8000
echo Pour voir le site web, lancez start-frontend.bat
echo puis ouvrez votre navigateur sur http://localhost:4200
echo ===================================================
echo.
php artisan serve --host=127.0.0.1 --port=8000
pause
