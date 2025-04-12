<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Camper extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'identity_card',
        'first_name',
        'last_name',
        'church',
        'birth_date',
        'email',
        'zone',
        'color',
        'baptized',
        'gender',
        'serial',
        'payment_method',
        'reference',
        'comments',
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
