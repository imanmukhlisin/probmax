<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DailyFeedback extends Model
{
    protected $guarded = [];

    protected $casts = [
        'answers_json' => 'array',
    ];
}
