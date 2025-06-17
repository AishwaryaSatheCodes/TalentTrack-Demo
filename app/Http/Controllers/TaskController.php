<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\DB;

use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

use App\Http\Requests\StoreTaskRequest;
use App\Http\Requests\UpdateTaskRequest;

use App\Services\SkillMatchingService;

use App\Models\Task;
use App\Models\User;
use App\Models\Project;
use App\Models\Skill;
use Illuminate\Validation\Rule;


use App\Http\Resources\TaskResource;
use App\Http\Resources\UserResource;
use App\Http\Resources\ProjectResource;
use App\Http\Resources\SkillResource;
use App\Policies\TaskPolicy;

class TaskController extends BaseController
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        
        //Sorting tasks by status
        $query = Task::query();

        $sortField = request("sort_field", 'created_at');
        $sortDirection = request("sort_direction", 'desc');

        if(request("name")){
            $query->where("name", "like", "%". request("name"). "%");
        }
        if(request("status")){
            $query->where("status", request("status"));
        }
        if(request("priority")){
            $query->where("priority", request("priority"));
        }

        //Pagination
        $tasks = $query->orderBy($sortField, $sortDirection)
        ->paginate(10)->onEachSide(1);
        $userRoles = auth()->user()->roles()->pluck('name')->toArray();
        return inertia("Task/Index",[

            'tasks' => TaskResource::collection($tasks),
            'queryParams' => request()->query() ?: null,
            'success' =>session('success'),
            'pageType' => 'all',
            'userRole' => $userRoles,
            
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $projects = Project::query()->orderBy('name', 'desc')->get();
        $users = User::query()->orderBy('name', 'asc')->get();
        $skills = Skill::all();
    
        $requiredSkills = []; // Empty by default unless you want to pre-fill
        $usersWithCompatibility = $this->skillMatchingService->getUsersWithCompatibility($requiredSkills);
    
        return inertia("Task/Create", [
            'projects' => ProjectResource::collection($projects),
            'users' => UserResource::collection($users),
            'skills' => SkillResource::collection($skills),
            'usersWithCompatibility' => $usersWithCompatibility,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTaskRequest $request)
    {
        $data = $request->validated();
        $image = $request->file('image');
        $data['created_by'] = Auth::id();
        $data['updated_by'] = Auth::id();
        $data['send_for_approval_date'] = null;
        $data['completion_date'] = null;
    
        if ($image) {
            $imagePath = $image->store('task/' . Str::random(10), 'public');
            $data['image_path'] = $imagePath;
        }
    
        // Remove skill_ids from $data if it's in there
        $skillIds = $data['skill_ids'] ?? [];
        unset($data['skill_ids']);
    
        $task = Task::create($data);
    
        // Attach selected skills
        if (!empty($skillIds)) {
            $task->skills()->attach($skillIds);
        }
    
        return to_route('task.index')->with('success', 'Task ' . $data['name'] . ' Created Successfully!');
    }
    

    /**
     * Display the specified resource.
     */
    public function show(Task $task)
    {
        //From TaskPolicy.php, check whether the user is assigned to this task - view.
        $this->authorize('view',$task);
        $userRoles = auth()->user()->roles()->pluck('name')->toArray();
        $files = $task->files;
        
        return inertia('Task/Show',[
            'task'=> new TaskResource($task->load('skills')),
            'userRole' => $userRoles,
            'files'=>$files,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Task $task)
    {
        $this->authorize('view', $task);
    
        $projects = Project::query()->orderBy('name', 'desc')->get();
        $users = User::query()->orderBy('name', 'asc')->get();
        $taskStatus = $task->status;
        $skills = Skill::all();
    
        // Fetch required skills for the task
        $requiredSkills = $task->skills()->pluck('name')->toArray();
    
        // Get compatibility scores for all users
        $usersWithCompatibility = $this->skillMatchingService->getUsersWithCompatibility($requiredSkills);
    
        return inertia('Task/Edit', [
            'task' => new TaskResource($task->load('skills')),
            'projects' => ProjectResource::collection($projects),
            'users' => UserResource::collection($users),
            'taskStatus' => $taskStatus,
            'skills' => SkillResource::collection($skills),
            'usersWithCompatibility' => $usersWithCompatibility, // <- this is key
        ]);
    }
    

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTaskRequest $request, Task $task)
    {
        $user = $request->user();
        $userRoles = $user->roles()->pluck('name')->toArray();

        if (in_array('development', $userRoles) && !in_array('management', $userRoles)) {
            // Developer can only mark as 'send_for_approval'
            $data = $request->validated();
            $skillIds = $request->input('skill_ids', []);
        
            if ($data['status'] === 'send_for_approval' && $task->status !== 'send_for_approval') {
                $task->send_for_approval_date = now();
            }
        } else {
                // Management Role: Update all fields
                $data = $request->validated();
                $skillIds = $request->input('skill_ids', []);
            
                // Ensure completion_date if marked as completed
                if ($data['status'] === 'completed' && $task->status !== 'completed') {
                    if (!$task->send_for_approval_date) {
                        return redirect()->back()->withErrors('Task cannot be marked as completed without approval.');
                    }
                    $data['completion_date'] = $task->send_for_approval_date;
                } elseif ($data['status'] === 'send_for_approval' && !$task->send_for_approval_date) {
                    $data['send_for_approval_date'] = now();
                } else {
                    // Prevent overwriting if status isn't completed
                    unset($data['send_for_approval_date']);
                    unset($data['completion_date']);
                }
            
                // Image Handling
                if ($request->hasFile('image')) {
                    if ($task->image_path && Storage::disk('public')->exists($task->image_path)) {
                        Storage::disk('public')->delete($task->image_path);
                    }
                    $data['image_path'] = $request->file('image')->store('task/' . Str::random(10), 'public');
            }
    }
    
    // Update Task
    $task->update($data);
    $task->skills()->sync($skillIds);
    
    return in_array('management', $userRoles)
        ? redirect()->route('task.index')->with('success', 'Task updated successfully')
        : redirect()->route('task.myTasks')->with('success', 'Task updated successfully');
    
    }
    

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Task $task)
    {
        $name = $task->name;
        $task->delete();
        if($task->image_path){
            Storage::disk('public')->delete(dirname($task->image_path));
        }
        return to_route('task.index')->with('success', "Task \"$name\" Deleted.");
    }

    public function myTasks()
    {
        
        $user = auth()->user();
        $query = Task::query()->where('assigned_user_id', $user->id);

        $sortField = request("sort_field", 'created_at');
        $sortDirection = request("sort_direction", 'desc');

        if(request("name")){
            $query->where("name", "like", "%". request("name"). "%");
        }
        if(request("status")){
            $query->where("status", request("status"));
        }
        if(request("priority")){
            $query->where("priority", request("priority"));
        }

        //Pagination
        $tasks = $query->orderBy($sortField, $sortDirection)
        ->paginate(10)->onEachSide(1);
        $userRoles = auth()->user()->roles()->pluck('name')->toArray();
        //dd($userRoles);
        
        return inertia("Task/Index",[

            'tasks' => TaskResource::collection($tasks),
            'queryParams' => request()->query() ?: null,
            'success' =>session('success'),
            'pageType' => 'myTasks',
            'userRole' => $userRoles, // Ensures role names are fetched 
        ]);
    }

    public function completedTasksOverTime()
    {
        $tasks = Task::select(
            DB::raw('DATE(completion_date) as date'),
            DB::raw('count(*) as total')
        )
        ->whereNotNull('completion_date')
        ->where('assigned_user_id', auth()->user()->id) // Only fetch tasks for the authenticated user
        ->groupBy('date')
        ->orderBy('date', 'asc')
        ->get();

        return response()->json($tasks);
    }

    protected $skillMatchingService;

    public function __construct(SkillMatchingService $skillMatchingService)
    {
        $this->skillMatchingService = $skillMatchingService;
    }

    public function assignTask(Request $request, Task $task)
    {
        // Get the required skills for the task (could be task's skill requirement field)
        $requiredSkills = $task->skills()->pluck('name')->toArray();

        // Get users with their compatibility scores
        $usersWithCompatibility = $this->skillMatchingService->getUsersWithCompatibility($requiredSkills);

        return Inertia('Task/Create', [
            'task' => $task,
            'usersWithCompatibility' => $usersWithCompatibility,
        ]);
    }
}

