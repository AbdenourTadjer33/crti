<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class AuxDataService
{

    private $expirationTime;

    public function __construct()
    {
        $this->expirationTime = \DateInterval::createFromDateString('1 hour');
    }

    public function getProjectDomains()
    {
        return Cache::store('file')->remember(
            'project_domains',
            $this->expirationTime,
            fn() => DB::table('project_domains')->get()->toArray()
        );
    }

    public function getProjectNatures()
    {
        return Cache::store('file')->remember(
            'project_natures',
            $this->expirationTime,
            fn() => DB::table('project_natures')->get()->toArray()
        );
    }
}
