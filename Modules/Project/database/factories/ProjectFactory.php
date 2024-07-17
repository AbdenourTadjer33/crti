<?php

namespace Modules\Project\Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Nette\Utils\Random;

class ProjectFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     */
    protected $model = \Modules\Project\Models\Project::class;

    /**
     * Define the model's default state.
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
