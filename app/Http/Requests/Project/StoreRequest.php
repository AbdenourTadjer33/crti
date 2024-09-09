<?php

namespace App\Http\Requests\Project;

use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Gate;
use Illuminate\Foundation\Http\FormRequest;

class StoreRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {

        return Gate::check('create.projects');
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'division' => ['required', Rule::exists('divisions', 'id')],
        ];
    }

    public function messages()
    {
        return [
            'division' => "sélectionnez une division"
        ];
    }
}
