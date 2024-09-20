<?php

namespace App\Http\Requests\Manage\User;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

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
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'lastName' => ['required', 'string', 'min:2'],
            'firstName' => ['required', 'string', 'min:2'],
            'sex' => ['required', Rule::in(['male', 'female'])],
            'dob' => ['required', 'date'],
            'email' => ['required', 'string', 'email'],
            'password' => ['required', Password::defaults()],

            'title' => ['nullable', 'string', 'min:2'],

            'academicQualification' => ['nullable', 'array'],
            'academicQualification.*' => ['required', 'array'],
            'academicQualification.*.diploma' => ['required', 'string'],
            'academicQualification.*.university' => ['required', 'string'],
            'academicQualification.*.graduationDate' => ['required', 'date'],

            'greetingEmail' => ['required', 'boolean'],
            'accessPermission' => ['required', 'boolean'],
        ];
    }

    public function attributes()
    {
        return [
            'academicQualification.*.diploma' => 'diplôme',
            'academicQualification.*.university' => 'université',
            'academicQualification.*.graduationDate' => 'date d\'obtension',
        ];
    }
}
