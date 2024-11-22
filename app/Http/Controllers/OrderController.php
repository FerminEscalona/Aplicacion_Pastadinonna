<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\client;
use App\Models\transaction;
use App\Models\detail;
class OrderController extends Controller
{
    public function store(Request $request)
    {
        // Valida los datos recibidos
        $request->validate([
            'name' => 'required|string|max:255',
            'phone_number' => 'required|string|max:255',
            'address' => 'required|string|max:255',
            'products' => 'required|array',
            'total' => 'required|numeric',
        ]);

        // Verifica si el cliente ya existe
        $client = client::firstOrCreate(
            ['phone_number' => $request->phone_number], // Buscar por teléfono
            [
                'name' => $request->name,
                'email' => $request->email ?? null, // Email opcional
                'address' => $request->address,
            ]
        );

        // Crea la transacción
        $transaction = transaction::create([
            'total' => $request->total,
        ]);

        // Agrega los productos al detalle
        foreach ($request->products as $product) {
            Detail::create([
                'transaction_id' => $transaction->id,
                'product_id' => $product['id'], // Asegúrate de que el producto tenga un ID
                'amount' => $product['quantity'], // Cantidad del producto
            ]);
        }

        return response()->json([
            'message' => 'Pedido creado con éxito',
            'transaction_id' => $transaction->id,
        ], 201)
        ->header('Access-Control-Allow-Origin', '*');
    }
}
