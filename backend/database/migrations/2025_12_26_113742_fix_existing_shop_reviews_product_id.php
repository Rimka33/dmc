<?php

use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Update existing shop reviews to have null product_id
        \App\Models\ProductReview::where('title', 'Avis Site Web')
            ->update([
                'product_id' => null,
                'title' => 'Avis Boutique', // Standardize title
            ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Cannot easily reverse without knowing which product ID to assign back
        // But we can try to restore them to ID 1 if needed
        \App\Models\ProductReview::where('title', 'Avis Boutique')
            ->whereNull('product_id')
            ->update(['product_id' => 1]); // Assuming 1 was the placeholder
    }
};
