<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Day extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'date',
        'meal_type',
        'camp_id',
    ];

    public function mealRecords()
    {
        return $this->hasMany(MealRecord::class);
    }

    public function camp()
    {
        return $this->belongsTo(Camp::class);
    }
}
