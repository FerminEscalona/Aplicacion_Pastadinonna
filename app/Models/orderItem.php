<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class orderItem extends Model
{
    protected $fillable = ['order_id', 'product_name', 'quantity', 'price'];
    protected $casts = [
        'order_id' => 'integer',
        'product_name' => 'string',
        'quantity' => 'integer',
        'price' => 'float',
    ];
    public function order()
    {
        return $this->belongsTo(transaction::class);
    }
}
