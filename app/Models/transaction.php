<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class transaction extends Model
{
    use HasFactory;
    protected $fillable = [
        'id',
        'total',
    ];

    protected $casts = [
        'id' => 'integer',
        'total' => 'float',
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
