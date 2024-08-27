<?php

namespace App\Enums;

enum TaskStatus
{
    case to_do;
    case in_progress;
    case done;
    case suspended;
    case canceled;
}
