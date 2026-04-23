<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        $adminRole = \App\Models\Role::where('slug', 'admin')->first();

        User::updateOrCreate(
            ['email' => 'admin@dmc.com'],
            [
                'name' => 'Administrateur DMC',
                'password' => Hash::make('Admin2026DMC'),
                'role' => 'admin',
                'role_id' => $adminRole ? $adminRole->id : null,
                'is_active' => true,
                'phone' => '+221000000000',
                'address' => 'Administration DMC',
            ]
        );

        $this->command->info('Administrateur créé avec succès !');
        $this->command->warn('Email: admin@dmc.com / Password: Admin2026DMC');
    }
}
