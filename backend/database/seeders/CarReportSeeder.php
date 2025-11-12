<?php

namespace Database\Seeders;

use App\Models\CarReport;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CarReportSeeder extends Seeder
{
    public function run(): void
    {
        $carReports = [
            [
                'car_model' => 'Mercedes-Benz E-Class 2021',
                'description' => 'Front bumper has significant scratches and minor dents from a parking lot incident. The headlight housing is also cracked on the passenger side.',
                'damage_type' => 'moderate',
                'photo_url' => null,
                'status' => 'pending',
            ],
            [
                'car_model' => 'Audi A4 2020',
                'description' => 'Rear quarter panel sustained heavy damage from a side collision. Door is misaligned and requires panel replacement and repainting.',
                'damage_type' => 'severe',
                'photo_url' => null,
                'status' => 'in_progress',
            ],
            [
                'car_model' => 'Volkswagen Golf GTI 2022',
                'description' => 'Small stone chip on windshield that has developed into a 6-inch crack. Needs immediate attention to prevent further spreading.',
                'damage_type' => 'minor',
                'photo_url' => null,
                'status' => 'completed',
            ],
            [
                'car_model' => 'Lexus RX 350 2019',
                'description' => 'Hail damage across the hood, roof, and trunk. Multiple small to medium dents visible. Paint surface is intact but bodywork repair needed.',
                'damage_type' => 'severe',
                'photo_url' => null,
                'status' => 'pending',
            ],
            [
                'car_model' => 'Porsche Cayenne 2023',
                'description' => 'Driver side mirror was clipped while parked. Mirror housing broken and glass shattered. Electrical components may need inspection.',
                'damage_type' => 'moderate',
                'photo_url' => null,
                'status' => 'completed',
            ],
            [
                'car_model' => 'Range Rover Sport 2020',
                'description' => 'Deep scratches along both sides from tree branches on narrow trail. Clear coat is compromised and rust prevention treatment recommended.',
                'damage_type' => 'moderate',
                'photo_url' => null,
                'status' => 'in_progress',
            ],
            [
                'car_model' => 'Subaru Outback 2021',
                'description' => 'Minor scrape on rear bumper from backing into a pole. Paint transfer visible but no structural damage. Buffing and touch-up required.',
                'damage_type' => 'minor',
                'photo_url' => null,
                'status' => 'completed',
            ],
            [
                'car_model' => 'Jaguar F-PACE 2022',
                'description' => 'Front end collision at low speed. Hood is buckled, front grille broken, and radiator may be damaged. Airbags did not deploy.',
                'damage_type' => 'severe',
                'photo_url' => null,
                'status' => 'pending',
            ],
        ];

        foreach ($carReports as $report) {
            CarReport::create($report);
        }
    }
}
