<?php

namespace App\Http\Requests\Manage\User;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreRequest extends FormRequest
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
            'last_name' => ['required', 'string'],
            'first_name' => ['required', 'string'],
            'email' => ['required', 'string', 'email'],
            'dob' => ['required', 'date'],
            'sex' => ['required', Rule::in(['male', 'female'])],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            'divisions' => ['nullable', 'array'],
            'divisions.*.id' => ['required', 'exists:divisions,id'],
            'divisions.*.grade' => ['nullable', 'string'],
            'boards' => ['nullable', 'array'],
            'boards.*' => ['exists:boards,id'],
            'unit_id' => ['nullable', Rule::exists('units', 'id')],
        ];
    }
}
