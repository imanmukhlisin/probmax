<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;

class UserController extends Controller
{
    // List all users (Admin only)
    public function index()
    {
        return User::with('role')->orderBy('created_at', 'desc')->get();
    }

    // Update user role (Admin only)
    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);
        
        $request->validate([
            'role_id' => 'required|exists:roles,id'
        ]);

        $user->role_id = $request->role_id;
        $user->save();

        return response([
            'message' => 'User role updated successfully',
            'user' => $user->load('role')
        ]);
    }
}
