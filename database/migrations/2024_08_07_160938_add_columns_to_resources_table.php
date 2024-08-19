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
        Schema::table('resources', function (Blueprint $table) {
            $table->float('price')->nullable()->after('state');
            $table->boolean('by_crti')->nullable();
            $table->foreignId('project_id')->nullable()->constrained('projects', 'id')->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('resources', function (Blueprint $table) {
            $table->dropColumn('price');
            $table->dropColumn('by_crti');
            $table->dropColumn('project_id');
        });
    }
};
