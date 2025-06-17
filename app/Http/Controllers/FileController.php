<?php
namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\File;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class FileController extends Controller
{
    public function upload(Request $request)
    {
        $request->validate([
            'task_id' => 'required|exists:tasks,id',
            'files.*' => 'required|file|max:2048|mimes:jpg,jpeg,png,pdf,docx,txt,odt',
        ]);

        $task = Task::findOrFail($request->task_id);

        foreach ($request->file('files') as $file) {
            $path = $file->store("tasks/{$task->id}", 'public');

            File::create([
                'task_id' => $task->id,
                'file_name' => $file->getClientOriginalName(),
                'file_path' => $path,
                'uploaded_by' => auth()->id(),
            ]);
        }

        return back()->with('success', 'Files uploaded successfully!');
    }

    public function delete(File $file)
    {
        // Check if the authenticated user is allowed to delete this file
        if (auth()->id() !== $file->uploaded_by) {
            abort(403, 'Unauthorized to delete this file!');
        }

        // Delete the file from storage
        Storage::disk('public')->delete($file->file_path);

        // Delete the file record from the database
        $file->delete();

        return back()->with('success', 'File deleted successfully!');
    }

    
}
