<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Models\Project;
use App\Models\Task;

class UserCrudResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */

     public static $wrap = false;
    public function toArray(Request $request): array
    {
        $currentUserId = auth()->id();

        // Retrieve all shared projects
        $sharedProjects = Project::whereHas('tasks', function ($query) use ($currentUserId) {
            $query->where('assigned_user_id', $this->id)
                  ->whereIn('project_id', function ($subQuery) use ($currentUserId) {
                      $subQuery->select('project_id')
                               ->from('tasks')
                               ->where('assigned_user_id', $currentUserId);
                  });
        })->get(['id', 'name']);
    
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'created_at' => $this->created_at->format('Y-m-d H:i:s'),
            'shared_projects' => $sharedProjects,
            'skills' => $this->skills->map(function ($skill) {
            return [
                'id' => $skill->id,
                'name' => $skill->name,
            ];
        }),
        ];
    }
}
