<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tutors', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->json('subjects');
            $table->string('level');
            $table->string('city');
            $table->decimal('price', 8, 2);
            $table->decimal('rating', 3, 1)->default(0);
            $table->string('avatar')->nullable();
            $table->text('bio')->nullable();
            $table->string('experience')->nullable();
            $table->json('languages')->nullable();
            $table->string('education')->nullable();
            $table->string('method')->nullable();
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('set null');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tutors');
    }
};
