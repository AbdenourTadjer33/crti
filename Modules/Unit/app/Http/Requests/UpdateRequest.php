<?php

namespace Modules\Unit\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:30'],
            'code' => ['nullable'],
            'description' => ['nullable', 'string', 'max:250'],
            'address' => ['nullable', 'string', 'max:100'],
            'city' => ['nullable', 'string', 'max:15'],
            'country' => ['nullable', 'string', 'max:10'],
            'coordinates' => ['nullable']
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
