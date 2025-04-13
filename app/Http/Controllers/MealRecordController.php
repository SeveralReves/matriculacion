<?php
namespace App\Http\Controllers;

use App\Models\MealRecord;
use Illuminate\Http\Request;

class MealRecordController extends Controller
{
    public function index(Request $request)
    {
        $request->validate([
            'camp_id' => 'required|exists:camps,id',
            'day_id' => 'required|exists:days,id',
        ]);

        $this->authorizeCampAccess($request->camp_id);

        // Obtener todos los campistas del campamento
        $campers = \App\Models\Camper::where('camp_id', $request->camp_id)->get();

        // Obtener los registros de comida existentes para ese día
        $mealRecords = MealRecord::where('day_id', $request->day_id)->get()->keyBy('camper_id');

        // Combinar los datos
        $data = $campers->map(function ($camper) use ($mealRecords) {
            return [
                'camper_id' => $camper->id,
                'camper' => $camper,
                'ate' => $mealRecords->has($camper->id) && $mealRecords[$camper->id]->has_eaten,
            ];
        });

        return response()->json($data);
    }


    public function toggle(Request $request)
    {
        $validated = $request->validate([
            'camper_id' => 'required|exists:campers,id',
            'day_id' => 'required|exists:days,id',
        ]);

        $camper = \App\Models\Camper::findOrFail($validated['camper_id']);
        $this->authorizeCampAccess($camper->camp_id);

        $record = MealRecord::firstOrCreate([
            'camper_id' => $validated['camper_id'],
            'day_id' => $validated['day_id'],
        ]);

        $record->has_eaten = !$record->has_eaten;
        $record->save();

        return response()->json($record);
    }

    private function authorizeCampAccess($campId)
    {
        $user = auth()->user();
        if ($user->role !== 'superadmin' && !$user->camps->contains($campId)) {
            abort(403, 'Unauthorized');
        }
    }
}
