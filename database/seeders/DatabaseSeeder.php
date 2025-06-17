<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Role;
use App\Models\Task;
use App\Models\Project;
use Illuminate\Database\Seeder;
use Database\Seeders\RoleSeeder;
use Database\Seeders\SkillSeeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            RoleSeeder::class,
            SkillSeeder::class, 
        ]);

        //Retrieve all Skills as an array.
        $skills = \App\Models\Skill::pluck('id')->toArray();

        // Create fixed users
        $aishwarya = User::factory()->create([
            'name' => 'Aishwarya',
            'email' => 'aishwarya@example.com',
            'password' => bcrypt('123.321A'),
            'email_verified_at' => now(),
        ]);
        $preeti = User::factory()->create([
            'name' => 'Preeti',
            'email' => 'preeti@example.com',
            'password' => bcrypt('123.321A'),
            'email_verified_at' => now(),
        ]);
        $elini = User::factory()->create([
            'name' => 'Elini',
            'email' => 'elini@example.com',
            'password' => bcrypt('123.321A'),
            'email_verified_at' => now(),
        ]);
        $nivedita = User::factory()->create([
            'name' => 'Nivedita',
            'email' => 'nivedita@example.com',
            'password' => bcrypt('123.321A'),
            'email_verified_at' => now(),
        ]);
        $surekha = User::factory()->create([
            'name' => 'Surekha',
            'email' => 'surekha@example.com',
            'password' => bcrypt('123.321A'),
            'email_verified_at' => now(),
        ]);
        $manager = User::factory()->create([
            'name' => 'Manager',
            'email' => 'manager@example.com',
            'password' => bcrypt('123.321A'),
            'email_verified_at' => now(),
        ]);
        $admin = User::factory()->create([
            'name' => 'Administration',
            'email' => 'admin@example.com',
            'password' => bcrypt('123.321A'),
            'email_verified_at' => now(),
        ]);

        // Assign roles
        $admin->roles()->attach(Role::where('name', 'admin')->value('id'));
        $manager->roles()->attach(Role::where('name', 'management')->value('id'));

        $devs = [$aishwarya, $preeti, $elini, $nivedita, $surekha];
        foreach ($devs as $dev) {
            $dev->roles()->attach(Role::where('name', 'development')->value('id'));
            $dev->skills()->attach(array_rand(array_flip($skills), rand(5, 10)));
        }

        // Create 4 projects by Greg (manager)
        $projects = Project::factory(4)->create([
            'created_by' => $manager->id,
            'updated_by' => $manager->id,
        ]);

    // Task statuses to rotate evenly
    $statuses = ['pending', 'in_progress', 'send_for_approval', 'completed'];

    // Each dev shall receive 8 tasks of varying states
    $completedCounts = [8, 6, 4, 3, 1]; // unique completed task count for each dev

foreach ($projects as $project) {
    foreach ($devs as $index => $dev) {

        // Unique number of completed tasks
        for ($i = 0; $i < $completedCounts[$index]; $i++) {
            $sendForApprovalDate = now()->subDays(rand(10, 30));
            $completionDate = (clone $sendForApprovalDate)->addDays(rand(1, 7));

            $task = Task::factory()->create([
                'project_id' => $project->id,
                'assigned_user_id' => $dev->id,
                'created_by' => $manager->id,
                'updated_by' => $manager->id,
                'status' => 'completed',
                'priority' => ['low', 'medium', 'high'][rand(0, 2)],
                'send_for_approval_date' => $sendForApprovalDate,
                'completion_date' => $completionDate,
            ]);
            $task->skills()->attach(array_rand(array_flip($skills), rand(5, 15)));
        }

        // Assign 1 send_for_approval task
        $task_sendappr = Task::factory()->create([
            'project_id' => $project->id,
            'assigned_user_id' => $dev->id,
            'created_by' => $manager->id,
            'updated_by' => $manager->id,
            'status' => 'send_for_approval',
            'priority' => ['low', 'medium', 'high'][rand(0, 2)],
            'send_for_approval_date' => now()->subDays(rand(3, 7)),
            'completion_date' => null,
        ]);
        $task_sendappr->skills()->attach(array_rand(array_flip($skills), rand(5, 15)));

        // Assign 2 in_progress tasks
        for ($i = 0; $i < 2; $i++) {
            $task_inprog = Task::factory()->create([
                'project_id' => $project->id,
                'assigned_user_id' => $dev->id,
                'created_by' => $manager->id,
                'updated_by' => $manager->id,
                'status' => 'in_progress',
                'priority' => ['low', 'medium', 'high'][rand(0, 2)],
                'send_for_approval_date' => null,
                'completion_date' => null,
            ]);
            $task_inprog->skills()->attach(array_rand(array_flip($skills), rand(5, 15)));
        }

        // Assign 1 pending task
        $task_pend = Task::factory()->create([
            'project_id' => $project->id,
            'assigned_user_id' => $dev->id,
            'created_by' => $manager->id,
            'updated_by' => $manager->id,
            'status' => 'pending',
            'priority' => ['low', 'medium', 'high'][rand(0, 2)],
            'send_for_approval_date' => null,
            'completion_date' => null,
        ]);
        $task_pend->skills()->attach(array_rand(array_flip($skills), rand(5, 15)));
    }
}

}

}
