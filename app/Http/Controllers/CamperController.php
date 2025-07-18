<?php
namespace App\Http\Controllers;

use App\Models\Camper;
use App\Models\Room;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;
use App\Imports\CampersImport;
use App\Exports\CampersExport;
use App\Models\Camp;

class CamperController extends Controller
{
    public function index($campId)
    {
        $this->authorizeCampAccess($campId);

        return Camper::where('camp_id', $campId)->get();
    }

    public function store(Request $request)
    {
        $this->authorizeCampAccess($request->camp_id);

        $validated = $request->validate([
            'camp_id' => 'required|exists:camps,id',
            'identity_card' => 'nullable|string',
            'first_name' => 'required|string',
            'last_name' => 'required|string',
            'church' => 'required|string',
            'birth_date' => 'required|date',
            'email' => 'required|email',
            'zone' => 'required|string',
            'color' => 'required|string',
            'baptized' => 'boolean',
            'gender' => 'required|in:male,female,other',
            'serial' => 'required|string|unique:campers',
            'payment_method' => 'required|string',
            'reference' => 'nullable|string',
            'room_id' => 'nullable|exists:rooms,id',
            'usd_amount' => 'nullable|numeric|min:0',
            'comments' => 'nullable|string',
        ]);

        if ($request->room_id) {
            $room = Room::findOrFail($request->room_id);
            if ($room->max_capacity && $room->campers()->count() >= $room->max_capacity) {
                return response()->json(['message' => 'La habitación ya está llena.'], 422);
            }
        }


        $camper = Camper::create($validated);

        return response()->json($camper, 201);
    }

    public function update(Request $request, Camper $camper)
    {

        $validated = $request->validate([
            'identity_card' => 'nullable|string',
            'first_name' => 'required|string',
            'last_name' => 'required|string',
            'church' => 'required|string',
            'birth_date' => 'required|date',
            'email' => 'required|email',
            'zone' => 'required|string',
            'color' => 'required|string',
            'room_id' => 'nullable|exists:rooms,id',
            'baptized' => 'boolean',
            'gender' => 'required|in:male,female,other',
            'serial' => 'required|string|unique:campers,serial,' . $camper->id,
            'payment_method' => 'required|string',
            'reference' => 'nullable|string',
            'usd_amount' => 'nullable|numeric|min:0',
            'comments' => 'nullable|string',
        ]);
        
        if ($request->room_id) {
            $room = Room::findOrFail($request->room_id);
            if ($room->max_capacity && $room->campers()->count() >= $room->max_capacity) {
                return response()->json(['message' => 'La habitación ya está llena.'], 422);
            }
        }

        $this->authorizeCampAccess($camper->camp_id);

        $camper->update($validated);

        return response()->json($camper);
    }

    public function destroy(Camper $camper)
    {
        $this->authorizeCampAccess($camper->camp_id);
        $camper->delete();
        return response()->noContent();
    }
    public function import(Request $request, Camp $camp)
    {
        $request->validate([
            'file' => 'required|file|mimes:xlsx,xls'
        ]);

        $this->authorizeCampAccess($camp->id);

        Excel::import(new CampersImport($camp->id), $request->file('file'));

        return response()->json(['message' => 'Importación exitosa.']);
    }

    public function export(Camp $camp)
    {
        $this->authorizeCampAccess($camp->id);

        return Excel::download(new CampersExport($camp->id), 'acampantes.xlsx');
    }
    private function authorizeCampAccess($campId)
    {
        $user = auth()->user();
        if ($user->role !== 'superadmin' && !$user->camps->contains($campId)) {
            abort(403, 'Unauthorized');
        }
    }
}
