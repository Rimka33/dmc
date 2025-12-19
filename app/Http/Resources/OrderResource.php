<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'order_number' => $this->order_number,
            'status' => $this->status,
            'status_label' => match($this->status) {
                'pending' => 'En attente',
                'processing' => 'En cours de traitement',
                'shipped' => 'Expédiée',
                'delivered' => 'Livrée',
                'cancelled' => 'Annulée',
                default => $this->status
            },
            'payment_status' => $this->payment_status,
            'payment_method' => $this->payment_method,
            'payment_method_formatted' => match($this->payment_method) {
                'cash_on_delivery' => 'Paiement à la livraison',
                'bank_transfer' => 'Transfert Bancaire',
                'mobile_money' => 'Mobile Money (Wave/OM)',
                default => $this->payment_method
            },
            'subtotal' => (float) $this->subtotal,
            'subtotal_formatted' => number_format($this->subtotal, 0, ',', '.') . ' FCFA',
            'tax' => (float) $this->tax,
            'shipping_cost' => (float) $this->shipping_cost,
            'shipping_cost_formatted' => $this->shipping_cost > 0 ? number_format($this->shipping_cost, 0, ',', '.') . ' FCFA' : 'Gratuit',
            'discount' => (float) $this->discount,
            'total' => (float) $this->total,
            'total_formatted' => number_format($this->total, 0, ',', '.') . ' FCFA',
            'customer_name' => $this->customer_name,
            'customer_email' => $this->customer_email,
            'customer_phone' => $this->customer_phone,
            'shipping_address' => $this->shipping_address,
            'shipping_city' => $this->shipping_city,
            'shipping_postal_code' => $this->shipping_postal_code,
            'notes' => $this->notes,
            'items' => $this->items->map(function ($item) {
                return [
                    'id' => $item->id,
                    'product_id' => $item->product_id,
                    'product_name' => $item->product_name,
                    'product_sku' => $item->product_sku,
                    'quantity' => $item->quantity,
                    'price' => (float) $item->price,
                    'price_formatted' => number_format($item->price, 0, ',', '.') . ' FCFA',
                    'subtotal' => (float) $item->subtotal,
                    'subtotal_formatted' => number_format($item->subtotal, 0, ',', '.') . ' FCFA',
                    'product' => new ProductResource($item->product),
                ];
            }),
            'user' => new UserResource($this->whenLoaded('user')),
            'created_at' => $this->created_at?->toISOString(),
            'created_at_formatted' => $this->created_at?->format('d/m/Y H:i'),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
