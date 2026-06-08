<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Tutor;
use App\Models\User;
use Illuminate\Http\Request;

class BookingController extends Controller
{
    /**
     * Liste des réservations de l'utilisateur connecté
     */
    public function index(Request $request)
    {
        $bookings = $request->user()
            ->bookings()
            ->with('tutor')
            ->orderByDesc('created_at')
            ->get();

        return response()->json([
            'data' => $bookings,
        ]);
    }

    /**
     * Créer une réservation
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'tutor_id' => 'required|exists:tutors,id',
            'date' => 'required|date|after:today',
            'time' => 'nullable|string',
            'subject' => 'nullable|string',
            'message' => 'nullable|string|max:500',
        ]);

        $validated['user_id'] = $request->user()->id;
        $validated['status'] = 'pending';

        $booking = Booking::create($validated);
        $booking->load('tutor');

        return response()->json([
            'data' => $booking,
            'message' => 'Réservation créée avec succès !',
        ], 201);
    }

    /**
     * Stats admin
     */
    public function adminStats()
    {
        return response()->json([
            'data' => [
                'total_tutors' => Tutor::count(),
                'total_users' => User::count(),
                'total_bookings' => Booking::count(),
                'pending_bookings' => Booking::where('status', 'pending')->count(),
                'confirmed_bookings' => Booking::where('status', 'confirmed')->count(),
            ],
        ]);
    }

    /**
     * Toutes les réservations (admin)
     */
    public function adminBookings()
    {
        $bookings = Booking::with(['tutor', 'user'])
            ->orderByDesc('created_at')
            ->get();

        return response()->json([
            'data' => $bookings,
        ]);
    }

    /**
     * Changer le statut d'une réservation (admin)
     */
    public function adminUpdateStatus(Request $request, Booking $booking)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,confirmed,cancelled',
        ]);

        $booking->update(['status' => $validated['status']]);
        $booking->load(['tutor', 'user']);

        return response()->json([
            'data' => $booking,
            'message' => 'Statut mis à jour.',
        ]);
    }

    /**
     * Réservations reçues par le tuteur connecté
     */
    public function tutorBookings(Request $request)
    {
        $user = $request->user();
        $tutor = $user->tutor;

        if (!$tutor) {
            return response()->json(['data' => []]);
        }

        $bookings = $tutor->bookings()
            ->with('user')
            ->orderByDesc('created_at')
            ->get();

        return response()->json([
            'data' => $bookings,
        ]);
    }

    /**
     * Payer une réservation (simulé)
     */
    public function pay(Request $request, Booking $booking)
    {
        $user = $request->user();

        // Vérifier que la réservation appartient à l'élève connecté
        if ($booking->user_id !== $user->id) {
            return response()->json([
                'message' => 'Non autorisé.',
            ], 403);
        }

        // Vérifier que la réservation est confirmée
        if ($booking->status !== 'confirmed') {
            return response()->json([
                'message' => 'Vous ne pouvez payer que les réservations confirmées.',
            ], 400);
        }

        // Vérifier si elle est déjà payée
        if ($booking->payment_status === 'paid') {
            return response()->json([
                'message' => 'Cette réservation est déjà payée.',
            ], 400);
        }

        // Validation fictive des coordonnées de la carte reçues
        $request->validate([
            'cardholder_name' => 'required|string|min:3',
            'card_number' => 'required|string',
            'expiry_date' => 'required|string',
            'cvv' => 'required|string|min:3|max:4',
        ]);

        // Mettre à jour le statut du paiement
        $booking->update([
            'payment_status' => 'paid',
            'payment_method' => 'card',
            'payment_date' => now(),
        ]);

        $booking->load('tutor');

        return response()->json([
            'data' => $booking,
            'message' => 'Paiement effectué avec succès !',
        ]);
    }
}
