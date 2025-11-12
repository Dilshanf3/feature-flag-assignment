<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FeatureFlag extends Model
{
    protected $fillable = [
        'name',
        'key',
        'description',
        'is_enabled',
        'rollout_type',
        'rollout_value',
        'starts_at',
        'ends_at',
    ];

    protected $casts = [
        'is_enabled' => 'boolean',
        'rollout_value' => 'array',
        'starts_at' => 'datetime',
        'ends_at' => 'datetime',
    ];

    public static function findByKey(string $key): ?self
    {
        return self::where('key', $key)->first();
    }

    public static function findAllFlags(): array
    {
        return self::all()->all();
    }

    public static function findEnabledFlags(): array
    {
        return self::where('is_enabled', true)->get()->all();
    }

    public static function saveFlag(array $data): self
    {
        return self::updateOrCreate(['key' => $data['key']], $data);
    }

    public static function deleteFlag(string $key): bool
    {
        return self::where('key', $key)->delete() > 0;
    }

    public static function findByKeys(array $keys): array
    {
        return self::whereIn('key', $keys)->get()->all();
    }

    public static function isEnabledFlag(string $key): bool
    {
        $featureFlag = self::where('key', $key)->first();
        if (!$featureFlag) {
            return false;
        }
        return $featureFlag->isActive();
    }


    public function evaluate(array $context = []): array
    {
        if (!$this->isActive()) {
            return [
                'enabled' => false,
                'reason' => 'Feature flag is disabled or not active',
            ];
        }
        // Add rollout/condition logic here if needed (migrated as-is)
        return [
            'enabled' => true,
            'reason' => 'Feature flag is enabled',
        ];
    }

    public function isActive(): bool
    {
        if (!$this->is_enabled) {
            return false;
        }

        $now = now();

        if ($this->starts_at && $now->isBefore($this->starts_at)) {
            return false;
        }

        if ($this->ends_at && $now->isAfter($this->ends_at)) {
            return false;
        }

        return true;
    }
}
