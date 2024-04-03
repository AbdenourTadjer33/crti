<?php

namespace Modules\Authentification\Services;

use Illuminate\Support\Facades\Request;

class Service
{
    /**
     * this service method return an client name to use it when storing api tokens
     * 
     * @return string
     */
    public function getClientName(): string
    {
        $name = "";

        if (Request::has('device_name') && $deviceName = Request::input('device_name')) {
            $name .= $deviceName;
        } else {
            $name .= Request::ip();
        }

        $name .= '-' . Request::header('User-Agent');

        return $name;
    }
}
