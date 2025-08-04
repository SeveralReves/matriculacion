<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RegisteredRecord extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'camper_id',
        'has_registered',
    ];

    public function camper()
    {
        return $this->belongsTo(Camper::class);
    }

}