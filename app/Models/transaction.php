<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class transaction extends Model
{
    use HasFactory;
    protected $fillable = [
        'customer_id',
        'status',
    ];

    protected $casts = [
        'customer_id' => 'String',
        'status' => 'float',
    ];

    public function customer()
    {
        return $this->belongsTo(customer::class);
    }
    public function orderItems()
    {
        return $this->hasMany(orderItem::class);
    }
}
