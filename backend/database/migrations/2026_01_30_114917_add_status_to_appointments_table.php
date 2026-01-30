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
        Schema::table('appointments', function (Blueprint $table) {
            $table->enum('status', ['pending', 'confirmed', 'completed', 'cancelled'])->default('pending')->after('location');
            $table->date('confirmed_date')->nullable()->after('status');
            $table->time('confirmed_time')->nullable()->after('confirmed_date');
            $table->text('notes')->nullable()->after('confirmed_time');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('appointments', function (Blueprint $table) {
            $table->dropColumn(['status', 'confirmed_date', 'confirmed_time', 'notes']);
        });
    }
};
