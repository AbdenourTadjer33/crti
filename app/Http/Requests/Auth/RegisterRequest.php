<?php

namespace App\Http\Requests\Auth;

use App\Rules\EmailSchema;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;
use Illuminate\Foundation\Http\FormRequest;

class RegisterRequest extends FormRequest
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
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'firstName' => ['required', 'string'],
            'lastName' => ['required', 'string'],
            'dob' => ['required', 'date', 'before_or_equal:' . now()->subYears(config('app.params.minimum_age', 20))->format('Y-m-d')],
            'sex' => ['required', 'string'],
            'email' => ['required', 'email', new EmailSchema() ,Rule::unique('users', 'email')],
            'password' => ['required', Password::defaults()],
        ];
    }
}
