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
        Schema::create('boards', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->longText('description')->nullable();
            $table->timestamp('judgment_start_date');
            $table->timestamp('judgment_end_date');
            $table->foreignId('user_id')->nullable()->constrained('users', 'id')->nullOnDelete();
            $table->foreignId('project_id')->constrained('projects', 'id')->cascadeOnDelete();
            $table->timestamps();
        });

        Schema::create('board_user', function (Blueprint $table) {
            $table->foreignId('user_id')->constrained('users', 'id')->cascadeOnDelete();
            $table->foreignId('board_id')->constrained('boards', 'id')->cascadeOnDelete();
            $table->string('comment')->nullable();
            $table->boolean('is_favorable')->nullable();
            $table->timestamps();
            $table->primary(['user_id', 'board_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('board_user');
        Schema::dropIfExists('boards');
    }
};
