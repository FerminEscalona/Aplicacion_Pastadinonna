<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class worker extends Model
{
    protected $fillable = ['id','name', 'email', 'position', 'phone_number', 'hiring_date'];
    protected $casts = [
        'id' => 'integer',
        'name' => 'string',
        'email' => 'string',
        'position' => 'string',
        'phone_number' => 'string',
        'hiring_date' => 'date',
    ];
    protected $hidden = [
        'created_at',
        'updated_at',
    ];
}
