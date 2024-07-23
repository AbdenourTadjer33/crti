<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Nette\Utils\Random;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Division>
 */
class ProjectFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'code' => Random::generate(),
            'status' => "creation",
            'name' => implode(' ', fake()->words()),
            'nature' => 'str',
            'domains' => [],
            'date_begin' => now()->addWeek(),
            'date_end' => now()->addYears(3),
            'description' => fake()->text(),
            'goals' => fake()->text(),
            'methodology' => fake()->text(),
        ];
    }
}
