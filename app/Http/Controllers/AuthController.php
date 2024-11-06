<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class AuthController extends Controller
{
    public function login(Request $request){
        echo json_encode($_SERVER['HTTP_AUTHORIZATION'], JSON_PRETTY_PRINT);
        /* return response()->json(['message' => 'Inicio de sesión exitoso']); */
        /* die(); */
    }
}
