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

    // Método para eliminar un trabajador por cedula
    public function destroy($cedula)
    {
        // Buscar el trabajador por cedula
        $worker = Worker::where('cedula', $cedula)->first();

        // Verificar si el trabajador existe
        if (!$worker) {
            return response()->json(['message' => 'Trabajador no encontrado'], 404);
        }

        // Eliminar el trabajador de la base de datos
        $worker->delete();

        // Devolver respuesta de éxito
        return response()->json(['message' => 'Trabajador eliminado con éxito'], 200);
    }
}
