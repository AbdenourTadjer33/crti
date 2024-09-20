<?php

namespace App\Http\Requests\Manage\Division;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class AttachUsersRequest extends FormRequest
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
            'users' => ['required', 'array', 'min:1'],
            'users.*' => ['required', 'array'],
            'users.*.uuid' => ['required', 'uuid', Rule::exists('users', 'uuid')],
            'users.*.grade' => ['required', Rule::exists('division_grades', 'id')],
        ];
    }

    public function attributes()
    {
        return [
            'users.*.grade' => 'grade',
        ];
    }
}
