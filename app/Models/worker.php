<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;
class worker extends Model
{
    use HasApiTokens;
    protected $fillable = ['id','name','password', 'position', 'cedula'];
    protected $casts = [
        'id' => 'integer',
        'name' => 'string',
        'password' => 'string',
        'position' => 'string',
        'cedula' => 'integer',
    ];
    protected $hidden = [
        'created_at',
        'updated_at',
    ];
}
