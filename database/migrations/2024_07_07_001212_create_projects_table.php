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
        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->string('code', 10);
            $table->foreignId('division_id')->nullable()->constrained('divisions', 'id')->nullOnDelete();
            $table->foreignId('user_id')->nullable()->constrained('users', 'id')->nullOnDelete();
            $table->string('status');

            $table->string('name')->nullable();
            $table->string('nature')->nullable();
            $table->json('domains')->nullable();
            $table->date('date_begin')->nullable();
            $table->date('date_end')->nullable();
            $table->longText('description')->nullable();
            $table->longText('goals')->nullable();
            $table->longText('methodology')->nullable();

            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('requested_resources', function (Blueprint $table) {
            $table->foreignId('resource_id')->constrained('resources', 'id')->cascadeOnDelete();
            $table->foreignId('project_id')->constrained('projects', 'id')->cascadeOnDelete();
            $table->float('price');
            $table->boolean('by_partner');
            $table->primary('resource_id');
        });

        Schema::create('project_existing_resource', function (Blueprint $table) {
            $table->foreignId('project_id')->constrained('projects', 'id');
            $table->foreignId('resource_id')->constrained('resources', 'id');
            $table->primary(['project_id', 'resource_id']);
        });

        Schema::create('members', function (Blueprint $table) {
            $table->foreignId('project_id')->constrained('projects', 'id');
            $table->foreignId('user_id')->constrained('users', 'id');
            $table->primary(['project_id', 'user_id']);
        });

        Schema::create('tasks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained('projects', 'id')->cascadeOnDelete();
            $table->string('name');
            $table->date('date_begin');
            $table->date('date_end');
            $table->longText('description');
            $table->string('result')->nullable();
            $table->string('priority');
            $table->timestamps();
        });

        Schema::create('task_user', function (Blueprint $table) {
            $table->foreignId('task_id')->constrained('tasks', 'id');
            $table->foreignId('user_id')->constrained('users', 'id');
            $table->primary(['task_id', 'user_id']);
        });

        Schema::create('task_resource', function (Blueprint $table) {
            $table->foreignId('task_id')->constrained('tasks', 'id')->cascadeOnDelete();
            $table->foreignId('resource_id')->constrained('resources', 'id')->cascadeOnDelete();
            $table->primary(['task_id', 'resource_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('projects');
        Schema::dropIfExists('requested_resources');
        Schema::dropIfExists('project_existing_resource');
        Schema::dropIfExists('members');
        Schema::dropIfExists('tasks');
        Schema::dropIfExists('task_user');
        Schema::dropIfExists('task_resource');
    }
};
