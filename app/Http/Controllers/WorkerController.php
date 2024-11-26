<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Worker;

class WorkerController extends Controller
{
    public function store(Request $request)
    {
        // Validación de datos
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'password' => 'required|string|min:4',
            'position' => 'required|string|max:255',
            'cedula' => 'required|integer',
        ]);

        // Crear un nuevo trabajador
        $worker = Worker::create([
            'name' => $validatedData['name'],
            'password' => bcrypt($validatedData['password']),
            'position' => $validatedData['position'],
            'cedula' => $validatedData['cedula'],
        ]);

        return response()->json([
            'message' => 'Worker created successfully',
            'worker' => $worker,
        ], 201);
    }
}
