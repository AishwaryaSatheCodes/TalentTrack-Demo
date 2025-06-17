<?php

namespace App\Models;
use App\Models\Uer;
use App\Models\Task;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;


class File extends Model
{
    use HasFactory;

    protected $table = 'task_files';
    protected $fillable = ['task_id', 'file_name', 'file_path', 'uploaded_by'];

    public function task()
    {
        return $this->belongsTo(Task::class);
    }

    public function uploader()
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }
}
