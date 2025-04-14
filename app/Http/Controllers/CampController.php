<?php

namespace App\Http\Controllers;
use App\Models\Camp;
use Illuminate\Http\Request;
use App\Models\Day;
use App\Models\Meal;
use Carbon\Carbon;

class CampController extends Controller
{
    public function store(Request $request)
    {
        if (auth()->user()->role !== 'superadmin') {
            abort(403, 'Unauthorized');
        }

        $request->validate([
            'name' => 'required|string',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'image' => 'nullable|image|max:2048',
        ]);
        
        $data = $request->only('name', 'start_date', 'end_date');
        
        if ($request->hasFile('image')) {
            $data['image_path'] = $request->file('image')->store('camps', 'public');
        }
        
        $camp = Camp::create($data);
        $start = Carbon::parse($camp->start_date);
        $end = Carbon::parse($camp->end_date);
        
        
        $mealTypes = ['Desayuno', 'Almuerzo', 'Cena'];

        for ($date = $start; $date->lte($end); $date->addDay()) {
            foreach ($mealTypes as $meal) {
                Day::create([
                    'camp_id' => $camp->id,
                    'date' => $date->toDateString(),
                    'meal_type' => $meal,
                ]);
            }
        }
        return response()->json($camp, 201);
    }

    public function index()
    {
        return auth()->user()->role === 'superadmin'
            ? Camp::all()
            : auth()->user()->camps;
    }
    public function destroy(Camp $camp)
    {
        if (auth()->user()->role !== 'superadmin') {
            abort(403, 'Unauthorized');
        }

        $camp->delete();
        return response()->noContent();
    }
    public function show(Camp $camp)
    {
        return response()->json($camp);
    }
    public function update(Request $request, Camp $camp)
    {
        if (auth()->user()->role !== 'superadmin') {
            abort(403, 'Unauthorized');
        }

        $request->validate([
            'name' => 'required|string',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'image' => 'nullable|image|max:2048',
        ]);
         
        $data = $request->only('name', 'start_date', 'end_date');
        
        if ($request->hasFile('image')) {
            $data['image_path'] = $request->file('image')->store('camps', 'public');
        }
        
        $camp->update($data);

        return response()->json($camp);
    }
    public function getCampers(Camp $camp)
    {
        return response()->json($camp->campers);
    }
    public function getDays(Camp $camp)
    {
        return response()->json($camp->days);
    }
    public function getMealRecords(Camp $camp)
    {
        return response()->json($camp->mealRecords);
    }
    public function getMeals(Camp $camp)
    {
        return response()->json($camp->meals);
    }
    public function getMealRecordsByDay(Camp $camp, $dayId)
    {
        return response()->json($camp->mealRecords()->where('day_id', $dayId)->get());
    }
    public function getMealRecordsByCamper(Camp $camp, $camperId)
    {
        return response()->json($camp->mealRecords()->where('camper_id', $camperId)->get());
    }   

}
