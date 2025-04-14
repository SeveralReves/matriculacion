<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GuestMealRecord extends Model
{
    use HasFactory;

    protected $fillable = ['guest_id', 'has_eaten'];

    public function guest() { return $this->belongsTo(Guest::class); }
}

