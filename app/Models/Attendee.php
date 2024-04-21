<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Attendee extends Model
{
    use HasFactory;
    protected $fillable = [
        'name',
        'lastname',
        'document_id',
        'birthdate',
        'church',
        'color',
        'serial',
        'zone',
        'baptized',
        'payment',
        'reference',
        'conference',
        'gender',
        'workshop',
        'email',
    ];
}
