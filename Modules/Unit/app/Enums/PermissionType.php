<?php

namespace Modules\Permission\Enums;

enum PermissionType: int
{
    case Generic = 0;
    case Context = 1;
}