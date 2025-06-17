<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Models\Task;

class UpdateProjectRequest extends FormRequest
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
        return [
            'image' => ['nullable', 'image'],
            'name' => ['required', 'max:255'],
            'description' => ['nullable', 'string'],
            'due_date' => ['nullable', 'date', 'after_or_equal:today'],
            'status' => ['required', 'in:pending,in_progress,completed'],
        ];
    }

    /**
     * Add additional validation logic.
     */
    protected function withValidator($validator)
    {
        $validator->after(function ($validator) {
            if ($this->input('status') === 'completed') {
                $incompleteTasksCount = Task::where('project_id', $this->route('project')->id)
                    ->whereIn('status', ['pending', 'in_progress'])
                    ->count();
                
                if ($incompleteTasksCount > 0) {
                    $validator->errors()->add('status', 'Cannot mark project as completed with pending or in-progress tasks.');
                }
            }
        });
    }

    /**
     * Get the custom validation messages.
     */
    public function messages(): array
    {
        return [
            'due_date.after_or_equal' => 'The due date cannot be in the past. Please select a future or current date.',
            'status.in' => 'Invalid status selected. Allowed values: pending, in_progress, completed.',
            'status.required' => 'Project status is required.',
        ];
    }
}
