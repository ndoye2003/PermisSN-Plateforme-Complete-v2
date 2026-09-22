<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json([
        'app' => 'PermisSN API Backend',
        'status' => 'online',
        'version' => '1.0.0',
        'pays' => 'Sénégal 🇸🇳',
        'documentation_url' => url('/api'),
    ]);
});
