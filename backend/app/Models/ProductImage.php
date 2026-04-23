<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProductImage extends Model
{
    protected $fillable = [
        'product_id',
        'image_path',
        'is_primary',
        'sort_order',
    ];

    protected $casts = [
        'is_primary' => 'boolean',
        'sort_order' => 'integer',
    ];

    /**
     * Relation: Produit
     */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * Accessor: URL complète de l'image
     */
    public function getUrlAttribute()
    {
        $path = $this->image_path;

        if (! $path) {
            return asset('images/products/default.png');
        }

        if (str_starts_with($path, 'http')) {
            return $path;
        }

        // Si le chemin commence par /images/ ou images/ (fichiers publics, seeders)
        if (str_starts_with($path, '/images/') || str_starts_with($path, 'images/')) {
            return asset($path);
        }

        // Si le chemin commence déjà par storage
        if (str_starts_with($path, '/storage/') || str_starts_with($path, 'storage/')) {
            return asset($path);
        }

        // Sinon, c'est un fichier stocké dans storage/app/public
        return asset('storage/'.$path);
    }
}
