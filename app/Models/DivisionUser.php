<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;

class DivisionUser extends Pivot
{

    /**
     * Indicates if the IDs are auto-incrementing.
     *
     * @var bool
     */
    public $incrementing = false;

    protected $fillable = [
        'division_id',
        'user_id',
        'division_grade_id',

    ];

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'division_user';

    protected $with = ['grade:id,name'];

    public function grade()
    {
        return $this->belongsTo(DivisionGrade::class, 'division_grade_id');
    }
}
