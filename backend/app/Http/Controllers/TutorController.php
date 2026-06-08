<?php

namespace App\Http\Controllers;

use App\Models\Tutor;
use Illuminate\Http\Request;

class TutorController extends Controller
{
    /**
     * Liste des tuteurs avec filtres
     */
    public function index(Request $request)
    {
        $query = Tutor::query();

        // Filtre par matière
        if ($request->filled('subject')) {
            $subject = strtolower($request->subject);
            $query->whereRaw('LOWER(subjects) LIKE ?', ["%{$subject}%"]);
        }

        // Filtre par ville
        if ($request->filled('city')) {
            $query->where('city', 'LIKE', '%' . $request->city . '%');
        }

        // Filtre par niveau
        if ($request->filled('level')) {
            $query->where('level', $request->level);
        }

        // Filtre par prix maximum
        if ($request->filled('maxPrice')) {
            $query->where('price', '<=', $request->maxPrice);
        }

        // Tri
        if ($request->filled('sortBy')) {
            switch ($request->sortBy) {
                case 'rating':
                    $query->orderByDesc('rating');
                    break;
                case 'price_asc':
                    $query->orderBy('price');
                    break;
                case 'price_desc':
                    $query->orderByDesc('price');
                    break;
            }
        }

        $tutors = $query->get();

        return response()->json([
            'data' => $tutors,
            'count' => $tutors->count(),
        ]);
    }

    /**
     * Détail d'un tuteur
     */
    public function show(Tutor $tutor)
    {
        return response()->json([
            'data' => $tutor,
        ]);
    }

    /**
     * Créer un tuteur (admin)
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'subjects' => 'required|array',
            'level' => 'required|string',
            'city' => 'required|string',
            'price' => 'required|numeric|min:0',
            'rating' => 'numeric|min:0|max:5',
            'avatar' => 'nullable|string',
            'bio' => 'nullable|string',
            'experience' => 'nullable|string',
            'languages' => 'nullable|array',
            'education' => 'nullable|string',
            'method' => 'nullable|string',
        ]);

        $tutor = Tutor::create($validated);

        return response()->json([
            'data' => $tutor,
            'message' => 'Tuteur créé avec succès.',
        ], 201);
    }

    /**
     * Modifier un tuteur
     */
    public function update(Request $request, Tutor $tutor)
    {
        $validated = $request->validate([
            'name' => 'string|max:255',
            'subjects' => 'array',
            'level' => 'string',
            'city' => 'string',
            'price' => 'numeric|min:0',
            'rating' => 'numeric|min:0|max:5',
            'avatar' => 'nullable|string',
            'bio' => 'nullable|string',
            'experience' => 'nullable|string',
            'languages' => 'nullable|array',
            'education' => 'nullable|string',
            'method' => 'nullable|string',
        ]);

        $tutor->update($validated);

        return response()->json([
            'data' => $tutor,
            'message' => 'Tuteur mis à jour.',
        ]);
    }

    /**
     * Supprimer un tuteur
     */
    public function destroy(Tutor $tutor)
    {
        $tutor->delete();

        return response()->json([
            'message' => 'Tuteur supprimé.',
        ]);
    }

    /**
     * Mise à jour du profil tuteur par le tuteur connecté
     */
    public function updateMyProfile(Request $request)
    {
        $user = $request->user();
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'subjects' => 'sometimes|array',
            'level' => 'sometimes|string',
            'city' => 'sometimes|string',
            'price' => 'sometimes|numeric|min:0',
            'avatar' => 'nullable|string',
            'bio' => 'nullable|string',
            'experience' => 'nullable|string',
            'languages' => 'nullable|array',
            'education' => 'nullable|string',
            'method' => 'nullable|string',
        ]);

        $tutor = $user->tutor;

        if ($tutor) {
            $tutor->update($validated);
        } else {
            // Créer le profil tuteur si inexistant
            $validated['user_id'] = $user->id;
            if (!isset($validated['name'])) $validated['name'] = $user->name;
            $tutor = Tutor::create($validated);
        }

        return response()->json([
            'data' => $tutor->fresh(),
            'message' => 'Profil tuteur mis à jour avec succès.',
        ]);
    }
}
