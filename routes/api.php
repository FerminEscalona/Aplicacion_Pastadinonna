<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ProductController;

Route::options('/{any}', function () {
    return response()->json([], 200);
})->where('any', '.*');

Route::apiResource('product', ProductController::class);

// Ruta para registrar trabajadores
Route::post('/register', [AuthController::class, 'register']);

// Ruta para login
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('role:manager')->group(function () {
    Route::get('/manager/dashboard', function () {
        return view('manager.dashboard');
    });
});
Route::middleware('role:worker')->group(function () {
    Route::get('/worker/dashboard', function () {
        return view('worker.dashboard');
    });
});
