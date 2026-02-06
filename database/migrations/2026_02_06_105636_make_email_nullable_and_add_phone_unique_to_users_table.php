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
        Schema::table('users', function (Blueprint $table) {
            $table->string('email')->nullable()->change();
            $table->string('phone')->unique()->nullable()->change();
            if (! Schema::hasColumn('users', 'region')) {
                $table->string('region')->nullable();
            }
            if (! Schema::hasColumn('users', 'neighborhood')) {
                $table->string('neighborhood')->nullable();
            }
        });

        Schema::table('user_addresses', function (Blueprint $table) {
            if (! Schema::hasColumn('user_addresses', 'neighborhood')) {
                $table->string('neighborhood')->nullable()->after('region');
            }
        });

        Schema::table('orders', function (Blueprint $table) {
            if (! Schema::hasColumn('orders', 'shipping_region')) {
                $table->string('shipping_region')->nullable()->after('shipping_city');
            }
            if (! Schema::hasColumn('orders', 'shipping_neighborhood')) {
                $table->string('shipping_neighborhood')->nullable()->after('shipping_region');
            }
            $table->string('customer_email')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('email')->nullable(false)->change();
            $table->dropUnique(['phone']);
            $table->dropColumn(['region', 'neighborhood']);
        });

        Schema::table('user_addresses', function (Blueprint $table) {
            $table->dropColumn(['neighborhood']);
        });

        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn(['shipping_region', 'shipping_neighborhood']);
            $table->string('customer_email')->nullable(false)->change();
        });
    }
};
