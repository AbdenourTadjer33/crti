<?php

namespace Modules\Permission\Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class PermissionFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     */
    protected $model = \Modules\Permission\Models\Permission::class;

    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        return [
            'model' => fake()->word(),
            'action' => fake()->word(),
        ];
    }
}
