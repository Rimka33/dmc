<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $permissions = [
            // Contenu
            ['name' => 'Gérer Blog', 'slug' => 'content.blog.manage', 'group' => 'Contenu'],
            ['name' => 'Gérer Pages', 'slug' => 'content.pages.manage', 'group' => 'Contenu'],
            ['name' => 'Gérer Bannières', 'slug' => 'content.banners.manage', 'group' => 'Contenu'],

            // Interactions
            ['name' => 'Gérer Avis', 'slug' => 'interactions.reviews.manage', 'group' => 'Interactions'],
            ['name' => 'Gérer Questions', 'slug' => 'interactions.questions.manage', 'group' => 'Interactions'],
            ['name' => 'Gérer Messages', 'slug' => 'interactions.messages.manage', 'group' => 'Interactions'],

            // Marketing / Collections
            ['name' => 'Gérer Newsletter', 'slug' => 'marketing.newsletter.manage', 'group' => 'Marketing'],
            ['name' => 'Gérer Collections', 'slug' => 'marketing.collections.manage', 'group' => 'Contenu'],

            // Clients
            ['name' => 'Voir Clients', 'slug' => 'customers.view', 'group' => 'Clients'],
            ['name' => 'Gérer Clients', 'slug' => 'customers.manage', 'group' => 'Clients'],
        ];

        $adminRole = DB::table('roles')->where('slug', 'admin')->first();

        foreach ($permissions as $perm) {
            // Check if permission already exists to act idempotently
            if (!DB::table('permissions')->where('slug', $perm['slug'])->exists()) {
                $permId = DB::table('permissions')->insertGetId([
                    'name' => $perm['name'],
                    'slug' => $perm['slug'],
                    'group' => $perm['group'],
                    'created_at' => now(),
                    'updated_at' => now()
                ]);

                if ($adminRole) {
                    DB::table('role_permission')->insertOrIgnore([
                        'role_id' => $adminRole->id,
                        'permission_id' => $permId
                    ]);
                }
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $slugs = [
            'content.blog.manage', 'content.pages.manage', 'content.banners.manage',
            'interactions.reviews.manage', 'interactions.questions.manage', 'interactions.messages.manage',
            'marketing.newsletter.manage', 'marketing.collections.manage',
            'customers.view', 'customers.manage'
        ];

        DB::table('permissions')->whereIn('slug', $slugs)->delete();
    }
};
