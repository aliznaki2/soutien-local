<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\TutorController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\ReviewController;

/*
|--------------------------------------------------------------------------
| API Routes — SoutienLocal
|--------------------------------------------------------------------------
*/

// ─── Routes publiques ──────────────────────────────
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/google-login', [AuthController::class, 'googleLogin']);

// Tuteurs (lecture publique)
Route::get('/tutors', [TutorController::class, 'index']);
Route::get('/tutors/{tutor}', [TutorController::class, 'show']);

// Avis (lecture publique)
Route::get('/reviews/{tutor}', [ReviewController::class, 'index']);

// ─── Routes protégées (auth:sanctum) ───────────────
Route::middleware('auth:sanctum')->group(function () {
    // Utilisateur
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::put('/profile', [AuthController::class, 'updateProfile']);

    // Dashboard élève
    Route::get('/student/stats', [AuthController::class, 'studentStats']);

    // Réservations
    Route::get('/bookings', [BookingController::class, 'index']);
    Route::post('/bookings', [BookingController::class, 'store']);
    Route::post('/bookings/{booking}/pay', [BookingController::class, 'pay']);

    // Avis
    Route::post('/reviews', [ReviewController::class, 'store']);

    // Dashboard tuteur
    Route::get('/tutor/stats', [AuthController::class, 'tutorStats']);
    Route::get('/tutor/bookings', [BookingController::class, 'tutorBookings']);
    Route::put('/tutor/profile', [TutorController::class, 'updateMyProfile']);

    // Admin
    Route::get('/admin/stats', [BookingController::class, 'adminStats']);
    Route::get('/admin/bookings', [BookingController::class, 'adminBookings']);
    Route::put('/admin/bookings/{booking}', [BookingController::class, 'adminUpdateStatus']);

    // CRUD tuteurs (admin)
    Route::post('/tutors', [TutorController::class, 'store']);
    Route::put('/tutors/{tutor}', [TutorController::class, 'update']);
    Route::delete('/tutors/{tutor}', [TutorController::class, 'destroy']);
});
