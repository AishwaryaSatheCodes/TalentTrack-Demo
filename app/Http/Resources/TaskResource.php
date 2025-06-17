<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\ProjectResource;
use App\Http\Resources\UserResource;
use App\Http\Resources\SkillResource;
use Illuminate\Support\Facades\Storage;
use Carbon\Carbon;

class TaskResource extends JsonResource
{

    public static $wrap=false;
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'created_at' => (new Carbon($this->created_at))->format('y-m-d'),
            'due_date' => (new Carbon($this->due_date))->format('Y-m-d H:i:s'),

            'status' => $this->status,
            'priority' => $this->priority,
            'comments' => $this->comments,

            'image_path' => $this->image_path ? Storage::url($this->image_path): '',

            'project_id' => $this->project_id,
            'project' => new ProjectResource($this->project),

            //Skills
            'skills' => SkillResource::collection($this->whenLoaded('skills')),
            'skill_ids' => $this->skills->pluck('id'),

            //Dates
            'send_for_approval_date' => (new Carbon($this->send_for_approval_date))->format("Y-m-d"),
            'completion_date' => (new Carbon($this->completion_date))->format("y-m-d"),

            'assigned_user_id' => $this->assigned_user_id,
            'assignedUser' => $this->assignedUser ? new UserResource($this->assignedUser) : null,
            //These are functions that define the relations between Project and User models.
            //These relations are defined in the Project.php Model.
            'createdBy' => new UserResource($this->createdBy),
            'updatedBy' => new UserResource($this->updatedBy),
        ];
    }
}
