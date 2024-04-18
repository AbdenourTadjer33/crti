<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;

use Illuminate\Database\Eloquent\Collection;
use Laravel\Sanctum\HasApiTokens;
use Modules\Permission\Traits\HasRole;
use Illuminate\Notifications\Notifiable;
use Modules\Permission\Traits\HasPermission;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\Relation;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Support\Collection as SupportCollection;
use ReflectionClass;

class User extends Authenticatable
{
    use HasFactory, Notifiable, HasApiTokens, HasPermission, HasRole, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'status',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'status' => 'boolean',
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function getRelationships(): SupportCollection
    {
        return collect(get_class_methods($this))->filter(function ($method) {
            $reflection = new ReflectionClass($this);
            $method = $reflection->getMethod($method);
            $returnType = $method->getReturnType();



            $pattern = "Illuminate\Database\Eloquent\Relations\{*}";
            if ($returnType) {
                dump($returnType, $returnType->getName());
            }
            // return $returnType && $returnType->getName() === 'Illuminate\Database\Eloquent\Relations\Relation';
        });
    }
}
