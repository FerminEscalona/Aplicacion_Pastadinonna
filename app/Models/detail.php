<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class detail extends Model
{
    protected $fillable = ['transaccion_id', 'producto_id', 'cantidad'];
    protected $casts = [
        'transaccion_id' => 'integer',
        'producto_id' => 'integer',
        'cantidad' => 'integer',
    ] ;
    public function transaction(){
        return $this->belongsTo(transaction::class);
    }
    public function product()
    {
        return $this->belongsTo(product::class);
    }
}
