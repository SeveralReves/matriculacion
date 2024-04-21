<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Meal extends Model
{
    use HasFactory;
    protected $fillable = [
        'attendees_id',
        'day',
        'date',
        'type',
        'eaten',
    ];

    public function asistente()
    {
        return $this->belongsTo(Attendee::class);
    }
}
