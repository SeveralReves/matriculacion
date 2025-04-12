<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function index()
    {
        $users = User::all();
        return view('users.index', compact('users'));
    }

    public function create()
    {
        return view('users.create');
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
    
        return response()->json($user, 201);
    }
    
}
