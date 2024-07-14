<?php

namespace Modules\Project\Http\Requests\Version;

use Illuminate\Validation\Rule;
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

    // protected function prepareForValidation()
    // {
        // $this->merge([
            // 'description' => $this->input('description'),
        // ]);
    // }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string'],
            'nature' => ['required', 'string'],
            'description' => ['required', 'string'],
            'goals' => ['required', 'string'],
            'methodology' => ['required', 'string'],

            'domains' => ['required', 'array', 'min:3', 'max:5'],
            'domains.*' => ['required', 'string'],

            'timeline' => ['required', 'array'],
            'timeline.from' => ['required'],
            'timeline.to' => ['required'],

            'is_partner' => ['required', 'boolean'],

            'partner.name' => ['exclude_if:is_partner,false', 'required', 'string'],
            'partner.email' => ['exclude_if:is_partner,false', 'required', 'string', 'email'],
            'partner.phone' => ['exclude_if:is_partner,false', 'required', 'string', 'min:10'],

            'members' => ['required', 'array', 'min:4', 'max:8'],
            'members.*' => ['required', 'array'],
            'members.*.uuid' => ['required', 'string', Rule::exists('users', 'uuid')],

            'resources' => ['required', 'array'],
            'resources.*.name' => ['required', 'string'],

            'resources_crti' => ['required', 'array'],
            'resources_crti.*' => ['required', 'array'],

            'resource_partner' => ['exclude_if:is_partner,false', 'required', 'array'],
            'resource_partner.*' => ['exclude_if:is_partner,false', 'required', 'array'],

            'tasks' => ['required', 'array', 'min:5', 'max:20'],
            'tasks.*' => ['required', 'array'],
            'tasks.*.name' => ['required', 'string'],
            'tasks.*.description' => ['required', 'string'],
            'tasks.*.users' => ['required', 'array', 'min:1', 'max:3'],
            'tasks.*.priority' => ['required', 'string'],
            'tasks.*.timeline' => ['required', 'array:from,to'],
            'tasks.*.timeline.from' => ['required', 'date'],
            'tasks.*.timeline.to' => ['required', 'date'],
        ];
    }

    public function attributes(): array
    {
        return [
            "members" => "member de l'équipe",
            'name' => "intetule de projet"
        ];
    }

    public function messages(): array
    {
        return [
            "members.required" => "Vous devez séléctionnez les members de projet.",
        ];
    }


}
