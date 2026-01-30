<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\DailyFeedback;
use App\Models\UserFeedback;
use Illuminate\Support\Facades\Auth;

class FeedbackController extends Controller
{
    public function storeDaily(Request $request)
    {
        $request->validate([
            'total_score' => 'required|integer',
            'stress_level' => 'required',
            'color' => 'required',
            'answers_json' => 'required', // Should be JSON/Array
        ]);

        $feedback = DailyFeedback::create([
            'user_id' => Auth::id(),
            'username' => Auth::user()->username,
            'total_score' => $request->total_score,
            'stress_level' => $request->stress_level,
            'color' => $request->color,
            'answers_json' => is_array($request->answers_json) ? json_encode($request->answers_json) : $request->answers_json
        ]);

        return response($feedback, 201);
    }

    public function indexDaily()
    {
        $user = Auth::user();
        if ($user->role_id == 1 || $user->role_id == 2) { // Admin or Consultant
             return DailyFeedback::orderBy('created_at', 'desc')->get();
        }
        return DailyFeedback::where('user_id', $user->id)->orderBy('created_at', 'desc')->get();
    }

    public function storeUser(Request $request)
    {
        $request->validate([
            'selected_mood' => 'required',
            'selected_habit' => 'required',
            'selected_liking' => 'required',
        ]);

        $feedback = UserFeedback::create([
            'user_id' => Auth::id(),
            'username' => Auth::user()->username,
            'selected_mood' => $request->selected_mood,
            'selected_habit' => $request->selected_habit,
            'selected_liking' => $request->selected_liking
        ]);

        return response($feedback, 201);
    }

    public function indexUser()
    {
         $user = Auth::user();
        if ($user->role_id == 1 || $user->role_id == 2) { // Admin or Consultant
             return UserFeedback::orderBy('created_at', 'desc')->get();
        }
        return UserFeedback::where('user_id', $user->id)->orderBy('created_at', 'desc')->get();
    }
}
