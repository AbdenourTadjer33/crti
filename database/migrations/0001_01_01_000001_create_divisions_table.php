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
        Schema::create('divisions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('unit_id')->constrained('units', 'id')->cascadeOnDelete();
            $table->string('name');
            $table->string('abbr', 10);
            $table->longText('description');
            $table->timestamps();
        });

        Schema::create('division_user', function (Blueprint $table) {
            $table->foreignId('user_id')->constrained('users', 'id')->cascadeOnDelete();
            $table->foreignId('division_id')->constrained('divisions', 'id')->cascadeOnDelete();
            $table->string('grade');
            $table->timestamps();
            $table->primary(['user_id', 'division_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('divisions');
        Schema::dropIfExists('division_user');
    }
};
