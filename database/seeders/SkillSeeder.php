<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Skill;

class SkillSeeder extends Seeder
{
    public function run(): void
    {
        $skills = [
            // Programming Languages
            'HTML',
            'CSS',
            'JavaScript',
            'TypeScript',
            'Python',
            'Java',
            'C++',
            'C#',
            'PHP',
            'Go',

            // CS & Dev Topics
            'Data Structures',
            'Algorithms',
            'Databases',
            'Operating Systems',
            'Computer Networks',
            'Software Engineering',
            'Machine Learning',
            'Artificial Intelligence',
            'Web Development',
            'Mobile Development',
            'Version Control (Git)',
            'Cybersecurity',
            'DevOps',
        ];

        foreach ($skills as $skill) {
            Skill::firstOrCreate(['name' => $skill]);
        }
    }
}
