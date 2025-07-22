<?php

namespace App\Imports;

use App\Models\Camper;
use Illuminate\Validation\Rule;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class CampersImport implements ToModel, WithHeadingRow
{
    protected $campId;

    public function __construct($campId)
    {
        $this->campId = $campId;
    }

    public function model(array $row)
    {
        return new Camper([
            'camp_id'     => $this->campId,
            'first_name'  => $row['first_name'],
            'last_name'   => $row['last_name'],
            'gender'      => $row['gender'],
            'age'         => $row['age'],
            'church'      => $row['church'] ?? null,
            'zone'     => null,
            'room_id'     => null,
        ]);
    }
}
