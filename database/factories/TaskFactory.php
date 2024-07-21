<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Division>
 */
class TaskFactory extends Factory
{
    /**
     * Define the model's default state.
     * 
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => implode(' ', fake()->words()),
            'date_begin' => fake()->date(),
            'date_end' => fake()->date(),
            'description' => fake()->text(),
            'priority' => fake()->word(),
        ];
    }
}
