<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Roles Table
        Schema::create('roles', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->timestamps();
        });

        // 2. Permissions Table
        Schema::create('permissions', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('group')->nullable(); // Pour grouper dans l'UI (ex: "Produits", "Utilisateurs")
            $table->timestamps();
        });

        // 3. Role_Permission Pivot Table
        Schema::create('role_permission', function (Blueprint $table) {
            $table->id();
            $table->foreignId('role_id')->constrained()->onDelete('cascade');
            $table->foreignId('permission_id')->constrained()->onDelete('cascade');
            $table->unique(['role_id', 'permission_id']);
        });

        // 4. Add role_id to Users Table
        Schema::table('users', function (Blueprint $table) {
            $table->foreignId('role_id')->nullable()->after('id')->constrained()->nullOnDelete();
        });

        // 5. Seed Initial Roles and Permissions
        $this->seedRolesAndPermissions();
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['role_id']);
            $table->dropColumn('role_id');
        });

        Schema::dropIfExists('role_permission');
        Schema::dropIfExists('permissions');
        Schema::dropIfExists('roles');
    }

    private function seedRolesAndPermissions()
    {
        // Créer les rôles de base
        $adminRole = DB::table('roles')->insertGetId([
            'name' => 'Administrateur',
            'slug' => 'admin',
            'description' => 'Accès complet au système',
            'created_at' => now(), 'updated_at' => now(),
        ]);

        $managerRole = DB::table('roles')->insertGetId([
            'name' => 'Gestionnaire Catalogue',
            'slug' => 'manager',
            'description' => 'Gestion des produits, catégories et stocks',
            'created_at' => now(), 'updated_at' => now(),
        ]);

        $customerRole = DB::table('roles')->insertGetId([
            'name' => 'Client',
            'slug' => 'customer',
            'description' => 'Utilisateur inscrit standard',
            'created_at' => now(), 'updated_at' => now(),
        ]);

        // Définir les permissions
        $permissions = [
            // Dashboard
            ['name' => 'Voir le Dashboard', 'slug' => 'dashboard.view', 'group' => 'Dashboard'],

            // Catalogue (Produits, Categories, Collections)
            ['name' => 'Voir Produits', 'slug' => 'products.view', 'group' => 'Catalogue'],
            ['name' => 'Créer Produits', 'slug' => 'products.create', 'group' => 'Catalogue'],
            ['name' => 'Modifier Produits', 'slug' => 'products.edit', 'group' => 'Catalogue'],
            ['name' => 'Supprimer Produits', 'slug' => 'products.delete', 'group' => 'Catalogue'],

            // Commandes
            ['name' => 'Gérer Commandes', 'slug' => 'orders.manage', 'group' => 'Commandes'],

            // Utilisateurs & Rôles
            ['name' => 'Gérer Utilisateurs', 'slug' => 'users.manage', 'group' => 'Système'],
            ['name' => 'Gérer Rôles', 'slug' => 'roles.manage', 'group' => 'Système'],

            // Paramètres
            ['name' => 'Gérer Paramètres', 'slug' => 'settings.manage', 'group' => 'Système'],
        ];

        foreach ($permissions as $perm) {
            $permId = DB::table('permissions')->insertGetId([
                'name' => $perm['name'],
                'slug' => $perm['slug'],
                'group' => $perm['group'],
                'created_at' => now(), 'updated_at' => now(),
            ]);

            // Admin a toutes les permissions
            DB::table('role_permission')->insert([
                'role_id' => $adminRole,
                'permission_id' => $permId,
            ]);

            // Manager a des permissions spécifiques
            if (in_array($perm['slug'], ['dashboard.view', 'products.view', 'products.create', 'products.edit', 'products.delete', 'orders.manage'])) {
                DB::table('role_permission')->insert([
                    'role_id' => $managerRole,
                    'permission_id' => $permId,
                ]);
            }
        }

        // Migrer les anciens rôles vers role_id
        // Si user.role = 'admin' -> role_id = $adminRole
        // Si user.role = 'customer' -> role_id = $customerRole
        DB::table('users')
            ->where('role', 'admin')
            ->update(['role_id' => $adminRole]);

        DB::table('users')
            ->where('role', 'customer')
            ->update(['role_id' => $customerRole]);

        // Pour les autres (ex: users créés sans role explicit), mettre customer par défaut
        DB::table('users')
            ->whereNull('role_id')
            ->update(['role_id' => $customerRole]);
    }
};
