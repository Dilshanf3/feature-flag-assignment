<?php

namespace App\Http\Controllers\Api;

use App\Models\FeatureFlag;
use App\Models\FeatureFlagDecision;
use App\Http\Controllers\Controller;
use App\Http\Requests\FeatureFlags\AnalyticsRequest;
use App\Http\Requests\FeatureFlags\CreateFeatureFlagRequest;
use App\Http\Requests\FeatureFlags\EvaluateFeatureFlagRequest;
use App\Http\Requests\FeatureFlags\UpdateFeatureFlagRequest;
use App\Http\Requests\FeatureFlags\UserHistoryRequest;
use App\Http\Resources\FeatureFlagResource;
use App\Models\FeatureFlag as FeatureFlagModel;
use DateTimeImmutable;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redis;

class FeatureFlagController extends Controller
{


    public function index(): JsonResponse
    {
        $flags = FeatureFlagModel::all();
        
        return FeatureFlagResource::collection($flags)->response();
    }

    public function getActiveFlags(): JsonResponse
    {
        $flags = FeatureFlagModel::where('is_enabled', true)->get();
        
        return FeatureFlagResource::collection($flags)->response();
    }

    public function show(string $key): JsonResponse
    {
        $flag = FeatureFlagModel::where('key', $key)->firstOrFail();
        
        return (new FeatureFlagResource($flag))->response();
    }

    public function evaluate(string $key, EvaluateFeatureFlagRequest $request): JsonResponse
    {
        $context = $request->validated()['context'] ?? [];
        $flag = FeatureFlag::findByKey($key);
        if (!$flag) {
            return response()->json(['data' => [
                'key' => $key,
                'enabled' => false,
                'reason' => 'Feature flag not found',
            ]]);
        }
        $result = $flag->evaluate($context);
        FeatureFlagDecision::logDecision($key, $result['enabled'], $result['reason'], $context, $context['user_id'] ?? null, $context['session_id'] ?? null);
        return response()->json(['data' => array_merge(['key' => $key], $result)]);
    }

    public function check(string $key, EvaluateFeatureFlagRequest $request): JsonResponse
    {
        $context = $request->validated()['context'] ?? [];
        $flag = FeatureFlag::findByKey($key);
        $enabled = $flag ? $flag->evaluate($context)['enabled'] : false;
        return response()->json([
            'key' => $key,
            'enabled' => $enabled
        ]);
    }


    public function store(CreateFeatureFlagRequest $request): JsonResponse
    {
        $data = $request->validated();
        $flag = FeatureFlag::saveFlag($data);
        return (new FeatureFlagResource($flag))->response()->setStatusCode(201);
    }

    public function update(UpdateFeatureFlagRequest $request, string $key): JsonResponse
    {
        $flag = FeatureFlag::where('key', $key)->firstOrFail();
        $flag->update($request->validated());
        $this->invalidateFlagCache($key);
        return (new FeatureFlagResource($flag->fresh()))->response();
    }

    public function destroy(string $key): JsonResponse
    {
        $deleted = FeatureFlag::deleteFlag($key);
        if (!$deleted) {
            return response()->json(['error' => 'Feature flag not found'], 404);
        }
        return response()->json(['message' => 'Feature flag deleted successfully'], 200);
    }

    public function analytics(string $key, AnalyticsRequest $request): JsonResponse
    {
        $hours = $request->integer('hours', 24);
        $stats = FeatureFlagDecision::getFlagStats($key, $hours);
        return response()->json(['data' => $stats]);
    }

    public function userHistory(UserHistoryRequest $request): JsonResponse
    {
        $userId = $request->integer('user_id');
        $limit = $request->integer('limit', 50);
        $history = FeatureFlagDecision::getUserFlagHistory($userId, $limit);
        return response()->json(['data' => $history]);
    }

    private function invalidateFlagCache(string $key): void
    {
        $patterns = [
            "flag:{$key}:*",
            "active_flags:*"
        ];

        foreach ($patterns as $pattern) {
            $keys = Redis::keys($pattern);
            if (!empty($keys)) {
                Redis::del($keys);
            }
        }
    }
}
