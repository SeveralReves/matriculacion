<?php

namespace App\Http\Controllers;
use App\Models\Camp;
use Illuminate\Http\Request;

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
        ]);

        $camp = Camp::create($request->only('name', 'start_date', 'end_date'));

        return response()->json($camp, 201);
    }

    public function index()
    {
        return auth()->user()->role === 'superadmin'
            ? Camp::all()
            : auth()->user()->camps;
    }
}
