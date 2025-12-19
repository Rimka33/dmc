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
        Schema::create('user_addresses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('label', 50)->comment('Maison, Bureau, etc.');
            $table->string('full_name', 255);
            $table->string('phone', 50);
            $table->text('address');
            $table->string('city', 100);
            $table->string('postal_code', 20)->nullable();
            $table->string('region', 100)->nullable();
            $table->boolean('is_default')->default(false);
            $table->timestamps();

            // Index pour les requêtes fréquentes
            $table->index(['user_id', 'is_default']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_addresses');
    }
};
