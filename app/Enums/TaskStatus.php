<?php

namespace App\Enums;

enum TaskStatus
{
    case todo;
    case progress;
    case done;
    case suspended;
    case canceled;
}
