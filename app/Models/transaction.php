<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class transaction extends Model
{
    use HasFactory;
    protected $fillable = [
        'id',
        'amount',
        'total',
        'customer_id',
        'product_id',
    ];

    protected $casts = [
        'id' => 'integer',
        'amount' => 'float',
        'total' => 'float',
        'customer_id' => 'integer',
        'product_id' => 'integer',
    ];

    public function client()
    {
        return $this->belongsTo(client::class);
    }
    public function detail()
    {
        return $this->hasMany(detail::class);
    }
}
