<?php
namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Skill;
use Illuminate\Http\Request;

class SkillMatchingController extends Controller
{
    public function matchUsers(Request $request)
    {
        $request->validate([
            'skill_ids' => 'required|array',
            'skill_ids.*' => 'exists:skills,id',
        ]);

        $requiredSkills = collect($request->skill_ids);

        $users = User::with('skills')->get();

        $results = $users->map(function ($user) use ($requiredSkills) {
            $userSkillIds = $user->skills->pluck('id');

            $matchedCount = $requiredSkills->intersect($userSkillIds)->count();
            $totalRequired = $requiredSkills->count();
            $compatibility = $totalRequired > 0
                ? round(($matchedCount / $totalRequired) * 100)
                : 0;

            return [
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                ],
                'compatibility' => $compatibility,
            ];
        })->filter(fn ($item) => $item['compatibility'] > 0) // optional: filter out 0% matches
          ->sortByDesc('compatibility')
          ->values();

        return response()->json($results);
    }
}
