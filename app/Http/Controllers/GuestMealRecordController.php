<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Guest;
use App\Models\GuestMealRecord;
class GuestMealRecordController extends Controller
{
    public function toggle(Request $request)
    {
        $validated = $request->validate([
            'guest_id' => 'required|exists:guests,id',
            'day_id' => 'required|exists:days,id',
        ]);

        $guest = Guest::findOrFail($validated['guest_id']);
        $this->authorizeCampAccess($guest->camp_id);

        $record = GuestMealRecord::firstOrCreate(['guest_id' => $guest->id]);
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
