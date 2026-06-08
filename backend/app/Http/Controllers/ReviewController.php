<?php

namespace App\Http\Controllers;

use App\Models\Review;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    /** Avis d'un tuteur */
    public function index($tutorId)
    {
        $reviews = Review::where('tutor_id', $tutorId)
            ->with('user:id,name')
            ->orderByDesc('created_at')
            ->get();

        return response()->json(['data' => $reviews]);
    }

    /** Créer / mettre à jour un avis */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'tutor_id' => 'required|exists:tutors,id',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:500',
        ]);

        $review = Review::updateOrCreate(
            ['user_id' => $request->user()->id, 'tutor_id' => $validated['tutor_id']],
            ['rating' => $validated['rating'], 'comment' => $validated['comment']]
        );

        $review->load('user:id,name');

        return response()->json(['data' => $review, 'message' => 'Avis enregistré !'], 201);
    }
}
