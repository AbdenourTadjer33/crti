<?php

namespace Modules\Permission\Exceptions;

use Exception;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class RoleAlreadyExists extends Exception
{
    public function report(): void
    {
    }

    public function render(Request $request): Response
    {
        dd($request);
    }
}
