<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Attendee;
use App\Models\Meal;
use App\Exports\AttendeesExport;
use Maatwebsite\Excel\Facades\Excel;

class PageController extends Controller
{
    public function home()
    {
        $total = Attendee::count();
        // Conteo de registros con zone 
        $countZone1 = Attendee::where('zone', 1)->count();
        $countZone2 = Attendee::where('zone', 2)->count();
        $countZone3 = Attendee::where('zone', 3)->count();
        $countZone4 = Attendee::where('zone', 4)->count();
        $countZone5 = Attendee::where('zone', 5)->count();
        $countMision = Attendee::where('workshop','Mision')->count();
        $countElec = Attendee::where('workshop','Taller de electronica nivel basico')->count();
        $countHomi = Attendee::where('workshop','多Como preparar sermones y clases biblicas?')->count();
        $countAla = Attendee::where('workshop','Principios generales de la Direccion de alabanza')->count();
        $countPrim = Attendee::where('workshop','Primeros auxilios basicos')->count();
        $countMus = Attendee::where('workshop','Excelencia o nada!')->count();
        $countFi = Attendee::where('workshop','Finanzas Personales')->count();
        $countCar = Attendee::where('workshop','Caracter cristiano y Vida devocional')->count();
        $female = Attendee::where('gender', 'F')->count();
        $male = Attendee::where('gender', 'M')->count();
        $purple = Attendee::where('color', 'Purple')->count();
        $orange = Attendee::where('color', 'Orange')->count();
        $green = Attendee::where('color', 'Green')->count();
        $children = Attendee::where('birthdate', '>=', '2012-01-01')->count();

        return view('welcome', compact('total', 'countZone1', 'countZone2', 'countZone3', 'countZone4', 'countZone5', 'female', 'male', 'purple', 'orange', 'green', 'countElec', 'countHomi', 'countAla', 'countPrim', 'countMus', 'countFi', 'countCar', 'countMision', 'children'));
    }

    public function register()
    {
        $total = Attendee::count();
        // Conteo de registros con zone 
        $countZone1 = Attendee::where('zone', 1)->count();
        $countZone2 = Attendee::where('zone', 2)->count();
        $countZone3 = Attendee::where('zone', 3)->count();
        $countZone4 = Attendee::where('zone', 4)->count();
        $countZone5 = Attendee::where('zone', 5)->count();
        $female = Attendee::where('gender', 'F')->count();
        $male = Attendee::where('gender', 'M')->count();
        $purple = Attendee::where('color', 'Purple')->count();
        $orange = Attendee::where('color', 'Orange')->count();
        $green = Attendee::where('color', 'Green')->count();
        return view('register', compact('total', 'countZone1', 'countZone2', 'countZone3', 'countZone4', 'countZone5', 'female', 'male', 'purple', 'orange', 'green'));
    }
    public function dinner()
    {
        $total = Attendee::count();
        // Conteo de registros con zone 
        $countZone1 = Attendee::where('zone', 1)->count();
        $countZone2 = Attendee::where('zone', 2)->count();
        $countZone3 = Attendee::where('zone', 3)->count();
        $countZone4 = Attendee::where('zone', 4)->count();
        $countZone5 = Attendee::where('zone', 5)->count();
        $countMision = Attendee::where('workshop','Mision')->count();
        $countElec = Attendee::where('workshop','Taller de electronica nivel basico')->count();
        $countHomi = Attendee::where('workshop','多Como preparar sermones y clases biblicas?')->count();
        $countAla = Attendee::where('workshop','Principios generales de la Direccion de alabanza')->count();
        $countPrim = Attendee::where('workshop','Primeros auxilios basicos')->count();
        $countMus = Attendee::where('workshop','Excelencia o nada!')->count();
        $countFi = Attendee::where('workshop','Finanzas Personales')->count();
        $countCar = Attendee::where('workshop','Caracter cristiano y Vida devocional')->count();
        $countZone5 = Attendee::where('zone', 5)->count();
        $countZone5 = Attendee::where('zone', 5)->count();
        $countZone5 = Attendee::where('zone', 5)->count();
        $countZone5 = Attendee::where('zone', 5)->count();
        $countZone5 = Attendee::where('zone', 5)->count();
        $countZone5 = Attendee::where('zone', 5)->count();
        $female = Attendee::where('gender', 'F')->count();
        $male = Attendee::where('gender', 'M')->count();
        $purple = Attendee::where('color', 'Purple')->count();
        $orange = Attendee::where('color', 'Orange')->count();
        $green = Attendee::where('color', 'Green')->count();
        return view('dinner', compact('total', 'countZone1', 'countZone2', 'countZone3', 'countZone4', 'countZone5', 'female', 'male', 'purple', 'orange', 'green', 'countElec', 'countHomi', 'countAla', 'countPrim', 'countMus', 'countFi', 'countCar', 'countMision'));
    }
    public function dinnerCount ()
    {
        $total = Attendee::count();
        // Conteo de registros con zone 
        $countJuevesAM = Meal::where('day', 'Jueves')->where('type','desayuno')->select('attendee_id')->distinct()->count();
        $countJuevesM = Meal::where('day', 'Jueves')->where('type','almuerzo')->select('attendee_id')->distinct()->count();
        $countJuevesPM = Meal::where('day', 'Jueves')->where('type','cena')->select('attendee_id')->distinct()->count();

        $countViernesAM = Meal::where('day', 'Viernes')->where('type','desayuno')->select('attendee_id')->distinct()->count();
        $countViernesM = Meal::where('day', 'Viernes')->where('type','almuerzo')->select('attendee_id')->distinct()->count();
        $countViernesPM = Meal::where('day', 'Viernes')->where('type','cena')->select('attendee_id')->distinct()->count();

        $countSabadoAM = Meal::where('day', 'Sabado')->where('type','desayuno')->select('attendee_id')->distinct()->count();
        $countSabadoM = Meal::where('day', 'Sabado')->where('type','almuerzo')->select('attendee_id')->distinct()->count();
        $countSabadoPM = Meal::where('day', 'Sabado')->where('type','cena')->select('attendee_id')->distinct()->count();
        return view('dinnerCount', compact('total', 'countJuevesAM','countJuevesM','countJuevesPM', 'countViernesAM','countViernesM','countViernesPM', 'countSabadoAM','countSabadoM','countSabadoPM'));
    }
    public function listado()
    {
        $attendees = Attendee::get();
        return view('listado', compact('attendees'));
    }
    public function export(){
        return Excel::download(new AttendeesExport, 'Lista de matriculados.xlsx');
    }
}
