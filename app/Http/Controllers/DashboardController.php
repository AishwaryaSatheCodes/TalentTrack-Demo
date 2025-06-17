<?php

namespace App\Http\Controllers;
use App\Models\Task;
use App\Models\User;
use App\Models\File;
use App\Models\Project;
use App\Http\Resources\TaskResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        //New Users with no roles
        $newUsers = User::doesntHave('roles')
        ->orderBy('created_at', 'desc')
        ->paginate(10);

        $countNewUsers = User::doesntHave('roles')
        ->count();

        $devUsers = User::whereHas('roles', function ($query) {
            $query->where('name', 'development');
        })->count();

        $mgmtUsers = User::whereHas('roles', function ($query) {
            $query->where('name', 'management');
        })->count();
        
        //Task approval workflow cards: 
        $myPendingTasks = Task::query()
        ->where('status', 'pending')
        ->where('assigned_user_id', $user->id)
        ->count();

        $myApprovalTasks = Task::query()
        ->where('status', 'send_for_approval')
        ->where('assigned_user_id', $user->id)
        ->count();

        $myCompletedTasks = Task::query()
            ->where('status', 'completed')
            ->where('assigned_user_id', $user->id)
            ->count();

        // Leaderboard Data Starts.
        $completedTasksByUser = Task::select('assigned_user_id', DB::raw('count(*) as completed_tasks'))
        ->where('status', 'completed')
        ->groupBy('assigned_user_id')
        ->with('assignedUser:id,name')
        ->orderByDesc('completed_tasks')
        ->get();
        
        //Leaderboard Data Ends.

        $awaitApproval = Task::query()
        ->where('status', 'send_for_approval')
        ->limit(10)
        ->get();

        //Heatmap
        // Gather send_for_approval dates for all tasks assigned to the user
        $approvalDates = Task::where('assigned_user_id', $user->id)
                            ->whereNotNull('send_for_approval_date')
                            ->pluck('send_for_approval_date')
                            ->toArray();

        // Gather file upload timestamps for user's tasks
        $fileUploadDates = File::whereHas('task', function ($query) use ($user) {
                                $query->where('assigned_user_id', $user->id);
                            })
                            ->pluck('created_at')
                            ->toArray();

        // Combine and format dates (e.g., convert to Y-m-d strings or timestamps)
        $activityDates = array_merge($approvalDates, $fileUploadDates);

        
        
        $totalTasks = Task::count();
        $totalUsers = User::count();
        $totalProjects = Project::count();

        $assignedProjectCount = Task::where('assigned_user_id', $user->id)
        ->distinct('project_id')
        ->count('project_id');

        $totalAssignedTasks = Task::query()
            ->where('assigned_user_id', $user->id)
            ->count();

        $totalPendingTasks = Task::query()
            ->where('status', 'pending')
            ->count();



        $totalProgressTasks = Task::query()
            ->where('status', 'in_progress')
            ->count();
        $myProgressTasks = Task::query()
            ->where('status', 'in_progress')
            ->where('assigned_user_id', $user->id)
            ->count();


        $totalCompletedTasks = Task::query()
            ->where('status', 'completed')
            ->limit(10)
            ->get();


        $totalCompletedTasksCount = Task::query()
        ->where('status', 'completed')
        ->count();

            

        $activeTasks = Task::query()
            ->where('status', 'in_progress')
            ->where('assigned_user_id', $user->id)
            ->limit(10)
            ->get();
        $activeTasks = TaskResource::collection($activeTasks);
        return inertia(
            'Dashboard',
            compact(
                'totalPendingTasks',
                'myPendingTasks',
                'totalProgressTasks',
                'myProgressTasks',
                'totalCompletedTasks',
                'myCompletedTasks',
                'activeTasks',
                'totalAssignedTasks',
                'assignedProjectCount',
                'totalUsers',
                'totalProjects',
                'completedTasksByUser',
                'totalCompletedTasksCount',
                'totalTasks',
                'awaitApproval',
                'newUsers',
                'countNewUsers', 
                'devUsers',
                'mgmtUsers',
                'myPendingTasks',
                'myApprovalTasks',
                'myCompletedTasks',
                'activityDates',
            )
        );
    }
}
