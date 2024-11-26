<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class customer extends Model
{
    use hasFactory;
    protected $fillable = ['id','nombre', 'telefono', 'direccion'];
    protected $casts = [
        'name' => 'string',
        'phone' => 'string',
        'direction' => 'string',
        'identification_number' => 'string',
    ];
    protected $hidden = [
        'created_at',
        'updated_at',
    ];
    public function transaction()
    {
        return $this->hasMany(transaction::class);
    }
}
