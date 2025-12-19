<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
    protected $fillable = [
        'user_id',
        'order_number',
        'status',
        'payment_status',
        'payment_method',
        'subtotal',
        'tax',
        'shipping_cost',
        'discount',
        'total',
        'customer_name',
        'customer_email',
        'customer_phone',
        'shipping_address',
        'shipping_city',
        'shipping_postal_code',
        'notes',
    ];

    protected $casts = [
        'subtotal' => 'decimal:2',
        'tax' => 'decimal:2',
        'shipping_cost' => 'decimal:2',
        'discount' => 'decimal:2',
        'total' => 'decimal:2',
    ];

    /**
     * Relation: Utilisateur (peut être null pour les invités)
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Relation: Items de la commande
     */
    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    /**
     * Scope: Par statut
     */
    public function scopeByStatus($query, $status)
    {
        return $query->where('status', $status);
    }

    /**
     * Scope: Commandes en attente
     */
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    /**
     * Scope: Commandes récentes
     */
    public function scopeRecent($query, $limit = 10)
    {
        return $query->latest()->limit($limit);
    }

    /**
     * Accessor: Badge de statut avec couleur
     */
    public function getStatusBadgeAttribute()
    {
        $badges = [
            'pending' => ['text' => 'En attente', 'color' => 'yellow'],
            'processing' => ['text' => 'En traitement', 'color' => 'blue'],
            'shipped' => ['text' => 'Expédiée', 'color' => 'purple'],
            'delivered' => ['text' => 'Livrée', 'color' => 'green'],
            'cancelled' => ['text' => 'Annulée', 'color' => 'red'],
        ];

        return $badges[$this->status] ?? ['text' => $this->status, 'color' => 'gray'];
    }

    /**
     * Accessor: Badge de statut paiement
     */
    public function getPaymentStatusBadgeAttribute()
    {
        $badges = [
            'pending' => ['text' => 'En attente', 'color' => 'yellow'],
            'paid' => ['text' => 'Payé', 'color' => 'green'],
            'failed' => ['text' => 'Échoué', 'color' => 'red'],
            'refunded' => ['text' => 'Remboursé', 'color' => 'gray'],
        ];

        return $badges[$this->payment_status] ?? ['text' => $this->payment_status, 'color' => 'gray'];
    }

    /**
     * Accessor: Nombre total d'articles
     */
    public function getTotalItemsAttribute()
    {
        return $this->items()->sum('quantity');
    }
}
