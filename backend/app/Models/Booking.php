<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Booking extends Model
{
    protected $fillable = [
        'user_id',
        'tutor_id',
        'date',
        'time',
        'subject',
        'message',
        'status',
        'payment_status',
        'payment_method',
        'payment_date',
    ];

    protected $casts = [
        'date' => 'date',
        'payment_date' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function tutor(): BelongsTo
    {
        return $this->belongsTo(Tutor::class);
    }
}
