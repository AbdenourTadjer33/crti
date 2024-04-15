<?php

namespace Modules\Permission\Http\Requests\Permission;

use Illuminate\Validation\Rule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'model' => ['nullable', 'string'],
            'action' => ['nullable', Rule::in(['create', 'edit', 'read', 'delete'])]
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
