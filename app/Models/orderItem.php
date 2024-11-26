<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class orderItem extends Model
{
    protected $fillable = [
        'transaction_id', // Asegúrate de que este campo está incluido
        'product_name',
        'quantity',
        'price',
    ];
    protected $casts = [
        'transaction_id' => 'integer',
        'product_name' => 'string',
        'quantity' => 'integer',
        'price' => 'float',
    ];
    public function order()
    {
        return $this->belongsTo(transaction::class);
    }
}
