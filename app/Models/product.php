<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;


class product extends Model
{
    use HasFactory;
    protected $fillable = ['name','description','price','image','category'];
    protected $casts = [
        'name' => 'string',
        'description'=> 'string',
        'price'=> 'float',
        'image'=> 'string',
        'category'=> 'string',
    ];
    public function detail()
    {
        return $this->hasMany(orderItem::class);
    }
    
    
}
