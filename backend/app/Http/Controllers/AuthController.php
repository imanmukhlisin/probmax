<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function register(Request $request) {
        $fields = $request->validate([
            'username' => 'required|string|unique:users,username',
            'email' => 'required|string|unique:users,email',
            'password' => 'required|string|confirmed'
        ]);

        $user = User::create([
            'username' => $fields['username'],
            'email' => $fields['email'],
            'password' => bcrypt($fields['password']),
            'role_id' => 3 // User role by default
        ]);

        $token = $user->createToken('myapptoken')->plainTextToken;

        return response([
            'user' => $user,
            'token' => $token
        ], 201);
    }

    public function login(Request $request) {
        $fields = $request->validate([
            'username' => 'required|string',
            'password' => 'required|string'
        ]);

        // Check email or username
        $user = User::where('username', $fields['username'])->orWhere('email', $fields['username'])->first();

        if(!$user || !Hash::check($fields['password'], $user->password)) {
            return response([
                'message' => 'Bad creds'
            ], 401);
        }

        $token = $user->createToken('myapptoken')->plainTextToken;
        // Load role
        $role = \App\Models\Role::find($user->role_id);
        $user->role = $role ? $role->name : 'Unknown';

        return response([
            'user' => $user,
            'token' => $token
        ], 201);
    }

    public function logout(Request $request) {
        auth()->user()->tokens()->delete();
        return [
            'message' => 'Logged out'
        ];
    }

    public function updateProfile(Request $request)
    {
        $user = Auth::user();
        if (!$user) {
            return response(['message' => 'Unauthorized'], 401);
        }

        $fields = $request->validate([
            'username' => 'required|string|unique:users,username,'.$user->id,
            'email' => 'required|string|unique:users,email,'.$user->id,
            'password' => 'nullable|string|confirmed'
        ]);

        $user->username = $fields['username'];
        $user->email = $fields['email'];
        if ($request->filled('password')) {
            $user->password = bcrypt($fields['password']);
        }
        $user->save();

        return response([
            'message' => 'Profile updated successfully',
            'user' => $user
        ]);
    }
}
