<?php

namespace Modules\Permission\Http\Requests\Permission;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Modules\Permission\Enums\PermissionType;

class StoreRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }
    
    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'model' => ['required', 'string'], 
            'action' => ['required', Rule::in(['create', 'edit', 'read', 'delete'])],
            'type' => ['required', Rule::enum(PermissionType::class)],
            'contexts' => [Rule::excludeIf(fn () => $this->input('type') != 1), 'array'],
            'contexts.*' => [Rule::excludeIf(fn () => $this->input('type') != 1), 'numeric'],
        ];
    }
}
