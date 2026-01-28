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
        Schema::create('banners', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->enum('type', ['popup', 'banner', 'slider'])->default('banner');
            $table->string('image');
            $table->string('mobile_image')->nullable();
            $table->string('link')->nullable();
            $table->text('description')->nullable();
            $table->enum('position', ['top', 'middle', 'bottom', 'popup'])->default('top');
            $table->dateTime('start_date')->nullable();
            $table->dateTime('end_date')->nullable();
            $table->boolean('is_active')->default(true);
            $table->integer('display_duration')->nullable(); // en secondes pour les popups
            $table->integer('sort_order')->default(0);
            $table->string('button_text')->nullable();
            $table->string('button_link')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index('type');
            $table->index('position');
            $table->index('is_active');
            $table->index(['start_date', 'end_date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('banners');
    }
};
