<?php

namespace Modules\ManageApp\Http\Requests\Unit;

use Illuminate\Foundation\Http\FormRequest;

class StoreRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'min:10'],
            'abbr' => ['nullable', 'string'],
            'description' => ['required', 'string'],
            'divisions' => ['required', 'array', 'min:1'],
            'divisions.*' => ['required', 'array'],
            'divisions.*.name' => ['required', 'string'],
            'divisions.*.description' => ['required', 'string']
        ];
    }

    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }
}
