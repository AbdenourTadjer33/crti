<?php

namespace Modules\Permission\Traits;

use Illuminate\Database\Eloquent\Relations\Relation;

use ReflectionClass;

trait Relationships
{
    public function getCurrentModelRelationships()
    {
        return collect(get_class_methods($this))->filter(function ($method) {
            $reflection = new ReflectionClass($this);
            $method = $reflection->getMethod($method);
            $returnType = $method->getReturnType();
            if ($returnType) {
                dump($method, $returnType);
            }
        });
    }
}
