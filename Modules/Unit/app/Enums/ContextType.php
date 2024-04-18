<?php

namespace Modules\Permission\Enums;

enum ContextType: int
{
    case Static = 0;
    case Dynamic = 1;
}