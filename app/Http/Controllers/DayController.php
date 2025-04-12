<?php
namespace App\Http\Controllers;

use App\Models\Day;
use Illuminate\Http\Request;

class DayController extends Controller
{
    public function index($campId)
    {
        $this->authorizeCampAccess($campId);
        return Day::where('camp_id', $campId)->get();
    }

    public function store(Request $request)
    {
        $this->authorizeCampAccess($request->camp_id);

        $validated = $request->validate([
            'camp_id' => 'required|exists:camps,id',
            'date' => 'required|date',
            'meal_type' => 'required|string', // e.g. breakfast, lunch
        ]);

        $day = Day::create($validated);
        return response()->json($day, 201);
    }

    public function destroy(Day $day)
    {
        $this->authorizeCampAccess($day->camp_id);
        $day->delete();
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
