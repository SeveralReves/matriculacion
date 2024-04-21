<?php

namespace App\Exports;

use App\Attendees;
use DB;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

class AttendeesExport implements FromCollection,WithHeadings
{
    /**
    * @return \Illuminate\Support\Collection
    */
    public function headings(): array
    {
        return [
        ];
    }
    public function collection()
    {
         $users = DB::table('Attendees')->get();
         return $users;

    }
}