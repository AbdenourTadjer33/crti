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
            $table->string('name');
            $table->string('description')->nullable();
            $table->timestamps();
        });

        Schema::create('user_division', function (Blueprint $table) {
            $table->foreignId('user_id')
                ->constrained('users', 'id')
                ->cascadeOnDelete();

            $table->foreignId('division_id')
                ->constrained('divisions', 'id')
                ->cascadeOnDelete();

            $table->enum('role', ['chef de division', 'chercheur'])
                ->default("chercheur")
                ->comment("here i want all roles on a division");

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
        Schema::dropIfExists('user_division');
    }
};
