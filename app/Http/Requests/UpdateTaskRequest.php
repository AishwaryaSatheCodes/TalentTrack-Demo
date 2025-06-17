<?php

namespace App\Http\Requests;
use Illuminate\Validation\Rule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateTaskRequest extends FormRequest
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
            'project_id'=>['required','exists:projects,id'],
            'assigned_user_id'=>['required','exists:users,id'],
            'image'=> ['nullable', 'image'],
            "name"=>['required','max:255'],
            'description'=>['nullable','string'],
            'due_date'=>['nullable', 'date'],
            'comments' => ['nullable', 'string'],
            'status'=>['required', Rule::in(['pending', 'in_progress','send_for_approval','completed'])],
            'priority'=>['required', Rule::in(['low', 'medium','high'])],
            'skill_ids' => ['nullable', 'array'],
            'skill_ids.*' => ['exists:skills,id'],
        ];
    }
}
