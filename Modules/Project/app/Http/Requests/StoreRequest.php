<?php

namespace Modules\Project\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'tasks' => ['required', 'array', 'min:5'],
            'tasks.*' => ['required', 'array'],
            'tasks.*.name' => ['required', 'string'],
            'tasks.*.description' => ['required', 'string'],
            'tasks.*.user_uuid' => ['required', 'string'],
            'tasks.*.priority' => ['required', 'string'],
            'tasks.*.timeline' => ['required', 'array:from,to'],
            'tasks.*.timeline.from' => ['required'], 
            'tasks.*.timeline.to' => ['required'],
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
