<?php

namespace App\Http\Requests\Manage\Unit;

use Illuminate\Foundation\Http\FormRequest;

class StoreRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string',],
            'abbr' => ['required', 'string'],
            'description' => ['required', 'string'],
            'address' => ['required', 'string'],
            // 'city' => ['required', 'string'],
            // 'country' => ['required', 'string'],

            // 'divisions' => ['nullable', 'array'],
            // 'divisions.*' => ['sometimes', 'required', 'array'],
            // 'divisions.*.name' => ['sometimes', 'required', 'string'],
            // 'divisions.*.description' => ['nullable', 'string'],
            // 'divisions.*.members' => ['nullable', 'array'],
            // 'divisions.*.members.*' => ['sometimes', 'required', 'array'],
            // 'divisions.*.members.*.uuid' => ['sometimes', 'required', 'string'],
            // 'divisions.*.members.*.grade' => ['sometimes', 'required', 'string'],

            // 'infrastructures' => ['nullable', 'array'],
            // 'infrastructures.*' => ['sometimes', 'required', 'array'],
            // 'infrastructures.*.name' => ['sometimes', 'required', 'string'],
            // 'infrastructures.*.descrption' => ['sometimes', 'required', 'string'],

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
