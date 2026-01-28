<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Support\Str;

class Collection extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'description',
        'type',
        'sort_order',
        'limit',
        'is_active',
    ];

    protected $casts = [
        'sort_order' => 'integer',
        'limit' => 'integer',
        'is_active' => 'boolean',
    ];

    /**
     * Boot du modèle pour auto-générer le slug
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($collection) {
            if (empty($collection->slug)) {
                $collection->slug = Str::slug($collection->name);
            }
        });

        static::updating(function ($collection) {
            if ($collection->isDirty('name') && empty($collection->slug)) {
                $collection->slug = Str::slug($collection->name);
            }
        });
    }

    /**
     * Relation: Produits de cette collection
     */
    public function products(): BelongsToMany
    {
        return $this->belongsToMany(Product::class, 'collection_product')
            ->withPivot('sort_order')
            ->withTimestamps()
            ->orderBy('collection_product.sort_order')
            ->orderBy('products.created_at', 'desc');
    }

    /**
     * Scope: Collections actives seulement
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope: Par type
     */
    public function scopeByType($query, $type)
    {
        return $query->where('type', $type);
    }

    /**
     * Scope: Ordonner par ordre
     */
    public function scopeOrdered($query)
    {
        return $query->orderBy('sort_order', 'asc')->orderBy('name', 'asc');
    }
}
