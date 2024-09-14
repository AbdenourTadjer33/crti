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
        Schema::create('partners', function (Blueprint $table) {
            $table->id();
            $table->string('organisation');
            $table->string('sector');
            $table->string('contact_name');
            $table->string('contact_post');
            $table->string('contact_phone');
            $table->string('contact_email');
            $table->timestamp('created_at')->useCurrent();
        });

        Schema::create('domains', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->boolean("suggested")->nullable();
            $table->timestamp('created_at')->useCurrent();
        });

        Schema::create('natures', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->boolean('suggested')->nullable();
            $table->timestamp('created_at')->useCurrent();
        });

        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->string('code', 15)->unique()->index();
            $table->foreignId('division_id')->nullable()->constrained('divisions', 'id')->nullOnDelete();
            $table->foreignId('user_id')->nullable()->constrained('users', 'id')->nullOnDelete();
            $table->foreignId('partner_id')->nullable()->constrained('partners', 'id')->nullOnDelete();
            $table->foreignId('nature_id')->nullable()->constrained('natures', 'id')->nullOnDelete();
            $table->string('status');
            $table->string('name')->nullable();
            $table->date('date_begin')->nullable();
            $table->date('date_end')->nullable();
            $table->longText('description')->nullable();
            $table->longText('goals')->nullable();
            $table->longText('methodology')->nullable();
            $table->decimal('estimated_amount', 10)->nullable();
            $table->json('deliverables')->nullable();
            $table->json('version_info')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('project_domain', function (Blueprint $table) {
            $table->foreignId('project_id')->constrained('projects', 'id')->cascadeOnDelete();
            $table->foreignId('domain_id')->constrained('domains', 'id')->cascadeOnDelete();
            $table->primary(['project_id', 'domain_id']);
        });

        Schema::create('project_existing_resource', function (Blueprint $table) {
            $table->foreignId('project_id')->constrained('projects', 'id')->cascadeOnDelete();
            $table->foreignId('resource_id')->constrained('resources', 'id')->cascadeOnDelete();
            $table->primary(['project_id', 'resource_id']);
        });

        Schema::create('members', function (Blueprint $table) {
            $table->foreignId('project_id')->constrained('projects', 'id')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained('users', 'id')->cascadeOnDelete();
            $table->primary(['project_id', 'user_id']);
        });

        Schema::create('tasks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained('projects', 'id')->cascadeOnDelete();
            $table->string('name');
            $table->string('status');
            $table->longText('description');
            $table->string('priority')->nullable();
            $table->date('date_begin');
            $table->date('date_end');
            $table->date('real_start_date')->nullable();
            $table->date('real_end_date')->nullable();
            $table->date('suspended_at')->nullable();
            $table->text('suspension_reason')->nullable();
            $table->date('canceled_at')->nullable();
            $table->text('cancellation_reason')->nullable();
            $table->timestamps();
        });

        Schema::create('task_status_histories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('task_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('old_status');
            $table->string('new_status');
            $table->text('reason')->nullable();
            $table->timestamp('changed_at')->useCurrent();
        });

        Schema::create('task_user', function (Blueprint $table) {
            $table->foreignId('task_id')->constrained('tasks', 'id')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained('users', 'id')->cascadeOnDelete();
            $table->primary(['task_id', 'user_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Schema::dropIfExists('task_resource');
        Schema::dropIfExists('task_user');
        Schema::dropIfExists('tasks');
        Schema::dropIfExists('members');
        Schema::dropIfExists('project_existing_resource');
        Schema::dropIfExists('project_domain');
        Schema::dropIfExists('projects');
        Schema::dropIfExists('natures');
        Schema::dropIfExists('domains');
        Schema::dropIfExists('partners');
    }
};
