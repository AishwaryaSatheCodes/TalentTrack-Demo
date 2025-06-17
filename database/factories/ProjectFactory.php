<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Project;
use App\Models\Task;
/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Project>
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
            
            'name' =>fake()->words(3,true),
            'description' => fake()->sentence(8),
            'due_date' =>fake()->dateTimeBetween('now', '+1 year'),
            'status' =>fake()->randomElement(['pending','in_progress','completed']),
            //imageUrl() unsupported, alt:
            'image_path' => null,

            'created_by' => 1,
            'updated_by' => 1,
            'created_at' => time(),
            'updated_at' => time()
        ];
    }

    public function configure(): static
    {
        return $this->afterCreating(function (Project $project) {
            if ($project->status === 'completed') {
                // Ensure all tasks are marked as completed
                $project->tasks()->update(['status' => 'completed']);
            }
        });
    }
}
