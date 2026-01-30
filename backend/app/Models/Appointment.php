<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Appointment extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'user_id',
        'appointment_date',
        'appointment_time',
        'whatsapp_number',
        'location',
        'status',
        'confirmed_date',
        'confirmed_time',
        'notes',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
