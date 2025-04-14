<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Guest;

class GuestController extends Controller
{
    public function index(Request $request)
    {
        $request->validate([
            'camp_id' => 'required|exists:camps,id',
            'day_id' => 'required|exists:days,id',
        ]);

        $this->authorizeCampAccess($request->camp_id);

        return Guest::with('mealRecord')
            ->where('camp_id', $request->camp_id)
            ->where('day_id', $request->day_id)
            ->get()
            ->map(function ($guest) {
                return [
                    ...$guest->toArray(),
                    'has_eaten' => optional($guest->mealRecord)->has_eaten ?? false,
                ];
            });
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'camp_id' => 'required|exists:camps,id',
            'day_id' => 'required|exists:days,id',
            'first_name' => 'required|string',
            'last_name' => 'required|string',
            'church' => 'nullable|string',
            'gender' => 'required|in:male,female,other',
            'payment_method' => 'required|string',
            'usd_amount' => 'nullable|numeric|min:0',
            'reference' => 'nullable|string',
        ]);

        $this->authorizeCampAccess($validated['camp_id']);

        $guest = Guest::create($validated);

        return response()->json([
            ...$guest->toArray(),
            'has_eaten' => false,
        ], 201);
    }
    private function authorizeCampAccess($campId)
    {
        $user = auth()->user();
        if ($user->role !== 'superadmin' && !$user->camps->contains($campId)) {
            abort(403, 'Unauthorized');
        }
    }
}
