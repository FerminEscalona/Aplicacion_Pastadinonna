<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class manager extends Model
{
    protected $fillable = ['id','name', 'email', 'phone_number', 'hiring_date'];
    protected $casts = [
        'id' => 'integer',
        'name' => 'string',
        'email' => 'string',
        'phone_number' => 'string',
        'hiring_date' => 'date',
    ];
    protected $hidden = [
        'created_at',
        'updated_at',
    ];
}
