<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\WorkerController;
use App\Http\Controllers\OrderController;

//Rutas de sesiond de trabajadores.

Route::get('/orders/pending', [OrderController::class, 'getPendingOrders']);
Route::get('/orders/attended', [OrderController::class, 'getAttendedOrders']);
Route::get('/orders/customer/{identification_number}', [OrderController::class, 'searchByCustomerId']);
Route::post('orders', [OrderController::class, 'store']);

Route::options('/{any}', function () {
    return response()->json([], 200);
})->where('any', '.*');

Route::apiResource('product', ProductController::class);

// Ruta para registrar trabajadores
Route::post('/register', [AuthController::class, 'register']);

// Ruta para login
Route::post('/login', [AuthController::class, 'login']);

// Ruta para agregar trabajadores
Route::post('/workers', [WorkerController::class, 'store']);

// Ruta para eliminar trabajadores
Route::delete('/workers/{cedula}', [WorkerController::class, 'destroy']);

// obtiene todos los trabajadores
Route::get('/workers', [WorkerController::class, 'index']);


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


