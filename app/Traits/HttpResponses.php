<?php

namespace App\Traits;

use Illuminate\Http\JsonResponse;

trait HttpResponses
{
    protected function success(array $data = [], int $code = 200, ?string $message = null, string $status = null): JsonResponse
    {
        return response()->json([
            'status' => $status ?: 'Success',
            'message' => $message,
            ...$data,
        ], $code);
    }

    protected function error(int $code, array $data = [], ?string $message = null, ?string $status = null): JsonResponse
    {
        return response()->json([
            'status' => $status ?: 'Error',
            'message' => $message,
            ...$data,
        ], $code);
    }
}
