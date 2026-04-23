<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SpecialOffer extends Model
{
    protected $fillable = [
        'product_id',
        'end_date',
        'available_stock',
        'total_stock',
        'is_active',
    ];

    protected $casts = [
        'end_date' => 'datetime',
        'available_stock' => 'integer',
        'total_stock' => 'integer',
        'is_active' => 'boolean',
    ];

    /**
     * Relation: Produit
     */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * Scope: Offres actives
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true)
            ->where('end_date', '>', now());
    }

    /**
     * Accessor: Pourcentage vendu
     */
    public function getSoldPercentageAttribute()
    {
        if ($this->total_stock == 0) {
            return 0;
        }

        $sold = $this->total_stock - $this->available_stock;

        return round(($sold / $this->total_stock) * 100);
    }

    /**
     * Accessor: Vérifier si l'offre est expirée
     */
    public function getIsExpiredAttribute()
    {
        return $this->end_date->isPast();
    }
}
