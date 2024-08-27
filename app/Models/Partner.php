<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Partner extends Model
{
    use HasFactory;

    protected $guarded = [];
    
    public $timestamps = false;
    
    public function project(): HasOne
    {
        return $this->hasOne(Project::class, 'partner_id', 'id');
    }

}
