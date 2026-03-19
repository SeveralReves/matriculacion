<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Camp extends Model
{
    use HasFactory;
    
    protected $fillable = ['name', 'start_date', 'end_date', 'image_path'];

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
    public function zones()
    {
        return $this->hasMany(Zone::class);
    }
    public function rooms()
    {
        return $this->hasMany(Room::class);
    }
    public function registeredRecord()
    {
        return $this->hasOne(RegisteredRecord::class);
    }
    public function registeredRecords()
    {
        return $this->hasManyThrough(
            RegisteredRecord::class,
            Camper::class,
            'camp_id',         // foreign key on Camper
            'camper_id',       // foreign key on RegisteredRecord
            'id',              // local key on Camp
            'id'               // local key on Camper
        );
    }



}
