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
        Schema::create(config('permission.table_names.permissions'), function (Blueprint $table) {
            $table->id();
            $table->string('model');
            $table->string('action');
            $table->timestamps();

            $table->unique(['model', 'action']);
        });

        Schema::create(config('permission.table_names.roles'), function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->string('description')->nullable();
            $table->timestamps();
        });

        Schema::create(config('permission.table_names.role_permission'), function (Blueprint $table) {
            $table->foreignId(config('permission.columns.fk_role'))
                ->constrained(config('permission.table_names.roles'))
                ->cascadeOnDelete();

            $table->foreignId(config('permission.columns.fk_permission'))
                ->constrained(config('permission.table_names.permissions'))
                ->cascadeOnDelete();

            $table->primary([
                config('permission.columns.fk_role'),
                config('permission.columns.fk_permission')
            ]);
        });

        Schema::create(config('permission.table_names.model_has_permissions'), function (Blueprint $table) {
            $table->foreignId(config('permission.columns.fk_permission'))
                ->constrained(config('permission.table_names.permissions'))
                ->cascadeOnDelete();
            $table->morphs('modelable');

            $table->unique([
                config('permission.columns.fk_permission'),
                'modelable_type',
                'modelable_id',
            ], 'model_has_permissions_unique');
        });

        Schema::create(config('permission.table_names.model_has_roles'), function (Blueprint $table) {
            $table->foreignId(config('permission.columns.fk_role'))
                ->constrained(config('permission.table_names.roles'))
                ->cascadeOnDelete();
            $table->morphs('modelable');

            $table->unique([
                config('permission.columns.fk_role'),
                'modelable_type',
                'modelable_id',
            ], 'model_has_roles_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists(config('permission.table_names.role_permission'));
        Schema::dropIfExists(config('permission.table_names.model_has_permissions'));
        Schema::dropIfExists(config('permission.table_names.model_has_roles'));
        Schema::dropIfExists(config('permission.table_names.permissions'));
        Schema::dropIfExists(config('permission.table_names.roles'));
    }
};
