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
        Schema::create(config('unit.table_names.unit'), function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('code');
            $table->text('description')->nullable();
            $table->string('address')->nullable();
            $table->string('city')->nullable();
            $table->string('country');
            $table->json('coordinates')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        foreach (config('unit.relation') as $relation) {
            Schema::table($relation['table_name'], function (Blueprint $table) use ($relation) {
                $table->foreignId(config('unit.columns.fk_unit'))->constrained($relation['table_name']);
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists(config('unit.table_names.unit'));
    }
};
