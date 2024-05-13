<?php

namespace Modules\ManageApp\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Modules\ManageApp\Database\Factories\UniversityFactory;

class University extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     */
    
    protected $guarded = [];

    protected static function newFactory(): UniversityFactory
    {
        return UniversityFactory::new();
    }
}
