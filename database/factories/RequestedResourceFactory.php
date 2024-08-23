<?php

namespace Database\Factories;

use App\Models\Project;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\RequestedResource>
 */
class RequestedResourceFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'type' => 'requested_resource',
            'name' => fake()->word(),
            'description' => fake()->text(),
            'price' => 9000.50,
            'by_crti' => rand(0, 1),
            'project_id' => Project::all()->random()->id,
        ];
    }
}
