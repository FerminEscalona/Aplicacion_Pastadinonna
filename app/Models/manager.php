<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;

class manager extends Model
{
    use HasApiTokens;
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
