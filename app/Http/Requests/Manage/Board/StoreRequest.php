<?php

namespace App\Http\Requests\Manage\Board;

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
            'judgment_period' => ['required', 'array'],
            'judgment_period.from' => ['required', 'date', 'after_or_equal:today'],
            'judgment_period.to' => ['required', 'date', 'after_or_equal:today'],

            'project' => ['required', Rule::exists('projects', 'code')],

            'president' => ['required', Rule::exists('users', 'uuid')],

            'members' => ['nullable', 'array'],
            'members.*' => ['nullable', 'array'],
            'members.*.uuid' => ['required', 'string', Rule::exists('users', 'uuid')],
        ];
    }
}
