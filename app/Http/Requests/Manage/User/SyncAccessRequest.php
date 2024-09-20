<?php

namespace App\Http\Requests\Manage\User;

use Illuminate\Foundation\Http\FormRequest;

class SyncAccessRequest extends FormRequest
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
        $this->merge([
            'roles' => array_map(fn($p) => $p['id'], $this->input('permissions')),
            'permissions' => array_map(fn($r) => $r['id'], $this->input('roles')),
        ]);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [];
    }
}
