<?php

namespace App\Services\Permission;

class PermissionService
{

    /**
     *  This represent the base params to construct default permissions
     *
     *  @param array<string, string[]>
     */
    protected array $baseParams;

    /**
     * Create a new class instance.
     */
    public function __construct(array $baseParams)
    {
        $this->baseParams = $baseParams;
    }

    public function getParams($withTranslation = true)
    {
        if (!$withTranslation) return $this->baseParams;

        $trans = [];
        foreach ($this->baseParams as $feature => $actions) {
            $featureActions = [];

            foreach ($actions as $action) {
                $translatedAction = __("permissions.actions.{$action}");

                if (is_array($translatedAction)) {
                    $featureActions[$action] = [
                        "name" => $translatedAction["name"] ?? "",
                        "description" => isset($translatedAction["description"]) ? __("permissions.actions.{$action}.description", ["feature" => __("permissions.features.{$feature}")]) : "",
                    ];
                } else {
                    $featureActions[$action] = $translatedAction;
                }
            }

            $trans[$feature] = [
                'name' => __("permissions.features.{$feature}"),
                'actions' => $featureActions,
            ];
        }

        return [
            'params' => $this->baseParams,
            'trans' => $trans,
        ];
    }

    /**
     * @param array<string, string[]>
     * @param \Illuminate\Database\Eloquent\Collection<int,\Spatie\Permission\Models\Permission>
     * @return \Spatie\Permission\Models\Permission[]
     */
    public function getPermissionsFromParams(array $params, \Illuminate\Database\Eloquent\Collection $permissions)
    {
        $resolved = [];

        foreach ($params as $feature => $actions) {
            // Skip if no actions are selected for the feature
            if (empty($actions)) continue;

            // Check if all actions of the feature are selected
            if (count($this->baseParams[$feature]) === count($actions)) {
                // If the feature only has one action, use the specific action-level permission
                if (count($this->baseParams[$feature]) === 1) {
                    $action = $this->baseParams[$feature][0];
                    $constructed = "{$feature}.{$action}";

                    $permission = $permissions->firstWhere('name', $constructed);
                    if ($permission) $resolved[] = $permission;
                } else {
                    // Use the feature-level permission if all actions are selected
                    $permission = $permissions->firstWhere('name', $feature);
                    if ($permission) $resolved[] = $permission;
                }

                continue;
            }

            // Add specific action-level permissions if not all actions are selected
            foreach ($actions as $action) {
                $constructed = "{$feature}.{$action}";
                $permission = $permissions->firstWhere('name', $constructed);
                if ($permission) $resolved[] = $permission;
            }
        }

        return $resolved;
    }
}
