<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Product extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'category_id',
        'name',
        'slug',
        'sku',
        'description',
        'short_description',
        'price',
        'discount_price',
        'discount_percentage',
        'stock_quantity',
        'stock_status',
        'is_featured',
        'is_new',
        'is_on_sale',
        'rating',
        'review_count',
        'brand',
        'meta_title',
        'meta_description',
        'is_active',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'discount_price' => 'decimal:2',
        'discount_percentage' => 'integer',
        'stock_quantity' => 'integer',
        'is_featured' => 'boolean',
        'is_new' => 'boolean',
        'is_on_sale' => 'boolean',
        'rating' => 'decimal:2',
        'review_count' => 'integer',
        'is_active' => 'boolean',
    ];

    /**
     * Boot du modèle
     */
    protected static function boot()
    {
        parent::boot();

        // Auto-générer le slug
        static::creating(function ($product) {
            if (empty($product->slug)) {
                $product->slug = Str::slug($product->name);
            }
        });

        static::updating(function ($product) {
            if ($product->isDirty('name') && empty($product->slug)) {
                $product->slug = Str::slug($product->name);
            }
        });

        // Mettre à jour le statut de stock automatiquement
        static::saving(function ($product) {
            if ($product->stock_quantity > 10) {
                $product->stock_status = 'in_stock';
            } elseif ($product->stock_quantity > 0) {
                $product->stock_status = 'low_stock';
            } else {
                $product->stock_status = 'out_of_stock';
            }

            // Calculer le pourcentage de réduction si discount_price est défini
            if ($product->discount_price && $product->price > 0) {
                $product->discount_percentage = round((($product->price - $product->discount_price) / $product->price) * 100);
            }
        });
    }

    /**
     * Relation: Catégorie
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * Relation: Images du produit
     */
    public function images(): HasMany
    {
        return $this->hasMany(ProductImage::class)->orderBy('sort_order');
    }

    /**
     * Relation: Features/Caractéristiques
     */
    public function features(): HasMany
    {
        return $this->hasMany(ProductFeature::class)->orderBy('sort_order');
    }

    /**
     * Relation: Offre spéciale
     */
    public function specialOffer(): HasOne
    {
        return $this->hasOne(SpecialOffer::class);
    }

    /**
     * Relation: Order Items
     */
    public function orderItems(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    /**
     * Scope: Produits actifs
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope: Produits en stock
     */
    public function scopeInStock($query)
    {
        return $query->where('stock_status', 'in_stock');
    }

    /**
     * Scope: Produits en vedette
     */
    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    /**
     * Scope: Nouveaux produits
     */
    public function scopeNew($query)
    {
        return $query->where('is_new', true);
    }

    /**
     * Scope: Produits en promotion
     */
    public function scopeOnSale($query)
    {
        return $query->where('is_on_sale', true);
    }

    /**
     * Scope: Filtrer par catégorie
     */
    public function scopeByCategory($query, $categoryId)
    {
        return $query->where('category_id', $categoryId);
    }

    /**
     * Scope: Recherche
     */
    public function scopeSearch($query, $search)
    {
        return $query->where(function ($q) use ($search) {
            $q->where('name', 'like', "%{$search}%")
              ->orWhere('description', 'like', "%{$search}%")
              ->orWhere('sku', 'like', "%{$search}%");
        });
    }

    /**
     * Accessor: Obtenir l'image principale
     */
    public function getPrimaryImageAttribute()
    {
        return $this->images()->where('is_primary', true)->first() 
            ?? $this->images()->first();
    }

    /**
     * Accessor: Obtenir le prix final (avec réduction ou non)
     */
    public function getFinalPriceAttribute()
    {
        return $this->discount_price ?? $this->price;
    }

    /**
     * Accessor: Vérifier si en stock
     */
    public function getIsInStockAttribute()
    {
        return $this->stock_status === 'in_stock';
    }

    /**
     * Accessor: Vérifier si en réduction
     */
    public function getHasDiscountAttribute()
    {
        return $this->discount_price !== null && $this->discount_price < $this->price;
    }
}
