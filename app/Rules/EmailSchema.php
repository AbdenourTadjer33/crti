<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class EmailSchema implements ValidationRule
{
    /**
     * Run the validation rule.
     *
     * @param  \Closure(string, ?string = null): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $schemas = $this->getEmailSchema();

        if (!$schemas) return;

        $isValid = false;
        foreach ($schemas as $schema) {
            if (str_ends_with($value, $schema)) {
                $isValid = true;
                break;
            }
        }

        if (!$isValid) {
            $fail(__("validation.email_schema", ['schema' => implode(', ', $schemas)]));
        }
    }

    /**
     * Get the email schema from the config.
     *
     * @return false|array
     */
    private function getEmailSchema(): false | array
    {
        $schema = config('app.params.email_schema');

        if (!$schema || $schema === "*") {
            return false;
        }

        return explode(',', $schema);
    }
}
