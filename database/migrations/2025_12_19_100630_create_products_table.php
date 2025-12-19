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
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('category_id');
            $table->foreign('category_id')->references('id')->on('categories')->onDelete('cascade');
            $table->string('name', 255);
            $table->string('slug', 255)->unique();
            $table->string('sku', 100)->unique()->nullable();
            $table->text('description')->nullable();
            $table->string('short_description', 500)->nullable();
            $table->decimal('price', 10, 2);
            $table->decimal('discount_price', 10, 2)->nullable();
            $table->integer('discount_percentage')->nullable();
            $table->integer('stock_quantity')->default(0);
            $table->enum('stock_status', ['in_stock', 'out_of_stock', 'low_stock'])->default('in_stock');
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_new')->default(false);
            $table->boolean('is_on_sale')->default(false);
            $table->decimal('rating', 3, 2)->default(0);
            $table->integer('review_count')->default(0);
            $table->string('brand', 100)->nullable();
            $table->string('meta_title', 255)->nullable(); // SEO
            $table->text('meta_description')->nullable(); // SEO
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->softDeletes();
            
            // Indexes
            $table->index('category_id');
            $table->index('slug');
            $table->index('sku');
            $table->index('is_active');
            $table->index('is_featured');
            $table->index('is_new');
            $table->index('is_on_sale');
            $table->index(['price', 'stock_status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
