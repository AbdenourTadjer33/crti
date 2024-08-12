<?php

namespace App\Http\Requests\Version;

use Illuminate\Foundation\Http\FormRequest;

class DuplicateRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // we need first to check the permissions.
        // secondly we must check if the user have not other version that are in creation.
        return false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'reason' => ['required', 'string', 'min:50', 'max:300'],
        ];
    }
}
