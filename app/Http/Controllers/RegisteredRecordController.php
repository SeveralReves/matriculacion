<?php
namespace App\Http\Controllers;

use App\Models\RegisteredRecord;
use App\Models\Camper;
use Illuminate\Http\Request;

class RegisteredRecordController extends Controller
{
    public function index(Request $request)
    {
        $request->validate([
            'camp_id' => 'required|exists:camps,id',
        ]);

        $this->authorizeCampAccess($request->camp_id);

        // Obtener todos los campistas del campamento
        $campers = Camper::where('camp_id', $request->camp_id)->get();

        // Obtener los registros de matriculados existentes para ese día
        $registeredRecords = RegisteredRecord::get()->keyBy('camper_id');

        // Combinar los datos
        $data = $campers->map(function ($camper) use ($registeredRecords) {
            return [
                'camper_id' => $camper->id,
                'camper' => $camper,
                'updated_at' =>  $registeredRecords->has($camper->id) ? $registeredRecords[$camper->id]->updated_at : '---',
                'ate' => $registeredRecords->has($camper->id) && $registeredRecords[$camper->id]->has_registered,
            ];
        });

        return response()->json($data);
    }


    public function toggle(Request $request)
    {
        $validated = $request->validate([
            'camper_id' => 'required|exists:campers,id',
        ]);

        $camper = Camper::findOrFail($validated['camper_id']);
        $this->authorizeCampAccess($camper->camp_id);

        $record = RegisteredRecord::firstOrCreate([
            'camper_id' => $validated['camper_id'],
        ]);

        $record->has_registered = !$record->has_registered;
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
