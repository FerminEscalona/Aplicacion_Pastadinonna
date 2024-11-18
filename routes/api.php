<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ProductController;

Route::apiResource('product', ProductController::class);

Route::get('/user', function (Request $request) {
    return $request->user();
});
Route::resource('/users', UserController::class)
->middleware('auth.middleware');

Route::post('/login', [AuthController::class, 'login']);
