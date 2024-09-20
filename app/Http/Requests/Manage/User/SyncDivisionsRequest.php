<?php

namespace App\Http\Requests\Manage\User;

use Illuminate\Foundation\Http\FormRequest;

class SyncDivisionsRequest extends FormRequest
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
            'divisions' => ['nullable', 'array'],
            'divisions.*' => ['required', 'array'],
            'divisions.*.division' => ['required'],
            'divisions.*.grade' => ['required'],
        ];
    }

    public function attributes()
    {
        return [
            'divisions.*.grade' => 'grade',
        ];
    }
}
