<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Créer un utilisateur admin
        User::create([
            'name' => 'Admin SoutienLocal',
            'email' => 'admin@gmail.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
        ]);

        // Créer un utilisateur étudiant de test
        User::create([
            'name' => 'Ali Znaki',
            'email' => 'ali@example.com',
            'password' => Hash::make('password'),
            'role' => 'student',
        ]);

        // Seeder des tuteurs
        $this->call(TutorSeeder::class);
    }
}
