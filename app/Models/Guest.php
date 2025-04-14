<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Guest extends Model
{
    use HasFactory;

    protected $fillable = [
        'camp_id',
        'day_id',
        'first_name',
        'last_name',
        'church',
        'gender',
        'payment_method',
        'usd_amount',
        'reference',
    ];

    public function camp() { return $this->belongsTo(Camp::class); }
    public function day() { return $this->belongsTo(Day::class); }
    public function mealRecord() { return $this->hasOne(GuestMealRecord::class); }
}
