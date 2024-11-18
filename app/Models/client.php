<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class client extends Model
{
    protected $fillable = ['id','name', 'phone_number', 'email', 'address'];
    protected $casts = [
        'id' => 'integer',
        'name' => 'string',
        'phone' => 'string',
        'email' => 'string',
        'address'=> 'string',
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
