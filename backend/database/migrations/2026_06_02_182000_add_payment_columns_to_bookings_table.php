<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('bookings', function (Blueprint $table) {
            $table->enum('payment_status', ['unpaid', 'paid'])->default('unpaid')->after('status');
            $table->string('payment_method')->nullable()->after('payment_status');
            $table->timestamp('payment_date')->nullable()->after('payment_method');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('bookings', function (Blueprint $table) {
            $table->dropColumn(['payment_status', 'payment_method', 'payment_date']);
        });
    }
};
