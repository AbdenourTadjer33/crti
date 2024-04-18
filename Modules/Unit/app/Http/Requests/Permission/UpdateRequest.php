<?php

<<<<<<<< HEAD:Modules/Unit/app/Http/Requests/StoreRequest.php
namespace Modules\Unit\Http\Requests;

========
namespace Modules\Permission\Http\Requests\Permission;

use Illuminate\Validation\Rule;
>>>>>>>> f297048a9946a2b32fa76c522aa47e9f42c186be:Modules/Unit/app/Http/Requests/Permission/UpdateRequest.php
use Illuminate\Foundation\Http\FormRequest;

class UpdateRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
<<<<<<<< HEAD:Modules/Unit/app/Http/Requests/StoreRequest.php
            'name' => ['required', 'string', 'max:30'],
            'code' => ['nullable'],
            'description' => ['nullable'],
            'address' => ['nullable', 'string', 'max:100'],
            'city' => ['nullable', 'string', 'max:15'],
            'country' => ['nullable', 'string', 'max:10'],
            'coordinates' => ['nullable']
========
            'model' => ['nullable', 'string'],
            'action' => ['nullable', Rule::in(['create', 'edit', 'read', 'delete'])]
>>>>>>>> f297048a9946a2b32fa76c522aa47e9f42c186be:Modules/Unit/app/Http/Requests/Permission/UpdateRequest.php
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
