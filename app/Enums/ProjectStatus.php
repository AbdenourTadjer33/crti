<?php

namespace App\Enums;

enum ProjectStatus
{
    case creation;
    case new;
    case review;
    case pending;
    case suspended;
    case rejected;
    case completed;

    public static function fromKey(string $key): string
    {
        if (!self::isValidKey($key)) {
            throw new \InvalidArgumentException("Invalid project status key.");
        }

        return trans("status.$key");
    }

    private static function isValidKey(string $key): bool
    {
        return in_array($key, array_column(self::cases(), 'name'));
    }
}
