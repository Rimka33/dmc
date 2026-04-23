<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            [
                'slug' => 'ordinateurs-portables',
                'name' => 'Ordinateurs Portables',
                'description' => 'Ordinateurs portables et tablettes',
                'icon' => '/images/categories/laptop.png',
                'is_active' => true,
                'sort_order' => 1,
            ],
            [
                'slug' => 'ordinateurs-bureau',
                'name' => 'Ordinateurs Bureau',
                'description' => 'Ordinateurs de bureau et All-in-one',
                'icon' => '/images/categories/smartphone.png',
                'is_active' => true,
                'sort_order' => 2,
            ],
            [
                'slug' => 'accessoires',
                'name' => 'Accessoires Informatiques',
                'description' => 'Souris, claviers, écouteurs et autres accessoires',
                'icon' => '/images/categories/game-console.png',
                'is_active' => true,
                'sort_order' => 3,
            ],
            [
                'slug' => 'chargeurs',
                'name' => 'Chargeurs Ordinateurs',
                'description' => 'Chargeurs et adaptateurs pour ordinateurs',
                'icon' => '/images/categories/camera.png',
                'is_active' => true,
                'sort_order' => 4,
            ],
            [
                'slug' => 'batteries',
                'name' => 'Batteries Ordinateurs',
                'description' => 'Batteries de remplacement pour ordinateurs portables',
                'icon' => '/images/categories/smartwatch.png',
                'is_active' => true,
                'sort_order' => 5,
            ],
            [
                'slug' => 'imprimantes',
                'name' => 'Imprimantes et Accessoires',
                'description' => 'Imprimantes, scanners et accessoires impression',
                'icon' => '/images/categories/speaker-1.png',
                'is_active' => true,
                'sort_order' => 6,
            ],
            [
                'slug' => 'multimedia',
                'name' => 'Multimédia et Électronique',
                'description' => 'Appareils multimédia et électroniques',
                'icon' => '/images/categories/audio.png',
                'is_active' => true,
                'sort_order' => 7,
            ],
        ];

        foreach ($categories as $categoryData) {
            Category::updateOrCreate(
                ['slug' => $categoryData['slug']],
                $categoryData
            );
        }

        $this->command->info('Categories créées avec succès !');
    }
}
