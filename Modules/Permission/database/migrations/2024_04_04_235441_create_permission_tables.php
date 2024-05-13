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
        if (!config('permission')) return;

        $config = config('permission');
        $table_names = $config['table_names'];
        $columns = $config['columns'];

        Schema::create($table_names['permissions'], function (Blueprint $table) {
            $table->id();
            $table->string('model');
            $table->string('action');
            $table->tinyInteger('type')->default(0);
            $table->json('contexts')->nullable();
            $table->timestamps();
        });

        Schema::create($table_names['roles'], function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->string('description')->nullable();
            $table->timestamps();
        });

        Schema::create($table_names['role_permission'], function (Blueprint $table) use ($table_names, $columns) {
            $table->foreignId($columns['fk_role'])
                ->constrained($table_names['roles'])
                ->cascadeOnDelete();

            $table->foreignId($columns['fk_permission'])
                ->constrained($table_names['permissions'])
                ->cascadeOnDelete();

            $table->primary([
                $columns['fk_permission'],
                $columns['fk_role'],
            ]);
        });

        Schema::create($table_names['model_has_permissions'], function (Blueprint $table) use ($table_names, $columns) {
            $table->foreignId($columns['fk_permission'])
                ->constrained($table_names['permissions'])
                ->cascadeOnDelete();
            $table->morphs('modelable');

            $table->unique([
                $columns['fk_permission'],
                'modelable_type',
                'modelable_id',
            ], 'model_has_permissions_unique');
        });

        Schema::create($table_names['model_has_roles'], function (Blueprint $table) use ($table_names, $columns) {
            $table->foreignId($columns['fk_role'])
                ->constrained($table_names['roles'])
                ->cascadeOnDelete();
            $table->morphs('modelable');

            $table->unique([
                $columns['fk_role'],
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
        $table_names = config('permission.table_names');

        Schema::dropIfExists($table_names['role_permission']);
        Schema::dropIfExists($table_names['model_has_permissions']);
        Schema::dropIfExists($table_names['model_has_roles']);
        Schema::dropIfExists($table_names['permissions']);
        Schema::dropIfExists($table_names['roles']);
    }
};
