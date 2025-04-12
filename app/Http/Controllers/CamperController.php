<?php
namespace App\Http\Controllers;

use App\Models\Camper;
use Illuminate\Http\Request;

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
            'comments' => 'nullable|string',
        ]);

        $camper = Camper::create($validated);

        return response()->json($camper, 201);
    }

    public function update(Request $request, Camper $camper)
    {
        $this->authorizeCampAccess($camper->camp_id);

        $validated = $request->validate([
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
            'serial' => 'required|string|unique:campers,serial,' . $camper->id,
            'payment_method' => 'required|string',
            'reference' => 'nullable|string',
            'comments' => 'nullable|string',
        ]);

        $camper->update($validated);

        return response()->json($camper);
    }

    public function destroy(Camper $camper)
    {
        $this->authorizeCampAccess($camper->camp_id);
        $camper->delete();
        return response()->noContent();
    }

    private function authorizeCampAccess($campId)
    {
        $user = auth()->user();
        if ($user->role !== 'superadmin' && !$user->camps->contains($campId)) {
            abort(403, 'Unauthorized');
        }
    }
}
