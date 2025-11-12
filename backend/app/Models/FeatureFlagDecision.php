<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FeatureFlagDecision extends Model
{
    protected $fillable = [
        'flag_key',
        'enabled',
        'reason',
        'context',
        'user_id',
        'session_id',
        'evaluated_at',
    ];

    protected $casts = [
        'enabled' => 'boolean',
        'context' => 'array',
        'evaluated_at' => 'datetime',
    ];

    public static function logDecision(
        string $flagKey,
        bool $enabled,
        string $reason,
        array $context = [],
        ?string $userId = null,
        ?string $sessionId = null
    ): void {
        self::create([
            'flag_key' => $flagKey,
            'enabled' => $enabled,
            'reason' => $reason,
            'context' => $context,
            'user_id' => $userId,
            'session_id' => $sessionId,
            'evaluated_at' => now(),
        ]);
    }

    public static function getFlagStats(string $flagKey, int $hours = 24): array
    {
        $decisions = self::forFlag($flagKey)->recent($hours)->get();
        $total = $decisions->count();
        $enabled = $decisions->where('enabled', true)->count();
        return [
            'flag_key' => $flagKey,
            'period_hours' => $hours,
            'total_decisions' => $total,
            'enabled_count' => $enabled,
            'disabled_count' => $total - $enabled,
            'enabled_percentage' => $total > 0 ? round(($enabled / $total) * 100, 2) : 0,
            'reasons' => $decisions->groupBy('reason')->map->count(),
        ];
    }

    public static function getUserFlagHistory(string $userId, int $limit = 50): array
    {
        return self::forUser($userId)
            ->orderBy('evaluated_at', 'desc')
            ->limit($limit)
            ->get()
            ->toArray();
    }

    public function scopeForFlag($query, string $flagKey)
    {
        return $query->where('flag_key', $flagKey);
    }

    public function scopeForUser($query, string $userId)
    {
        return $query->where('user_id', $userId);
    }

    public function scopeEnabled($query)
    {
        return $query->where('enabled', true);
    }

    public function scopeDisabled($query)
    {
        return $query->where('enabled', false);
    }

    public function scopeRecent($query, int $hours = 24)
    {
        return $query->where('evaluated_at', '>=', now()->subHours($hours));
    }
}