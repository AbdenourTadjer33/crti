<?php

namespace App\Http\Requests\Version;

use App\Models\Project;
use Illuminate\Foundation\Http\FormRequest;

class CreateRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     * here we must check if the user can create a new version for the project
     */
    public function authorize(): bool
    {
        return true;
    }
}
