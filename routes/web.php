<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\FileController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\SkillController;
use App\Http\Controllers\SkillMatchingController;


Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/features', [HomeController::class, 'features'])->name('features');

Route::post('/skills/matching-users', [SkillMatchingController::class, 'matchUsers'])
    ->middleware(['auth'])
    ->name('skills.matching-users');
    
//🔹 AUTHENTICATED USERS WITH VERIFIED EMAILS
Route::middleware(['auth', 'verified'])->group(function () {
    //🔹 NO ROLES
    //Can View Dashboard (Displays MyTasks and Dashboard Tasks Counters).
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/project/{project}/gantt', [ProjectController::class, 'myGanttChart'])->name('project.gantt');
    Route::get('/task/completed-over-time', [TaskController::class, 'completedTasksOverTime']);
    Route::post('/task/file-upload', [FileController::class, 'upload'])->name('task.file.upload');
    Route::delete('/task/files/{file}', [FileController::class, 'delete'])->name('task.file.delete');

    //🔹 MANAGEMENT ROLE - Full access.
    Route::middleware('role:admin,management')->group(function () {
        //Can do anything they want to projects.
        Route::resource('project', ProjectController::class)->except(['show']);
        //And tasks.
        Route::resource('task', TaskController::class)->except(['show','edit','update']);
        //And users, too.
        Route::resource('user', UserController::class);
        
    });

    //🔹 DEVELOPMENT ROLE - More restrictions than management.
    Route::middleware('role:management,development')->group(function (){
        //Can see individual projects (via task.show links).
        Route::resource('project', ProjectController::class)->only(['show']);
        //Can see tasks list, individual tasks.
        Route::resource('task', TaskController::class)->only(['show','edit', 'update']);
        //Can View 'My Tasks' Page.
        Route::get('my-tasks', [TaskController::class, 'myTasks'])->name('task.myTasks');
        //Can view 'My Projects' Page.
        Route::get('my-projects', [ProjectController::class, 'myProjects'])->name('project.myProjects');
        //Can view 'My Team' Page (list of users assigned tasks associated to a common project).
        Route::get('/my-team', [UserController::class, 'myTeam'])->name('user.myTeam');

    });

    //🔹 SKILLS - Admin and Developers only.
        Route::middleware('role:admin,development')->group(function () {
            Route::post('/user/{user}/assign-role', [UserController::class, 'assignRole'])->name('user.assignRole');
            Route::post('/users/{user}/detach-role', [UserController::class, 'detachRole'])->name('user.detachRole');
            //🔹 Route to toggle skill for a user
            Route::get('/skills', [SkillController::class, 'index'])->name('skills.index');
            Route::post('/skills/toggle/{skill}', [SkillController::class, 'toggleSkill'])->name('skills.toggle');
        });

    //🔹 ADMIN RESTRICTED ROUTES - ONLY ADMIN CAN ADD/REMOVE SKILLS & ASSIGN/DETACH ROLES
        Route::middleware('role:admin')->group(function () {
            Route::post('/skills', [SkillController::class, 'store'])->name('skills.store');
            Route::delete('/skills/{skill}', [SkillController::class, 'destroy'])->name('skills.destroy');
        });
});

//🔹 USER PROFILE MANAGEMENT
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';