<?php

namespace App\Http\Requests;

use Illuminate\Validation\Rule;
use Illuminate\Foundation\Http\FormRequest;
use App\Models\Project;

class StoreTaskRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $project = Project::find($this->project_id);

        $dueDateRules = ['required', 'date', 'after_or_equal:today'];

        if ($project) {
            $dueDateRules[] = 'after_or_equal:' . $project->created_at;
            $dueDateRules[] = 'before_or_equal:' . $project->due_date;
        }

        return [
            'project_id' => ['required', 'exists:projects,id'],
            'assigned_user_id' => ['required', 'exists:users,id'],
            'image' => ['nullable', 'image'],
            'name' => ['required', 'max:255'],
            'description' => ['nullable', 'string'],
            'due_date' => $dueDateRules,
            'status' => ['required', Rule::in(['pending', 'in_progress', 'send_for_approval', 'completed'])],
            'priority' => ['required', Rule::in(['low', 'medium', 'high'])],
            'skill_ids' => ['nullable', 'array'],
            'skill_ids.*' => ['exists:skills,id'],
        ];
    }


    /**
     * Custom error messages for validation.
     */
    public function messages(): array
    {
        return [
            'due_date.after_or_equal' => 'The due date must be today or later and within the project’s date range.',
            'due_date.before_or_equal' => 'The due date cannot exceed the project deadline.',
        ];
    }
}
