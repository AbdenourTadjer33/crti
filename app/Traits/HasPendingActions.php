<?php

namespace App\Traits;

use App\Models\PendingAction;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;

trait HasPendingActions
{
    protected function getCacheKey()
    {
        return 'pending_actions:' . static::class . ':' . $this->getKey();
    }

    public function getPendingActions()
    {
        $pendingActionsFn = function () {
            return PendingAction::query()->where('user_id', $this->getKey())->get()->map(function ($action) {
                $action->data = unserialize($action->data);
                return $action;
            });
        };

        return Cache::remember($this->getCacheKey(), now()->addHour(), $pendingActionsFn);
    }

    /**
     * @param \Illuminate\Database\Eloquent\Model
     */
    public function storePendingAction($model, $data)
    {
        $model->pendingAction()->create([
            'user_id' => $this->getKey(),
            'data' => serialize($data),
        ]);

        $this->clearCache();
    }

    /**
     * @param \Illuminate\Database\Eloquent\Model
     */
    public function destroyPendingAction($model)
    {
        $model->pendingAction()->delete();


        // DB::table('pending_actions')->where('user_id', $this->getKey())->where('id', $actionId)->delete();

        $this->clearCache();
    }

    public function clearCache()
    {
        Cache::forget($this->getCacheKey());
    }
}
