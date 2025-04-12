<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Camp extends Model
{
    use HasFactory;
    
    protected $fillable = ['name', 'start_date', 'end_date'];

    public function campers()
    {
        return $this->hasMany(Camper::class);
    }

    public function days()
    {
        return $this->hasMany(Day::class);
    }

    public function users()
    {
        return $this->belongsToMany(User::class);
    }
}
