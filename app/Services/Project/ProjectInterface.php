<?php

namespace App\Services\Project;

interface ProjectInterface
{
    /**
     *
     * @param array $data
     *
     * @return \App\Models\Project
     */
    public function init(array $data);

    /**
     *
     * @return \App\Models\Project
     */
    public function store(\App\Models\Project $project, array $data);

    public function update(\App\Models\Project $project, array $data);
}
