<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreOrderRequest extends FormRequest
{
    /**
     * Determina si el usuario está autorizado para hacer esta solicitud.
     */
    public function authorize()
    {
        return true; // Cambia esto según tu lógica de autorización
    }

    /**
     * Reglas de validación para la solicitud.
     */
    public function rules()
    {
        return [
            'name' => 'required|string',
            'phone' => 'required|string',
            'address' => 'required|string',
            'identification_number' => 'required|string',
            'products_json' => 'required|json',
        ];
    }

    /**
     * Mensajes de error personalizados.
     */
    public function messages()
    {
        return [
            'name.required' => 'El nombre es obligatorio.',
            'phone.required' => 'El teléfono es obligatorio.',
            'address.required' => 'La dirección es obligatoria.',
            'identification_number.required' => 'La cédula es obligatoria.',
            'products_json.required' => 'Los productos son obligatorios.',
            'products_json.json' => 'El campo productos debe ser un JSON válido.',
        ];
    }
}

