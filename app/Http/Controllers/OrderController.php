<?php

namespace App\Http\Controllers;

use App\Models\transaction;
use Illuminate\Http\Request;
use App\Models\customer;
use App\Models\orderItem;
use App\Http\Requests\StoreOrderRequest;

class OrderController extends Controller
{
    /**
     * Muestra los pedidos pendientes agrupados por orden.
     */
    public function getPendingOrders()
    {
        $orders = transaction::with('orderItems', 'customer')
            ->where('status', 'pending')
            ->get();

        // Si estás devolviendo una vista:
        // return view('orders.pending', compact('orders'));

        // Si estás devolviendo JSON (para una API):
        return response()->json($orders);
    }

    /**
     * Muestra los pedidos atendidos agrupados por orden.
     */
    public function getAttendedOrders()
    {
        $orders = transaction::with('orderItems', 'customer')
            ->where('status', 'attended')
            ->get();

        // Si estás devolviendo una vista:
        // return view('orders.attended', compact('orders'));

        // Si estás devolviendo JSON (para una API):
        return response()->json($orders);
    }

    /**
     * Busca pedidos por cédula del cliente.
     */
    public function searchByCustomerId($identification_number)
    {
        $customer = Customer::where('identification_number', $identification_number)->first();

        if (!$customer) {
            return response()->json(['error' => 'Cliente no encontrado.'], 404);
            // O si estás usando vistas:
            // return redirect()->back()->with('error', 'Cliente no encontrado.');
        }

        $orders = transaction::with('orderItems')
            ->where('customer_id', $customer->id)
            ->get();

        // Si estás devolviendo una vista:
        // return view('orders.byCustomer', compact('orders', 'customer'));

        // Si estás devolviendo JSON:
        return response()->json([
            'customer' => $customer,
            'orders' => $orders,
        ]);
    }

    /**
     * Guarda un nuevo pedido y sus items.
     */
    public function store(StoreOrderRequest $request)
{
    try {
        // Decodificar el JSON de productos
        $products = json_decode($request->input('products_json'), true);

        if (!$products) {
            return response()->json(['error' => 'El JSON de productos es inválido.'], 400);
        }

        // Crear o actualizar el cliente
        $customer = Customer::updateOrCreate(
            ['identification_number' => $request->input('identification_number')],
            [
                'name' => $request->input('name'),
                'phone' => $request->input('phone'),
                'address' => $request->input('address'),
            ]
        );

        // Crear el pedido
        $order = transaction::create([
            'customer_id' => $customer->id,
            'status' => 'pending', // O 'attended' si corresponde
        ]);

        // Agregar los items al pedido
        foreach ($products as $product) {
            OrderItem::create([
                'transaction_id' => $order->id,
                'product_name' => $product['name'],
                'quantity' => $product['quantity'],
                'price' => $product['price'],
            ]);
        }

        // Devolver una respuesta exitosa
        return response()->json([
            'message' => 'Pedido creado exitosamente.',
            'order' => $order->load('orderItems', 'customer'),
        ], 201);
    } catch (\Exception $e) {
        // Manejar cualquier excepción y devolver un error 500 con detalles
        return response()->json([
            'error' => 'Ocurrió un error al procesar la solicitud.',
            'details' => $e->getMessage(),
        ], 500);
    }
}
}
