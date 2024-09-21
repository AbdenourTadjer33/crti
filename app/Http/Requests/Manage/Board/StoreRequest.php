<?php

namespace App\Http\Requests\Manage\Board;

use App\Models\Project;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;

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

            'members' => ['required', 'array'],
            'members.*' => ['required', 'array'],
            'members.*.uuid' => ['required', 'string', Rule::exists('users', 'uuid')],
        ];
    }
}
