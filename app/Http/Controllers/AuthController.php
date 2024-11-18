<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
class AuthController extends Controller
{
    public function login(Request $request)
    {
        // Validación de los datos recibidos
        $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);
    
        // Buscar al usuario por email
        $user = User::where('email', $request->email)->first();
    
        // Si el usuario no existe, devolver un mensaje de error
        if (!$user) {
            return response()->json([
                'message' => 'Usuario no encontrado'
            ], 404);
        }
    
        // Verificar la contraseña
        if (!Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Contraseña incorrecta'
            ], 401);
        }
    
        // Generar un token simulado en remember_token (en proyectos reales se usaría JWT o una librería adecuada)
        $token = bin2hex(random_bytes(16));
        $user->remember_token = $token;
        $user->save();
    
        // Devolver el mensaje de éxito junto con el token
        return response()->json([
            'message' => 'Inicio de sesión exitoso',
            'token' => $user->remember_token
        ]);
    }
    
}