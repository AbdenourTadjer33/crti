<?php

namespace Modules\ManageApp\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Modules\ManageApp\Database\Factories\DiplomaFactory;

class Diploma extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [];

    protected static function newFactory(): DiplomaFactory
    {
        return DiplomaFactory::new();
    }
}
