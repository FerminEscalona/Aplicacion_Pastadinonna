<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use App\Models\worker;
use App\Models\manager;
use Validator;
use \stdClass;
class AuthController extends Controller
{
    public function register(Request $request)
    {
        // Validar los datos ingresados
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:workers', // Verifica que sea único en la tabla de trabajadores
            'password' => 'required|string|min:4',
            'position' => 'required|string|max:255', // Obligatorio para trabajadores
            'phone_number' => 'required|string|max:255',
            'hiring_date' => 'required|date',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400)
                ->header('Access-Control-Allow-Origin', '*'); // Cabecera CORS

        }

        // Crear un nuevo trabajador
        $worker = Worker::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password), // Hashea la contraseña
            'position' => $request->position,
            'phone_number' => $request->phone_number,
            'hiring_date' => $request->hiring_date,
        ]);

        // Generar un token de acceso
        $token = $worker->createToken('auth_token')->plainTextToken;

        // Responder con los datos del trabajador y el token
        return response()->json([
            'data' => $worker,
            'access_token' => $token,
            'token_type' => 'Bearer',
        ]);
    }
    public function login(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'password' => 'required|string|min:4',
            'position' => 'required|string'
        ]);

        $position = $request->position;

        if ($position === 'worker') {
            $user = worker::where('name', $request->name)->first();
        } elseif ($position === 'manager') {
            $user = manager::where('name', $request->name)->first();
        } else {
            return response()->json(['message' => 'Role inválido'], 400)
                ->header('Access-Control-Allow-Origin', '*');
        }

        /* if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Credenciales incorrectas'], 401);
        } */
        if (!$user || $user->password !== $request->password) {
            return response()->json(['message' => 'Credenciales incorrectas'], 401)
                ->header('Access-Control-Allow-Origin', '*');
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => "Bienvenido, {$user->name}",
            'access_token' => $token,
            'token_type' => 'Bearer',
            'position' => $position,
        ])
            ->header('Access-Control-Allow-Origin', '*');
    }
}