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
        Schema::table('messages', function (Blueprint $table) {
            // user_id already exists, skip it
            if (!Schema::hasColumn('messages', 'reply')) {
                $table->text('reply')->nullable()->after('content');
            }
            if (!Schema::hasColumn('messages', 'replied_at')) {
                $table->timestamp('replied_at')->nullable()->after('is_read');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('messages', function (Blueprint $table) {
            if (Schema::hasColumn('messages', 'replied_at')) {
                $table->dropColumn('replied_at');
            }
            if (Schema::hasColumn('messages', 'reply')) {
                $table->dropColumn('reply');
            }
        });
    }
};
