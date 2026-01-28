<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Artisan;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->command->info('🌱 Démarrage du seeding de la base de données...');
        $this->command->line('');

        // Users
        $this->command->info('▶ Seeding users...');
        Artisan::call('db:seed', ['--class' => 'UserSeeder', '--force' => true]);
        $this->command->info('✅ Users créés');

        // Categories
        $this->command->info('▶ Seeding categories...');
        Artisan::call('db:seed', ['--class' => 'CategorySeeder', '--force' => true]);
        $this->command->info('✅ Categories créées');

        // Products
        $this->command->info('▶ Seeding products...');
        Artisan::call('db:seed', ['--class' => 'ProductSeeder', '--force' => true]);
        $this->command->info('✅ Products créés');

        $this->command->line('');
        $this->command->info('✅ Base de données peuplée avec succès !');
    }
}
