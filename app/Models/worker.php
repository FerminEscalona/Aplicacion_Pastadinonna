<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;
class worker extends Model
{
    use HasApiTokens;
    protected $fillable = ['id','name', 'email', 'password', 'position', 'phone_number', 'hiring_date'];
    protected $casts = [
        'id' => 'integer',
        'name' => 'string',
        'email' => 'string',
        'password' => 'string',
        'position' => 'string',
        'phone_number' => 'string',
        'hiring_date' => 'date',
    ];
    protected $hidden = [
        'created_at',
        'updated_at',
    ];
}
