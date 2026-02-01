<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ConsultantSchedule extends Model
{
    protected $guarded = [];

    public function consultant()
    {
        return $this->belongsTo(User::class, 'consultant_id');
    }
}
