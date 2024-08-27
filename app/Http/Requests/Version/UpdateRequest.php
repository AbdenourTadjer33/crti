<?php

namespace App\Http\Requests\Version;

use Tiptap\Editor;
use Illuminate\Validation\Rule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateRequest extends FormRequest
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
            'tasks' => collect($this->input('tasks'))->map(function ($task) use ($editor) {
                $description = $task['description'];
                return [
                    ...$task,
                    '_description' => $description,
                    'description' => $description ? $editor->setContent($description)->getText() : $description,

                ];
            })->toArray(),
        ]);
    }

    protected function passedValidation(): void
    {
        $this->replace($this->except(['_description', '_goals', '_methodology', 'description', 'goals', 'methodology', 'resources_crti', 'resources_partner', 'tasks']) + [
            'resources_crti' => collect($this->input('resources_crti'))->map(fn($resource) => array_merge($resource, ["by_crti" => true]))->toArray(),
            'resources_partner' => collect($this->input('resources_partner'))->map(fn($resource) => array_merge($resource, ["by_crti" => false]))->toArray(),
            'description' => $this->input('_description'),
            'goals' => $this->input('_goals'),
            'methodology' => $this->input('_methodology'),
            'tasks' => collect($this->input('tasks'))->map(function ($task) {
                $description = $task['_description'];
                unset($task['_description']);
                return [
                    ...$task,
                    'description' => $description,
                ];
            })->toArray(),
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
            'description' => ['required', 'string', 'min:50'],
            'goals' => ['required', 'string', 'min:50'],
            'methodology' => ['required', 'string', 'min:50'],

            'nature' => ['required', 'string', Rule::exists('natures', 'id')],

            'domains' => ['required', 'array', 'min:2', 'max:5'],
            'domains.*' => ['required', 'string', Rule::exists('domains', 'id')],

            'timeline' => ['required', 'array'],
            'timeline.from' => ['required', 'date'],
            'timeline.to' => ['required', 'date'],

            'is_partner' => ['required', 'boolean'],

            'partner.organisation' => ['exclude_if:is_partner,false', 'required', 'string'],
            'partner.sector' => ['exclude_if:is_partner,false', 'required', 'string'],
            'partner.contact_name' => ['exclude_if:is_partner,false', 'required', 'string'],
            'partner.contact_post' => ['exclude_if:is_partner,false', 'required', 'string'],
            'partner.contact_email' => ['exclude_if:is_partner,false', 'required', 'string', 'email'],
            'partner.contact_phone' => ['exclude_if:is_partner,false', 'required', 'string', 'max:10'],

            'deliverables' => ['required', 'array', 'min:1', 'max:6'],
            'deliverables.*' => ['required', 'string'],

            'estimated_amount' => ['required', 'numeric'],

            'members' => ['required', 'array', 'min:2', 'max:8'],
            'members.*' => ['required', 'array'],
            'members.*.uuid' => ['required', 'string', Rule::exists('users', 'uuid')],

            'resources' => ['nullable', 'array'],
            'resources.*.code' => ['required', 'string'],

            'resources_crti' => ['nullable', 'array'],
            'resources_crti.*' => ['nullable', 'array'],
            'resources_crti.*.name' => ['required', 'string'],
            'resources_crti.*.description' => ['nullable', 'string'],
            'resources_crti.*.price' => ['required', 'numeric'],

            'resources_partner' => ['exclude_if:is_partner,false', 'nullable', 'array'],
            'resources_partner.*' => ['exclude_if:is_partner,false', 'nullable', 'array'],
            'resources_partner.*.name' => ['required', 'string'],
            'resources_partner.*.description' => ['nullable', 'string'],
            'resources_partner.*.price' => ['required', 'numeric'],

            'tasks' => ['required', 'array', 'min:2', 'max:20'],
            'tasks.*' => ['required', 'array'],
            'tasks.*.name' => ['required', 'string'],
            'tasks.*.description' => ['required', 'string'],
            'tasks.*.users' => ['required', 'array', 'min:1'],
            'tasks.*.priority' => ['required', 'string'],
            'tasks.*.timeline' => ['required', 'array:from,to'],
            'tasks.*.timeline.from' => ['required', 'date'],
            'tasks.*.timeline.to' => ['required', 'date'],
        ];
    }
}
