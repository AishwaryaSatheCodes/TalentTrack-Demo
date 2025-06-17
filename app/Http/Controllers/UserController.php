<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Http\Resources\UserCrudResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;


use Inertia\Inertia;
use App\Models\User;
use App\Models\Task;
use App\Models\Role;
use App\Models\Project;
use App\Models\Skill;
use App\Models\File;

class UserController extends BaseController
{
    /**
     * Display a listing of the resource.
     */
    public function index()
{
    $query = User::query();

    $sortField = request("sort_field", 'created_at');
    $sortDirection = request("sort_direction", 'desc');

    if(request("name")){
        $query->where("name", "like", "%". request("name"). "%");
    }

    if(request("email")){
        $query->where("email", "like", "%". request("email"). "%");
    }

    // Fetch roles of current user
    $userRoles = auth()->user()->roles()->pluck('name')->toArray();

    // Restrict if current user is management
    if (in_array('management', $userRoles) && !in_array('admin', $userRoles)) {
        $query->whereHas('roles', function ($q) {
            $q->where('name', 'development');
        });
    }

    $users = $query->orderBy($sortField, $sortDirection)
                   ->paginate(10)
                   ->onEachSide(1);

    return inertia("User/Index", [
        'users' => UserCrudResource::collection($users),
        'queryParams' => request()->query() ?: null,
        'success' => session('success'),
        'pageType' => 'all',
        'userRoles' => $userRoles,
    ]);


    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
        return inertia("User/Create");
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreUserRequest $request)
    {
        $data = $request->validated();
        $data['email_verified_at'] = time();
        $data['password'] = bcrypt($data['password']);
        User::create($data);
    
        return to_route('user.index')->with('success', 'User ' . $data['name'] . ' Created Successfully!');
    
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        //User Report
            // Eager load roles, skills, tasks with nested relationships for detailed report
        $user->load([
            'roles:id,name',
            'skills:id,name',
            'tasks' => function ($query) {
                $query->with([
                    'skills:id,name',
                    'files:id,task_id,file_name,file_path,uploaded_by',
                    'project:id,name,created_at,due_date,status'
                ]);
            }
        ]);
        //--------------------------------
        $userRoles = auth()->user()->roles()->pluck('name')->toArray();
        $viewedUserRoles = $user->roles()->pluck('name')->toArray();
        $user->load('skills');
      
        // Analytics queries
        $totalTasks = Task::where('assigned_user_id', $user->id)->count();
        // Workload gauge chart data
        $activeTasks = Task::where('assigned_user_id', $user->id)
            ->where('status', '!=', 'completed')
            ->count();

        $averageTasksPerUser = Task::whereNotNull('assigned_user_id')
            ->where('status', '!=', 'completed')
            ->selectRaw('COUNT(*) * 1.0 / COUNT(DISTINCT assigned_user_id) as avg_tasks')
            ->value('avg_tasks');

        $maxTasksAssigned = Task::where('status', '!=', 'completed')
            ->selectRaw('COUNT(*) as task_count, assigned_user_id')
            ->groupBy('assigned_user_id')
            ->orderByDesc('task_count')
            ->limit(1)
            ->value('task_count');



        $tasksCompleted = Task::where('assigned_user_id', $user->id)
                            ->where('status', 'completed')
                            ->count();

        $tasksPending = Task::where('assigned_user_id', $user->id)
                        ->whereIn('status', ['pending'])
                        ->count();

        $tasksSentForApproval = Task::where('assigned_user_id', $user->id)
                        ->whereIn('status', ['send_for_approval'])
                        ->count();
                    
        $tasksInProgress = Task::where('assigned_user_id', $user->id)
                        ->whereIn('status', ['in_progress'])
                        ->count();

        // Average time to complete a task (in hours)
        $avgCompletionTime = Task::where('assigned_user_id', $user->id)
        ->where('status', 'completed')
        ->whereNotNull('completion_date')
        ->whereNotNull('created_at')
        ->selectRaw('AVG(EXTRACT(EPOCH FROM (completion_date - created_at)) / 3600) as avg_hours')
        ->value('avg_hours');

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

        //Skill Section: 
        $allSkillNames = collect($user->skills->pluck('name')->toArray());
        $userSkillSet = $user->skills()->pluck('name')->toArray();
        
        // Fetch task skills
        $taskSkillNames = $user->tasks()
            ->with('skills')
            ->get()
            ->flatMap(fn ($task) => $task->skills->pluck('name'))
            ->unique()
            ->values();

        $allSkillNames = $allSkillNames->merge($taskSkillNames)->unique()->values();


        $totalSkillNames = Skill::all()->toArray();
        $taskSkillSet = $taskSkillNames->toArray();
        $totalSkillNamesCollection = collect(Skill::all()->pluck('name')->toArray());
        $userSkillsAgainstTotal = $totalSkillNamesCollection->map(fn($skill) => in_array($skill, $userSkillSet) ? 1 : 0);

        // Create binary arrays
        $userSkillsBinary = $allSkillNames->map(fn($skill) => in_array($skill, $userSkillSet) ? 1 : 0);
        $taskSkillsBinary = $allSkillNames->map(fn($skill) => in_array($skill, $taskSkillSet) ? 1 : 0);

            return inertia('User/Me',[
                'user'=> new UserCrudResource($user),
                'userReport' => $user,
                'userRoles'=>$userRoles,
                'viewedUserRoles'=>$viewedUserRoles,
                'analytics' => [
                    'totalTasks' => $totalTasks,
                    'tasksCompleted' => $tasksCompleted,
                    'tasksPending' => $tasksPending,
                    'tasksInProgress' => $tasksInProgress,
                    'tasksSentForApproval' => $tasksSentForApproval,
                    'avgCompletionTime' => round($avgCompletionTime, 2),
                ],
                'heatmapActivity' => $activityDates,
                // NEW: radar chart props
                'skillRadar' => [
                'labels' => $allSkillNames,
                'userSkills' => $userSkillsBinary,
                'taskSkills' => $taskSkillsBinary,
                'totalSkillNames' => $totalSkillNamesCollection,
                'userSkillsAgainstTotal' => $userSkillsAgainstTotal,
                ],
                'workloadGauge' => [
                    'userTaskCount' => $activeTasks,
                    'averageTaskCount' => round($averageTasksPerUser, 2),
                    'maxTaskCount' => $maxTasksAssigned,
                ],
            ]);
    }
    

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $user)
    {
        return inertia('User/Edit', [
            'user'=>new UserCrudResource($user),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateUserRequest $request, User $user)
    {
        $name = $user->name;
        $data = $request->validated();
        
        $password = $data['password'] ?? null;
        if($password){
            $data['password'] = bcrypt($password);
        }else{
            unset($data['password']);
        }
        $user->update($data);
        
        $user->update($data);
        return to_route('user.index')->with('success', "User \"$name\" Updated Sucessfully!");
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        $name = $user->name;
        $user->delete();
       
        return to_route('user.index')->with('success', "User \"$name\" Deleted.");
    }
    public function myTeam(){
        $currentUser = auth()->user();
    
        // Get the project IDs where the current user has tasks
        $projectIds = Task::where('assigned_user_id', $currentUser->id)->pluck('project_id');
    
        // Get the users assigned to tasks within those projects, excluding the current user
        $query = User::whereHas('tasks', function ($query) use ($projectIds, $currentUser) {
            $query->whereIn('project_id', $projectIds)
                ->where('assigned_user_id', '!=', $currentUser->id);
        });
    
        // Apply search filters
        if(request("name")){
            $query->where("name", "like", "%". request("name"). "%");
        }
    
        if(request("email")){
            $query->where("email", "like", "%". request("email"). "%");
        }
    
        // Apply pagination
        $users = $query->paginate(10)->onEachSide(1);
    
        $userRoles = auth()->user()->roles()->pluck('name')->toArray();
        return Inertia::render('User/Index', [
            'users' => UserCrudResource::collection($users),
            'queryParams' => request()->query() ?: null,
            'success' => session('success'),
            'pageType' => 'myTeam',
            'userRoles' => $userRoles,
        ]);
    }
    

    public function assignRole(Request $request, User $user)
    {
        \Log::info('Assign Role Request:', $request->all()); // 🛠 Debugging

        $validated = $request->validate([
            'role' => 'required|string|exists:roles,name',
        ]);

        $role = Role::where('name', $validated['role'])->firstOrFail();
        $user->roles()->syncWithoutDetaching([$role->id]);

        return to_route('user.index')->with('success', 'Role ' .$role->name. ' assigned to '. $user->name. ' successfully.');
    }

     function detachRole(Request $request, User $user)
    {
        $roleId = $request->input('role_id');
        $user->roles()->detach($roleId);

        return back()->with('success', 'Role revoked successfully.');
    }


    

}
