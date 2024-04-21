<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Attendee;
use App\Models\Meal;
use Carbon\Carbon;

class MealController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        try {
            if ($request->attendee) {
                $meals = Meal::where('attendees_id', $request->attendee)->get();
            } else {
                $meals = Meal::all();
            }
            return response()->json([
                'status' => true,
                'data' => $meals
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Error al obtener acampantes: ' . $e->getMessage(),
            ], 500);
        }
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function store(Request $request)
    {
        try {
            $request->validate([
                'attendees_id' => 'required',
                'day' => 'required|string',
                'date' => 'required|string',
                'type' => 'required|string',
                'eaten' => 'required|boolean',
            ]);
            // Transformar la fecha a formato deseado utilizando Carbon
            $date = Carbon::createFromFormat('Y-m-d', $request->date)->format('Y-m-d');

            // Crear el registro de comida con la fecha transformada
            $meal = Meal::create([
                'attendees_id' => $request->attendees_id,
                'day' => $request->day,
                'date' => $date,
                'type' => $request->type,
                'eaten' => $request->eaten,
            ]);
            return response()->json([
                'status' => true,
                'message' => 'Comida Registrada',
                'data' => $meal,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Error al registrar acampante: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
