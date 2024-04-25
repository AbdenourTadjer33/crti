<?php

namespace Modules\Permission\Console;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;
use Modules\Permission\PermissionRegistrar;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Input\InputArgument;

class GenerateUsePermissionFile extends Command
{
    /**
     * The name and signature of the console command.
     */
    protected $signature = 'permission:generate';

    /**
     * The console command description.
     */
    protected $description = 'Generate json file that contains models and thier methods.';

    /**
     * Create a new command instance.
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $usePermission = PermissionRegistrar::usePermissionModels();

        $path = storage_path('permission');

        if (!file_exists($path) && !is_dir($path)) {
            mkdir($path);
            file_put_contents($path . DIRECTORY_SEPARATOR . '.gitignore', "*\n!.gitignore");
        }
        $file = $path . DIRECTORY_SEPARATOR . 'use_permission.json';

        file_put_contents($file, json_encode($usePermission));

        $this->info(sprintf('File %s generated successfully.', $file));
    }

    /**
     * Get the console command arguments.
     */
    protected function getArguments(): array
    {
        return [
            ['example', InputArgument::REQUIRED, 'An example argument.'],
        ];
    }

    /**
     * Get the console command options.
     */
    protected function getOptions(): array
    {
        return [
            ['example', null, InputOption::VALUE_OPTIONAL, 'An example option.', null],
        ];
    }
}
