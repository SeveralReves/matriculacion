<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Camper extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'camp_id',
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
        'usd_amount',
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
    public function zone()
    {
        return $this->belongsTo(Zone::class);
    }

}
