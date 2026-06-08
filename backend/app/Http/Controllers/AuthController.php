<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Inscription d'un nouvel utilisateur
     */
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6|confirmed',
            'role' => 'required|in:student,tutor',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'],
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
            'message' => 'Compte créé avec succès !',
        ], 201);
    }

    /**
     * Connexion d'un utilisateur existant
     */
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Les identifiants sont incorrects.'],
            ]);
        }

        // Supprimer les anciens tokens
        $user->tokens()->delete();
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
            'message' => 'Connexion réussie !',
        ]);
    }

    /**
     * Déconnexion
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Déconnexion réussie.',
        ]);
    }

    /**
     * Récupérer l'utilisateur connecté
     */
    public function user(Request $request)
    {
        return response()->json($request->user());
    }

    /**
     * Mise à jour du profil
     */
    public function updateProfile(Request $request)
    {
        $user = $request->user();
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|max:255|unique:users,email,' . $user->id,
            'password' => 'sometimes|string|min:6|confirmed',
        ]);

        if (isset($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        }

        $user->update($validated);

        return response()->json([
            'user' => $user->fresh(),
            'message' => 'Profil mis à jour avec succès !',
        ]);
    }

    /**
     * Stats élève (dashboard)
     */
    public function studentStats(Request $request)
    {
        $user = $request->user();
        $bookings = $user->bookings()->with('tutor')->get();

        return response()->json([
            'data' => [
                'total_bookings' => $bookings->count(),
                'pending' => $bookings->where('status', 'pending')->count(),
                'confirmed' => $bookings->where('status', 'confirmed')->count(),
                'total_spent' => $bookings->where('payment_status', 'paid')->sum(fn($b) => $b->tutor->price ?? 0),
                'next_booking' => $bookings->where('status', 'confirmed')->where('date', '>=', now()->toDateString())->sortBy('date')->first(),
                'recent_tutors' => $bookings->pluck('tutor')->unique('id')->take(4)->values(),
            ],
        ]);
    }

    /**
     * Stats tuteur (dashboard)
     */
    public function tutorStats(Request $request)
    {
        $user = $request->user();
        $tutor = $user->tutor;

        if (!$tutor) {
            return response()->json([
                'data' => [
                    'total_bookings' => 0,
                    'pending' => 0,
                    'confirmed' => 0,
                    'total_revenue' => 0,
                    'recent_students' => [],
                    'tutor' => null,
                ],
            ]);
        }

        $bookings = $tutor->bookings()->with('user')->get();

        return response()->json([
            'data' => [
                'total_bookings' => $bookings->count(),
                'pending' => $bookings->where('status', 'pending')->count(),
                'confirmed' => $bookings->where('status', 'confirmed')->count(),
                'total_revenue' => $bookings->where('payment_status', 'paid')->count() * $tutor->price,
                'next_booking' => $bookings->where('status', 'confirmed')->where('date', '>=', now()->toDateString())->sortBy('date')->first(),
                'recent_students' => $bookings->pluck('user')->unique('id')->take(4)->values(),
                'tutor' => $tutor,
            ],
        ]);
    }

    /**
     * Mot de passe oublié (Simulation fonctionnelle)
     */
    public function forgotPassword(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email|exists:users,email',
        ], [
            'email.exists' => "Cette adresse email n'est pas enregistrée sur notre plateforme."
        ]);

        $user = User::where('email', $validated['email'])->first();
        
        // Simuler la réinitialisation en DB avec un mot de passe temporaire '123456'
        $user->update([
            'password' => Hash::make('123456')
        ]);

        return response()->json([
            'message' => 'Lien de réinitialisation simulé ! Votre mot de passe a été temporairement changé en "123456".'
        ]);
    }

    /**
     * Connexion avec Google (Simulation fonctionnelle)
     */
    public function googleLogin(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email',
            'name' => 'required|string',
            'google_id' => 'required|string',
            'role' => 'sometimes|string|in:student,tutor',
        ]);

        // Trouver ou créer l'utilisateur
        $user = User::where('email', $validated['email'])->first();

        if (!$user) {
            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make(\Illuminate\Support\Str::random(12)),
                'role' => $validated['role'] ?? 'student',
            ]);
        }

        // Régénérer le token d'accès
        $user->tokens()->delete();
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
            'message' => 'Connexion réussie via Google !',
        ]);
    }
}
