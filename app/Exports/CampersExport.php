<?php
namespace App\Exports;

use App\Models\Camper;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

class CampersExport implements FromCollection, WithHeadings
{
    protected $campId;

    public function __construct($campId)
    {
        $this->campId = $campId;
    }

    public function collection()
    {
        return Camper::where('camp_id', $this->campId)
            ->select('first_name', 'last_name', 'gender', 'birth_date', 'church')
            ->get();
    }

    public function headings(): array
    {
        return ['first_name', 'last_name', 'gender', 'age', 'church'];
    }
}
