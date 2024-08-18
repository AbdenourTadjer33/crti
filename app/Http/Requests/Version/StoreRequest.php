<?php

namespace App\Http\Requests\Version;

use Carbon\Carbon;
use Tiptap\Editor;
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

    protected function prepareForValidation()
    {
        $editor = new Editor;

        $description = $this->input('description');
        $goals       = $this->input('goals');
        $methodology = $this->input('methodology');

        $this->merge([
            '_description' => $description,
            '_goals'       => $goals,
            '_methodology' => $methodology,
            'description'  => $description ? $editor->setContent($description)->getText() : $description,
            'goals'        => $goals       ? $editor->setContent($goals)->getText()       : $goals,
            'methodology'  => $methodology ? $editor->setContent($methodology)->getText() : $methodology,
        ]);
    }

    protected function passedValidation(): void
    {
        $this->replace($this->except(['_description', '_goals', '_methodology', 'description', 'goals', 'methodology']) + [
            'description' => $this->input('_description'),
            'goals' => $this->input('_goals'),
            'methodology' => $this->input('_methodology'),
        ]);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'min:6', 'max:100'],
            'nature' => ['required', 'string'],
            'description' => ['required', 'string', 'min:50'],
            'goals' => ['required', 'string', 'min:50'],
            'methodology' => ['required', 'string', 'min:50'],

            'domains' => ['required', 'array', 'min:2', 'max:6'],
            'domains.*' => ['required', 'string'],

            'timeline' => ['required', 'array'],
            'timeline.from' => ['required', 'date'],
            'timeline.to' => ['required', 'date'],

            'is_partner' => ['required', 'boolean'],

            'partner.name' => ['exclude_if:is_partner,false', 'required', 'string'],
            'partner.email' => ['exclude_if:is_partner,false', 'required', 'string', 'email'],
            'partner.phone' => ['exclude_if:is_partner,false', 'required', 'string', 'min:10'],

            'members' => ['required', 'array', 'min:4', 'max:8'],
            'members.*' => ['required', 'array'],
            'members.*.uuid' => ['required', 'string', Rule::exists('users', 'uuid')],

            // 'resources' => ['required', 'array'],
            // 'resources.*.name' => ['required', 'string'],

            'resources_crti' => ['required', 'array'],
            'resources_crti.*' => ['required', 'array'],
            'resources_crti.*.name' => ['required', 'string'],
            'resources_crti.*.description' => ['nullable', 'string'],
            'resources_crti.*.price' => ['required', 'numeric'],

            // 'resource_partner' => ['exclude_if:is_partner,false', 'required', 'array'],
            // 'resource_partner.*' => ['exclude_if:is_partner,false', 'required', 'array'],

            'tasks' => ['required', 'array', 'min:3', 'max:20'],
            'tasks.*' => ['required', 'array'],
            'tasks.*.name' => ['required', 'string'],
            'tasks.*.description' => ['required', 'string'],
            'tasks.*.users' => ['required', 'array', 'min:1', 'max:5'],
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
