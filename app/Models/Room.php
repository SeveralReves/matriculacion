<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Room extends Model
{
    protected $fillable = ['camp_id', 'name', 'max_capacity', 'gender', 'description'];

    public function camp()
    {
        return $this->belongsTo(Camp::class);
    }
    public function campers()
    {
        return $this->hasMany(Camper::class);
    }

}
