<?php

namespace App\Models;
use App\Observers\TaskObserver; //Observe the Task model and set project status != completed depending on tasks associated with it.

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Project;
use App\Models\User;
use App\Models\File;

class Task extends Model
{
    /** @use HasFactory<\Database\Factories\TaskFactory> */
    use HasFactory;
    protected $fillable = [
        'name', 
        'description', 
        'image_path', 
        'priority', 
        'status', 
        'due_date', 
        'assigned_user_id',
        'created_by', 
        'updated_by',
        'project_id',
        'send_for_approval_date',
        'completion_date',
        'comments',
    ];

    public function project(){

        return $this->belongsTo(Project::class);
    }

    public function assignedUser(){

        return $this->belongsTo(User::class, 'assigned_user_id');
    }

    public function createdBy(){

        return $this->belongsTo(User::class, 'created_by');
    }

    public function updatedBy(){

        return $this->belongsTo(User::class, 'updated_by');
    }

    public function files()
    {
        return $this->hasMany(File::class);
    }

    public function skills()
    {
        return $this->belongsToMany(Skill::class, 'skill_task');
    }
    
    protected static function booted()
    {
        static::observe(TaskObserver::class);
    }

}
