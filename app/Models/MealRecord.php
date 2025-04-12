<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MealRecord extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'camper_id',
        'day_id',
        'has_eaten',
    ];

    public function camper()
    {
        return $this->belongsTo(Camper::class);
    }

    public function day()
    {
        return $this->belongsTo(Day::class);
    }
}
