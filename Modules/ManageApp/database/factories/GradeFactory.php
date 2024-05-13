<?php

namespace Modules\ManageApp\Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class GradeFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     */
    protected $model = \Modules\ManageApp\Models\Grade::class;

    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        return [];
    }
}

