<?php

namespace App\Observers;

use App\Models\Task;
use App\Models\Project;

class TaskObserver
{
    /**
     * Handle the Task "created" event.
     */
    public function created(Task $task): void
    {
        $project = Project::find($task->project_id);

        if ($project && $project->status === 'completed') {
            $project->update(['status' => 'in_progress']);
        }
    }

    /**
     * Handle the Task "updated" event.
     */
    public function updated(Task $task): void
    {
        $this->updateProjectStatus($task->project_id);
    }

    /**
     * Handle the Task "deleted" event.
     */
    public function deleted(Task $task): void
    {
        $this->updateProjectStatus($task->project_id);
    }

    /**
     * Handle the Task "restored" event.
     */
    public function restored(Task $task): void
    {
        //
    }

    /**
     * Handle the Task "force deleted" event.
     */
    public function forceDeleted(Task $task): void
    {
        //
    }

    // Helper to check and update project status
    private function updateProjectStatus($projectId)
    {
        $project = Project::find($projectId);
        if (!$project) return;

        $hasPendingTasks = Task::where('project_id', $projectId)
                                ->whereIn('status', ['pending', 'in_progress'])
                                ->exists();

        $project->update(['status' => $hasPendingTasks ? 'in_progress' : 'completed']);
    }
}
