<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function index()
    {
        if (auth()->user()->role !== 'superadmin') {
            abort(403, 'Unauthorized');
        }

        $users = User::with('camps:id,name')->get(); // incluye nombres de campamentos
        return response()->json($users);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'email' => 'required|email|unique:users',
            'password' => 'required|string|min:6',
            'role' => 'required|in:admin,superadmin',
            'camp_ids' => 'array',
        ]);

        if (auth()->user()->role !== 'superadmin') {
            abort(403, 'Unauthorized');
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
        ]);

        if ($request->has('camp_ids')) {
            $user->camps()->sync($request->camp_ids);
        }

        return response()->json($user->load('camps:id,name'), 201);
    }

    public function update(Request $request, User $user)
    {
        if (auth()->user()->role !== 'superadmin') {
            abort(403, 'Unauthorized');
        }

        $request->validate([
            'name' => 'required|string',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'password' => 'nullable|string|min:6',
            'role' => 'required|in:admin,superadmin',
            'camp_ids' => 'array',
        ]);

        $user->update([
            'name' => $request->name,
            'email' => $request->email,
            'role' => $request->role,
            'password' => $request->password ? Hash::make($request->password) : $user->password,
        ]);

        if ($request->has('camp_ids')) {
            $user->camps()->sync($request->camp_ids);
        }

        return response()->json($user->load('camps:id,name'));
    }

    public function destroy(User $user)
    {
        if (auth()->user()->role !== 'superadmin') {
            abort(403, 'Unauthorized');
        }

        $user->delete();
        return response()->noContent();
    }
}
