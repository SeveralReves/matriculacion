<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Attendee;
use Illuminate\Http\Request;

class AttendeeController extends Controller
{
    public function index(Request $request)
    {
        try {
            if($request->serial){
                $attendees = Attendee::where('serial', $request->serial)->first();
                if(!$attendees){
                    return response()->json([
                        'status' => false,
                        'message' => 'Acampante no encontrado'
                    ], 401);
                }
            }else{
                $attendees = Attendee::all();
            }
            return response()->json([
                'status' => true,
                'data' => $attendees
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Error al obtener acampantes: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $request->validate([
                'name' => 'required|string',
                'lastname' => 'required|string',
                'birthdate' => 'required|string',
                'church' => 'required|string',
                'baptized' => 'required|boolean',
                'conference' => ['nullable', 'string', 'regex:/^[L,U,V]$/'],
                'zone' => ['required', 'string', 'regex:/^[1-5]$/'],
                'gender' => ['required', 'string', 'regex:/^[F,M]$/'],
                'document_id' => 'nullable|string|unique:attendees,document_id',
                'color' => 'required|string',
                'payment' => 'nullable|string',
                'reference' => 'nullable|string',
                'serial' => 'nullable|string|unique:attendees,serial',
                'workshop' => 'nullable|string',
                'email' => 'nullable|email|unique:attendees,email',
            ]);

            $attendee = Attendee::create($request->all());
            return response()->json([
                'status' => true,
                'message' => 'Acampante Registrado',
                'data' => $attendee,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Error al registrar acampante: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function show($id)
    {
        try {
            $attendee = Attendee::find($id);
            if (!$attendee) {
                return response()->json([
                    'status' => false,
                    'message' => 'No se encontró el acampante',
                ], 404);
            }
            return response()->json([
                'status' => true,
                'data' => $attendee,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Error al obtener el acampante: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $attendee = Attendee::find($id);
            if (!$attendee) {
                return response()->json([
                    'status' => false,
                    'message' => 'No se encontró el acampante',
                ], 404);
            }

            $request->validate([
                'name' => 'required|string',
                'lastname' => 'required|string',
                'birthdate' => 'required|string',
                'zone' => ['required', 'string', 'regex:/^[1-5]$/'],
                'color' => 'required|string',
                'baptized' => 'required|boolean',
                'conference' => ['nullable', 'string', 'regex:/^[L,U,V]$/'],
                'gender' => ['required', 'string', 'regex:/^[F,M]$/'],
                'document_id' => 'required|string|unique:attendees,document_id,' . $attendee->id,
                'church' => 'required|string',
                'serial' => 'required||unique:attendees,serial,' . $attendee->id,
                'workshop' => 'nullable|string',
                'email' => 'nullable|email|unique:attendees,email,' . $attendee->id,
            ]);

            $attendee->update($request->all());

            return response()->json([
                'status' => true,
                'message' => 'Registro actualizado',
                'data' => $attendee,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Error al actualizar el registro: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $attendee = Attendee::find($id);
            if (!$attendee) {
                return response()->json([
                    'status' => false,
                    'message' => 'No se encontró el acampante',
                ], 404);
            }

            $attendee->delete();

            return response()->json([
                'status' => true,
                'message' => 'Acampante eliminado con éxito'
            ], 204);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Error al eliminar el acampante: ' . $e->getMessage(),
            ], 500);
        }
    }
}
