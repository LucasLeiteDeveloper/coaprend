<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\GeminiController;

Route::post('/generate-content', [GeminiController::class, 'generateContent']);

Route::get('/test', function () {
        return response()->json([
            'success' => true,
            'message' => 'API funcionando!',
            'timestamp' => now()
        ]);
    });