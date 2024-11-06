<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class product extends Model
{
    use HasFactory;
    protected $fillable = [
        'id',
        'price',
        'description',
        'image',
        'category',
    ];
    protected $casts = [
        'id' => 'integer',
        'price'=> 'float',
        'description'=> 'string',
        'image'=> 'string',
        'category'=> 'string',
    ];
    public function transaction()
    {
        return $this->hasMany(transaction::class);
    }
    
    
}
