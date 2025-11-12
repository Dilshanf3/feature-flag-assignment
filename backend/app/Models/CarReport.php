<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CarReport extends Model
{
    protected $fillable = [
        'car_model',
        'description',
        'damage_type',
        'photo_url',
        'status',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public static function findById(int $id): ?self
    {
        return self::find($id);
    }

    public static function findAllReports(): array
    {
        return self::all()->all();
    }

    public static function findByStatus(string $status): array
    {
        return self::where('status', $status)->get()->all();
    }

    public static function saveReport(array $data): self
    {
        return self::create($data);
    }

    public static function deleteReport(int $id): bool
    {
        return self::where('id', $id)->delete() > 0;
    }

    private function getCarMake(): string
    {
        $parts = explode(' ', $this->car_model);
        return $parts[0] ?? 'Unknown';
    }

    private function getCarModel(): string
    {
        $parts = explode(' ', $this->car_model);
        return $parts[1] ?? 'Unknown';
    }

    private function getCarYear(): int
    {
        $parts = explode(' ', $this->car_model);
        $year = end($parts);
        return is_numeric($year) ? (int) $year : 2020;
    }

    private function mapDamageTypeToCondition(string $damageType): CarCondition
    {
        return match ($damageType) {
            'minor' => CarCondition::GOOD,
            'moderate' => CarCondition::FAIR,
            'severe' => CarCondition::POOR,
            'total_loss' => CarCondition::POOR,
            default => CarCondition::FAIR,
        };
    }

    private static function mapConditionToDamageType(CarCondition $condition): string
    {
        return match ($condition) {
            CarCondition::EXCELLENT => 'minor',
            CarCondition::GOOD => 'minor',
            CarCondition::FAIR => 'moderate',
            CarCondition::POOR => 'severe',
            CarCondition::SALVAGE => 'total_loss',
        };
    }

    public function scopeByStatus($query, string $status)
    {
        return $query->where('status', $status);
    }

    public function scopeByDamageType($query, string $damageType)
    {
        return $query->where('damage_type', $damageType);
    }
}
