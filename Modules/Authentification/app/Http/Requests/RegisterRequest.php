<?php

namespace Modules\Authentification\Http\Requests;

use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;
use Illuminate\Foundation\Http\FormRequest;

class RegisterRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        dd($this->all());
        return [
            'fname' => ['required', 'string'],
            'lname' => ['required', 'string'],
            'username' => ['required', 'email', Rule::unique('users', 'email')],
            'password' => ['required', Password::defaults()],
            'dob' => ['required', 'date'],
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
