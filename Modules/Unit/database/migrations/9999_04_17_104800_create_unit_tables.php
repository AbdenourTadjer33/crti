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

        $config = config('unit');
        $relations = $config['relations'];

        Schema::create($config['table_name'], function (Blueprint $table) {
            $table->id();
            $table->string('name')->nullable();
            $table->string('code')->nullable();
            $table->text('description')->nullable();
            $table->string('address')->nullable();
            $table->string('city')->nullable();
            $table->string('country')->nullable();
            $table->json('coordinates')->nullable();
            $table->timestamps();
        });

        foreach ($relations as $relation) {
            Schema::table($relation['table'], function (Blueprint $table) use ($relation, $config) {

                $column = $table
                    ->foreignId($relation['foreign'] ?? $config['fk_unit'])
                    ->nullable($relation['nullable'] ?? false);

                if (isset($relation['comment']) && $relation['comment']) {
                    $column->comment($relation['comment']);
                }

                if (isset($relation['after']) && $relation['after']) {
                    $column->after($relation['after']);
                }

                $constrained = $column->constrained($config['table_name']);

                if (isset($relation['onDelete']) && in_array($relation['onDelete'], ['cascade', 'restrict'])) {
                    $constrained->onDelete($relation['onDelete']);
                } elseif ($relation['nullable']) {
                    $constrained->nullOnDelete();
                } else {
                    $constrained->noActionOnDelete();
                }

                if (isset($relation['onUpdate']) && in_array($relation['onUpdate'], ['cascade', 'restrict'])) {
                    $constrained->onUpdate($relation['onUpdate']);
                } else {
                    $constrained->noActionOnUpdate();
                }
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $config = config('unit');

        Schema::dropIfExists($config['table_name']);

        foreach ($config['relations'] as $relation) {
            Schema::dropColumns($relation['table'], $relation['foreign'] ?? $config['fk_unit']);
        }
    }
};
