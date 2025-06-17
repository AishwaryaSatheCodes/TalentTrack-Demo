<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Task;

class TaskPolicy
{
    /**
     * Create a new policy instance.
     */
    public function __construct()
    {
        
    }
    public function view(User $user, Task $task)
    {
        $roles = $user->roles()->pluck('name')->toArray();
        if(in_array('management',$roles)){
            return true;
        }else{
            return $user->id === $task->assigned_user_id;
        }
        
    }


}
