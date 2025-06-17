<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreProjectRequest;
use App\Http\Requests\UpdateProjectRequest;
use App\Models\Project;
use App\Models\Task;
use App\Models\User;
use Carbon\Carbon;
use App\Http\Resources\ProjectResource;
use App\Http\Resources\TaskResource;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class ProjectController extends BaseController
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $sortField = request("sort_field", 'created_at');
        $sortDirection = request("sort_direction", 'desc');

        // Filters
        $filters = [
            'name' => request("name"),
            'status' => request("status"),
        ];

        // Query for all (non-completed) projects
        $query = Project::query();
        if ($filters['name']) {
            $query->where("name", "like", "%" . $filters['name'] . "%");
        }
        if ($filters['status']) {
            $query->where("status", $filters['status']);
        } else {
            $query->where("status", '!=', 'completed'); // default: exclude archived
        }

        $projects = $query->orderBy($sortField, $sortDirection)
                        ->paginate(10)->onEachSide(1);

        // Separate query for archived projects
        $archivedQuery = Project::query()->where('status', 'completed');
        if ($filters['name']) {
            $archivedQuery->where("name", "like", "%" . $filters['name'] . "%");
        }

        $archivedProjects = $archivedQuery->orderBy($sortField, $sortDirection)
                                        ->paginate(10)->onEachSide(1);

        return inertia("Project/Index", [
            'projects' => ProjectResource::collection($projects),
            'archivedProjects' => ProjectResource::collection($archivedProjects),
            'queryParams' => request()->query() ?: null,
            'success' => session('success'),
            'pageType' => 'all',
        ]);
    }


    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
        return inertia("Project/Create");
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreProjectRequest $request)
    {
        $data = $request->validated();
        $image = $request->file('image');  // Get the uploaded image
        $data['created_by'] = Auth::id();
        $data['updated_by'] = Auth::id();
    
        if ($image) {
            // Store the image and save the path to 'image_path' in the data array
            $imagePath = $image->store('project/' . Str::random(10), 'public');
            $data['image_path'] = $imagePath;
        }
    
        // Create the project with the data
        Project::create($data);
    
        return to_route('project.index')->with('success', 'Project ' . $data['name'] . ' Created Successfully!');
    }
    

    /**
     * Display the specified resource.
     */
    public function show(Project $project)
    {
        $query = $project->tasks();

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

        $tasks = $query->orderBy($sortField, $sortDirection)->paginate(10)->onEachSide(1);
        $userRoles = auth()->user()->roles()->pluck('name')->toArray();


        // For Gantt Chart (without pagination)
        $tasksGantt = $project->tasks()->get()->map(function ($task) {
            return [
                'id' => $task->id,
                'name' => $task->name,
                'start' => Carbon::parse($task->created_at)->toISOString(),
                'end' => Carbon::parse($task->due_date)->toISOString(),
                'status' => $task->status,
            ];
        });

        $tasksUsers = $project->tasks()->with('assignedUser')->get();

        // Get unique users assigned to tasks
        $userIds = $tasksUsers->pluck('assigned_user_id')->unique();
        $users = User::whereIn('id', $userIds)->get();

        return inertia('Project/Show',[
            'project'=> new ProjectResource($project),
            'tasks' => TaskResource::collection($tasks),
            'queryParams' => request()->query() ?: null,
            'userRole' => $userRoles,
            'projectGantt' => $project,
            'tasksGantt' => $tasksGantt,
            'users' => $users,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Project $project)
    {
        return inertia('Project/Edit', [
            'project'=>new ProjectResource($project),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProjectRequest $request, Project $project)
{
    $name = $project->name;
    $data = $request->validated();

    // Check if an image was uploaded
    if ($request->hasFile('image')) {
        // Delete the old image if it exists
        if ($project->image_path) {
            Storage::disk('public')->delete($project->image_path);
        }

        // Store the new image and save the path to 'image_path' in the data array
        $imagePath = $request->file('image')->store('project/' . Str::random(10), 'public');
        $data['image_path'] = $imagePath;
    }

    // Update the project data
    $project->update($data);

    return to_route('project.index')->with('success', "Project \"$name\" Updated Successfully!");
}


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Project $project)
    {
        $name = $project->name;
        $project->delete();
        if($project->image_path){
            Storage::disk('public')->delete(dirname($project->image_path));
        }
        return to_route('project.index')->with('success', "Project \"$name\" Deleted.");
    }

    public function myProjects()
    {
        $user = auth()->user();
    
        // Filters
        $filters = [
            'name' => request("name"),
            'status' => request("status"),
            'archived' => request("archived"),
        ];
    
        $sortField = request("sort_field", 'created_at');
        $sortDirection = request("sort_direction", 'desc');
    
        // Shared base query: projects where user is assigned to tasks
        $query = Project::whereHas('tasks', function ($taskQuery) use ($user) {
            $taskQuery->where('assigned_user_id', $user->id);
        });
    
        // Apply filters
        if ($filters['name']) {
            $query->where("name", "like", "%" . $filters['name'] . "%");
        }
    
        // Handle the status filter for non-archived projects
        if ($filters['archived']) {
            $query->where("status", "completed");
        } elseif ($filters['status']) {
            $query->where("status", $filters['status']);
        } else {
            $query->where("status", "!=", "completed");
        }
    
        // Fetch non-archived projects
        $projects = $query->with('createdBy')
                          ->orderBy($sortField, $sortDirection)
                          ->paginate(10)
                          ->onEachSide(1);
    
        // Fetch archived projects (status = completed) with pagination
        $archivedProjects = Project::whereHas('tasks', function ($taskQuery) use ($user) {
            $taskQuery->where('assigned_user_id', $user->id);
        })
        ->where("status", "completed")
        ->with('createdBy')
        ->orderBy($sortField, $sortDirection)
        ->paginate(10)
        ->onEachSide(1);
    
        return inertia("Project/Index", [
            'projects' => ProjectResource::collection($projects),
            'archivedProjects' => ProjectResource::collection($archivedProjects), // Pass paginated archived projects
            'queryParams' => request()->query() ?: null,
            'success' => session('success'),
            'pageType' => 'myProjects',
            'userRole' => $user->roles()->pluck('name')->toArray(),
        ]);
    }
    

    public function myGanttChart(Project $project)
    {
        $tasks = $project->tasks->map(function ($task) {
            return [
                'id' => $task->id,
                'name' => $task->name,
                'start' => Carbon::parse($task->created_at)->toISOString(),
                'end' => Carbon::parse($task->due_date)->toISOString(),
                'status' => $task->status,
            ];
        });

        return inertia('Project/GanttChart', [
            'project' => $project,
            'tasks' => $tasks,
        ]);
    }
    
}
