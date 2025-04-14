<?php

namespace App\Http\Controllers;

use App\Models\{Camp, Camper, User, Day, MealRecord, Guest, GuestMealRecord};
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
class DashboardApiController extends Controller
{
    public function totals()
    {
        return [
            'camps' => Camp::count(),
            'users' => User::count(),
            'campers' => Camper::count(),
        ];
    }

    public function camp($id)
    {
        $camp = Camp::findOrFail($id);

        $this->authorizeCampAccess($camp->id);

        return [
            'id' => $camp->id,
            'name' => $camp->name,
            'image_path' => $camp->image_path,
            'total_campers' => $camp->campers()->count(),
            'total_usd' => $camp->campers()->sum('usd_amount') ?? 0,
        ];
    }

    public function campDay($campId, $dayId)
    {
        $this->authorizeCampAccess($campId);

        $day = Day::where('camp_id', $campId)->findOrFail($dayId);

        // Todos los campers del campamento
        $campers = \App\Models\Camper::where('camp_id', $campId)->get();

        // Todos los meal records para ese día
        $mealRecords = MealRecord::where('day_id', $dayId)->get()->keyBy('camper_id');

        $children = collect();
        $adults = collect();
        $childrenAte = 0;
        $adultsAte = 0;

        foreach ($campers as $camper) {
            $age = $camper->birth_date ? \Carbon\Carbon::parse($camper->birth_date)->age : null;
            $record = $mealRecords->get($camper->id);
            $ate = $record?->has_eaten ?? false;

            if ($age !== null && $age < 12) {
                $children->push($camper);
                if ($ate)
                    $childrenAte++;
            } elseif ($age !== null && $age >= 12) {
                $adults->push($camper);
                if ($ate)
                    $adultsAte++;
            }
        }

        $guests = Guest::where('camp_id', $campId)
            ->where('day_id', $dayId)
            ->with('mealRecord')
            ->get();

        return [
            'campers_children_total' => $children->count(),
            'campers_adults_total' => $adults->count(),
            'campers_ate_children' => $childrenAte,
            'campers_ate_adults' => $adultsAte,
            'campers_ate' => $childrenAte + $adultsAte,
            'guests_total' => $guests->count(),
            'guests_ate' => $guests->filter(fn($g) => $g->mealRecord && $g->mealRecord->has_eaten)->count(),
        ];
    }



    private function authorizeCampAccess($campId)
    {
        $user = auth()->user();
        if ($user->role !== 'superadmin' && !$user->camps->contains($campId)) {
            abort(403, 'Unauthorized');
        }
    }
}
