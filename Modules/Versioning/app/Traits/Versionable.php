<?php

namespace Modules\Versioning\Traits;

use Illuminate\Database\Eloquent\Relations\MorphMany;
use Modules\Versioning\Models\Version;
use Illuminate\Support\Facades\Auth;

trait Versionable
{
    /**
     * Retrieve, if exists, the property that define that Version model.
     * If no property defined, use the default Version model.
     * 
     * Trait cannot share properties whth their class !
     * http://php.net/manual/en/language.oop5.traits.php
     * @return unknown|string
     */
    protected function getVersionClass()
    {
        return Version::class;
    }

    /**
     * Private variable to detect if this is an update
     * or an insert.
     * @var bool
     */
    private $updating;

    /**
     * Contains all dirty data that is valid for versioning.
     *
     * @var array
     */
    private $versionableDirtyData;

    /**
     * Optional reason, why this version was created.
     * @var string
     */
    private $reason;

    /**
     * Flag that determines if the model allows versioning at all.
     * @var bool
     */
    protected $versioningEnabled = true;

    /**
     * @return self
     */
    public function enableVersioning(): self
    {
        $this->versioningEnabled = true;
        return $this;
    }

    /**
     * @return self
     */
    public function disableVersioning(): self
    {
        $this->versioningEnabled = false;
        return $this;
    }

    /**
     * Attribute mutator for "reason".
     * Prevent "reason" to become a database attribute of model.
     *
     * @param string $value
     */
    public function setReasonAttribute($value)
    {
        $this->reason = $value;
    }

    /**
     * Initialize model events.
     */
    public static function bootVersionable()
    {
        static::saving(function ($model) {
            $model->versionablePreSave();
        });

        static::saved(function ($model) {
            $model->versionablePostSave();
        });
    }

    /**
     * Return all versions of the model.
     * @return MorphMany
     */
    public function versions(): MorphMany
    {
        return $this->morphMany($this->getVersionClass(), 'versionable');
    }

    /**
     * Returns the latest version available.
     * @return Version
     */
    public function currentVersion()
    {
        return $this->getLatestVersions()->first();
    }

    /**
     * Returns the previous version.
     * @return Version
     */
    public function previousVersion()
    {
        return $this->getLatestVersions()->limit(1)->offset(1)->first();
    }

    /**
     * Get a model based on the version id.
     *
     * @param $id
     *
     * @return $this|null
     */
    public function getVersionModel($id)
    {
        $version = $this->versions()->where("id", "=", $id)->first();
        if (!is_null($version)) {
            return $version->getModel();
        }
        return null;
    }

    /**
     * Pre save hook to determine if versioning is enabled and if we're updating
     * the model.
     * @return void
     */
    protected function versionablePreSave()
    {
        if ($this->isVersioningEnabled()) {
            $this->versionableDirtyData = $this->getDirty();
            $this->updating             = $this->exists;
        }
    }

    /**
     * Save a new version.
     * @return void
     */
    protected function versionablePostSave()
    {
        /**
         * We'll save new versions on updating and first creation.
         */

        if ($this->isVersioningEnabled() && $this->isValidForVersioning()) {
        }

        if (
            ($this->isVersioningEnabled() && $this->updating && $this->isValidForVersioning()) ||
            ($this->isVersioningEnabled() && !$this->updating && !is_null($this->versionableDirtyData) && count($this->versionableDirtyData))
        ) {
            // Save a new version
            $class                     = $this->getVersionClass();
            $version                   = new $class();
            $version->versionable_id   = $this->getKey();
            $version->versionable_type = method_exists($this, 'getMorphClass') ? $this->getMorphClass() : get_class($this);
            $version->user_id          = $this->getAuthUserId();

            $versionedHiddenFields = $this->versionedHiddenFields ?? [];
            $this->makeVisible($versionedHiddenFields);
            $version->model_data       = serialize($this->attributesToArray());
            $this->makeHidden($versionedHiddenFields);

            if (!empty($this->reason)) {
                $version->reason = $this->reason;
            }

            $version->save();

            $this->purgeOldVersions();
        }
    }


    /**
     * Initialize a version on every instance of a model.
     * @return void
     */
    public static function initializeVersions()
    {
        foreach (self::all() as $obj) {
            $obj->createInitialVersion();
        }
    }

    /**
     * Save a new version.
     * @return void
     */
    public function createInitialVersion()
    {
        if ($this->isVersioningEnabled() && $this->fresh()->versions->isEmpty()) {

            $class                     = $this->getVersionClass();
            $version                   = new $class();
            $version->versionable_id   = $this->getKey();
            $version->versionable_type = method_exists($this, 'getMorphClass') ? $this->getMorphClass() : get_class($this);
            $version->user_id          = $this->getAuthUserId();

            $versionedHiddenFields = $this->versionedHiddenFields ?? [];
            $this->makeVisible($versionedHiddenFields);
            $version->model_data       = serialize($this->attributesToArray());
            $this->makeHidden($versionedHiddenFields);

            if (!empty($this->reason)) {
                $version->reason = $this->reason;
            }

            $version->save();
        }
    }


    /**
     * Delete old versions of this model when they reach a specific count.
     * 
     * @return void
     */
    private function purgeOldVersions()
    {
        $keep = isset($this->keepOldVersions) ? $this->keepOldVersions : 0;

        if ((int)$keep > 0) {
            $count = $this->versions()->count();

            if ($count > $keep) {
                $this->getLatestVersions()
                    ->take($count)
                    ->skip($keep)
                    ->get()
                    ->each(function ($version) {
                        $version->delete();
                    });
            }
        }
    }

    /**
     * Checking if versioning is enabled 
     * 
     * @return bool
     */
    private function isVersioningEnabled(): bool
    {
        return isset($this->autoVersioning) ? $this->autoVersioning : $this->versioningEnabled;
    }

    public static function isEnabled()
    {
        return (new Self)->isVersioningEnabled();
    }

    /**
     * Determine if a new version should be created for this model.
     * Checks if appropriate fields have been changed.
     *
     * @return bool
     */
    private function isValidForVersioning(): bool
    {
        $removeableKeys = isset($this->dontVersionFields) ? $this->dontVersionFields : [];
        if (($updatedAt = $this->getUpdatedAtColumn()) !== null) {
            $removeableKeys[] = $updatedAt;
        }

        if (method_exists($this, 'getDeletedAtColumn') && ($deletedAt = $this->getDeletedAtColumn()) !== null) {
            $removeableKeys[] = $deletedAt;
        }

        return count(array_diff_key($this->versionableDirtyData, array_flip($removeableKeys))) > 0;
    }

    /**
     * @return int|null
     */
    protected function getAuthUserId()
    {
        return Auth::check() ? Auth::id() : null;
    }

    /**
     * @return \Illuminate\Database\Eloquent\Builder
     */
    protected function getLatestVersions()
    {
        return $this->versions()->orderByDesc('id');
    }
}
