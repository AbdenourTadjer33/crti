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
        Schema::create(config('project.table_names.project'), function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create(config('project.table_names.version'), function (Blueprint $table) {
            $table->id();
            $table->foreignId(config('project.columns.fk_project'))->constrained(config('project.table_names.project'))->cascadeOnDelete();

            foreach (config('project.relation.version') as $relation) {
                $table->foreignId($relation['fk'])->nullable()->constrained($relation['table_name'])->nullOnDelete();
            }

            $table->timestamps();
        });

        foreach (config('project.relation.project') as $relation) {
            Schema::table($relation['table_name'], function (Blueprint $table) use ($relation) {
                $table->foreignId(config('project.columns.fk_project'))->constrained($relation['table_name']);
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('project.table_names.project');
        Schema::dropIfExists('project.table_names.version');
        foreach (config('project.relation.project') as $relation) {
            Schema::table($relation['table_name'], function (Blueprint $table) use ($relation) {
                $table->dropColumn(config('project.columns.fk_project'));
            });
        }

        foreach (config('project.relation.version') as $relation) {
            Schema::table($relation['table_name'], function (Blueprint $table) use ($relation) {
                $table->dropColumn(config('project.columns.fk_project'));
            });
        }
    }
};
