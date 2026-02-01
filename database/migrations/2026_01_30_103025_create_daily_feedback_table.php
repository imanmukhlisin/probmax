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
        Schema::create('daily_feedback', function (Blueprint $table) {
            $table->id();
            $table->integer('user_id');
            $table->string('username');
            $table->integer('total_score');
            $table->string('stress_level');
            $table->string('color');
            $table->longText('answers_json');
            $table->dateTime('created_at')->useCurrent();
            $table->dateTime('updated_at')->useCurrent()->useCurrentOnUpdate();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('daily_feedback');
    }
};
