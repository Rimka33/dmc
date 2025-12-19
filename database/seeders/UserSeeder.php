<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Admin principal
        User::updateOrCreate(
            ['email' => 'admin@dmc.com'],
            [
                'name' => 'Admin DMC',
                'password' => Hash::make('password'),
                'role' => 'admin',
                'phone' => '+221771234567',
                'address' => 'Dakar, Senegal',
                'city' => 'Dakar',
                'postal_code' => '12000',
                'is_active' => true,
            ]
        );

        // Clients de test
        User::updateOrCreate(
            ['email' => 'moussa@example.com'],
            [
                'name' => 'Moussa Diallo',
                'password' => Hash::make('password'),
                'role' => 'customer',
                'phone' => '+221772345678',
                'address' => 'Parcelles Assainies, Dakar',
                'city' => 'Dakar',
                'postal_code' => '12500',
                'is_active' => true,
            ]
        );

        User::updateOrCreate(
            ['email' => 'fatou@example.com'],
            [
                'name' => 'Fatou Sall',
                'password' => Hash::make('password'),
                'role' => 'customer',
                'phone' => '+221773456789',
                'address' => 'Plateau, Dakar',
                'city' => 'Dakar',
                'postal_code' => '12100',
                'is_active' => true,
            ]
        );

        User::updateOrCreate(
            ['email' => 'amadou@example.com'],
            [
                'name' => 'Amadou Ba',
                'password' => Hash::make('password'),
                'role' => 'customer',
                'phone' => '+221774567890',
                'address' => 'Grand Yoff, Dakar',
                'city' => 'Dakar',
                'postal_code' => '12300',
                'is_active' => true,
            ]
        );

        $this->command->info('Utilisateurs créés avec succès !');
        $this->command->line('');
        $this->command->warn('Identifiants Admin:');
        $this->command->info('   Email: admin@dmc.com');
        $this->command->info('   Password: password');
    }
}
