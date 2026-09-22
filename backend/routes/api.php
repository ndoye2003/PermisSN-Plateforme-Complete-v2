<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CandidatController;
use App\Http\Controllers\Api\CentreController;
use App\Http\Controllers\Api\SessionController;
use App\Http\Controllers\Api\ReservationController;
use App\Http\Controllers\Api\AgentController;
use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\QcmController;
use App\Http\Controllers\Api\UserManagementController;

/*
|--------------------------------------------------------------------------
| PermisSN API Routes
|--------------------------------------------------------------------------
*/

// Routes Publiques
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
});

Route::get('/centres', [CentreController::class, 'index']);
Route::get('/centres/{id}', [CentreController::class, 'show']);
Route::get('/sessions', [SessionController::class, 'index']);
Route::get('/sessions/{id}', [SessionController::class, 'show']);
Route::get('/reservations/{id}/convocation-html', [ReservationController::class, 'getConvocationHtml']);
Route::get('/qcm/questions', [QcmController::class, 'getQuestions']);
Route::post('/qcm/test-public', [QcmController::class, 'submitTest']);

// Routes Protégées (Sanctum)
Route::middleware('auth:sanctum')->group(function () {

    // Profil & Déconnexion
    Route::get('/auth/me', [AuthController::class, 'me']);
    Route::post('/auth/logout', [AuthController::class, 'logout']);

    // Espace Candidat
    Route::prefix('candidat')->group(function () {
        Route::get('/profile', [CandidatController::class, 'getProfile']);
        Route::post('/profile', [CandidatController::class, 'updateProfile']);
        Route::post('/documents', [CandidatController::class, 'uploadDocument']);
    });

    // Réservations
    Route::prefix('reservations')->group(function () {
        Route::post('/', [ReservationController::class, 'store']);
        Route::get('/active', [ReservationController::class, 'getActive']);
        Route::post('/{id}/cancel', [ReservationController::class, 'cancel']);
    });

    // Entraînement au Code
    Route::post('/qcm/submit', [QcmController::class, 'submitTest']);

    // Espace Agent de Centre
    Route::middleware('role:agent,admin')->prefix('agent')->group(function () {
        Route::get('/sessions', [AgentController::class, 'getSessions']);
        Route::get('/sessions/{sessionId}/candidats', [AgentController::class, 'getSessionCandidates']);
        Route::post('/scan-qr', [AgentController::class, 'scanQrCode']);
        Route::post('/resultats', [AgentController::class, 'saveResultat']);
    });

    // Espace Administrateur
    Route::middleware('role:admin')->prefix('admin')->group(function () {
        Route::get('/stats', [AdminController::class, 'getStats']);
        Route::get('/candidats', [AdminController::class, 'getCandidats']);
        Route::post('/candidats/{id}/valider', [AdminController::class, 'validerDossier']);
        Route::post('/sessions', [AdminController::class, 'createSession']);
        Route::get('/smart-scheduling', [AdminController::class, 'getSmartScheduling']);
        Route::get('/users', [UserManagementController::class, 'index']);
        Route::post('/users', [UserManagementController::class, 'store']);
        Route::put('/users/{user}', [UserManagementController::class, 'update']);
        Route::post('/users/{user}/reset-password', [UserManagementController::class, 'resetPassword']);
        Route::delete('/users/{user}', [UserManagementController::class, 'destroy']);
    });
});
