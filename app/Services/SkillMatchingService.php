<?php

namespace App\Services;

use App\Models\User;
use App\Models\Skill;

class SkillMatchingService
{
    /**
     * Calculate compatibility between a task's required skills and a user’s skills.
     *
     * @param  \App\Models\User  $user
     * @param  array  $requiredSkills
     * @return float
     */
    public function calculateCompatibility(User $user, array $requiredSkills): float
    {
        // Return 0% compatibility if no required skills
        if (empty($requiredSkills)) {
            return 0;
        }
    
        $userSkills = $user->skills()->pluck('name')->toArray();
        $matchedSkills = array_intersect($requiredSkills, $userSkills);
    
        return (count($matchedSkills) / count($requiredSkills)) * 100;
    }
    

    /**
     * Get users with their compatibility scores.
     *
     * @param  array  $requiredSkills
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getUsersWithCompatibility(array $requiredSkills)
    {
        return User::with('skills')
            ->get()
            ->map(function ($user) use ($requiredSkills) {
                $compatibility = $this->calculateCompatibility($user, $requiredSkills);

                return [
                    'user' => $user,
                    'compatibility' => $compatibility,
                    'match_percentage' => $compatibility,
                ];
            });
    }
}
