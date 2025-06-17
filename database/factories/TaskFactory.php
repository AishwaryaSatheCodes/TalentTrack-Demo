<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Task;

class TaskFactory extends Factory
{
    protected $model = Task::class;

    public function definition(): array
    {
        $status = fake()->randomElement(['pending', 'in_progress', 'send_for_approval', 'completed']);
        $createdAt = fake()->dateTimeBetween('-2 months', '-1 week');

        $sendForApprovalDate = null;
        $completionDate = null;

        if ($status === 'send_for_approval' || $status === 'completed') {
            $sendForApprovalDate = fake()->dateTimeBetween($createdAt, 'now');
        }

        if ($status === 'completed') {
            $completionDate = $sendForApprovalDate;
        }

        return [
            'name' => fake()->words(3, true),
            'description' => fake()->sentence(8),
            'due_date' => fake()->dateTimeBetween('now', '+1 year'),
            'status' => $status,
            'priority' => fake()->randomElement(['low', 'medium', 'high']),
            'image_path' => null,
            'assigned_user_id' => 1,
            'created_by' => 1,
            'updated_by' => 1,
            'send_for_approval_date' => $sendForApprovalDate,
            'completion_date' => $completionDate,
            'created_at' => $createdAt,
            'updated_at' => now(),
        ];
    }
}
