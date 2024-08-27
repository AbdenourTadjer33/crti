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

    private function getCachedData(string $cacheKey, string $tableName)
    {
        return Cache::store('file')->remember(
            $cacheKey,
            $this->expirationTime,
            fn() => DB::table($tableName)->get()->toArray()
        );
    }

    private function storeData(string $tableName, string $columnName, string $value): bool
    {
        return DB::table($tableName)->insert([
            $columnName => $value
        ]);
    }

    private function forgetCache(string $cacheKey): bool
    {
        return Cache::store('file')->forget($cacheKey);
    }

    public function getProjectNatures()
    {
        return $this->getCachedData('project_natures', 'project_natures');
    }

    public function getProjectDomains()
    {
        return $this->getCachedData('project_domains', 'project_domains');
    }

    public function storeProjectNature(string $nature)
    {
        return $this->storeData('project_natures', 'nature', $nature);
    }

    public function storeProjectDomain(string $domain)
    {
        return $this->storeData('project_domains', 'domain', $domain);
    }

    public function forgetProjectNatures(): bool
    {
        return $this->forgetCache('project_natures');
    }

    public function forgetProjectDomains(): bool
    {
        return $this->forgetCache('project_domains');
    }

    public function getDivisionGrade()
    {
        return $this->getCachedData('division_grades', 'division_grades');
    }

    public function storeDivisionGrade(string $grade)
    {
        return $this->storeData('division_grades', 'grade', $grade);
    }

}
