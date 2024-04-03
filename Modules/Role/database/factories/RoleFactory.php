<?php

namespace Modules\Role\database\factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class RoleFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     */
    protected $model = \Modules\Role\Models\Role::class;

    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        return [];
    }
}

