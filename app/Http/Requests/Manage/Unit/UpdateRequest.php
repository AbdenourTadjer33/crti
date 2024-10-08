<?php

namespace App\Http\Requests\Manage\Unit;

use Illuminate\Foundation\Http\FormRequest;

class UpdateRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string',],
            'abbr' => ['required', 'string'],
            'description' => ['nullable', 'string'],
            'address' => ['required', 'string'],
            'webpage' => ['nullable', 'url'],
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
