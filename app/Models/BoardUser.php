<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\Pivot;

class BoardUser extends Pivot
{
    protected $guarded = [];

    protected function casts(): array
    {
        return [
            'is_favorable' => 'boolean'
        ];
    }

    /**
     * Indicates if the IDs are auto-incrementing.
     *
     * @var bool
     */
    public $incrementing = false;

    protected $table = 'board_user';
}
