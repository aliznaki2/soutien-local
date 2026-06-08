<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Tutor extends Model
{
    protected $fillable = [
        'name',
        'subjects',
        'level',
        'city',
        'price',
        'rating',
        'avatar',
        'bio',
        'experience',
        'languages',
        'education',
        'method',
        'user_id',
    ];

    protected $casts = [
        'subjects' => 'array',
        'languages' => 'array',
        'price' => 'decimal:2',
        'rating' => 'decimal:1',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function bookings(): HasMany
    {
        return $this->hasMany(Booking::class);
    }
}
