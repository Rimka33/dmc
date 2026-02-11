<?php

namespace App\Services;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Support\Facades\DB;

class OrderService
{
    /**
     * Générer un numéro de commande unique
     */
    public function generateOrderNumber()
    {
        $prefix = 'DMC-';
        $date = now()->format('Ymd');

        $lastOrder = Order::whereDate('created_at', today())
            ->latest()
            ->first();

        $number = $lastOrder ? intval(substr($lastOrder->order_number, -4)) + 1 : 1;

        return $prefix.$date.'-'.str_pad($number, 4, '0', STR_PAD_LEFT);
    }

    /**
     * Créer une commande
     */
    public function createOrder(array $data, array $cartItems)
    {
        return DB::transaction(function () use ($data, $cartItems) {
            // Vérifier le stock de tous les produits
            foreach ($cartItems as $item) {
                $product = Product::find($item['product_id']);

                if (! $product) {
                    throw new \Exception("Produit {$item['product_id']} non trouvé");
                }

                if ($product->stock_quantity < $item['quantity']) {
                    throw new \Exception("Stock insuffisant pour {$product->name}");
                }
            }

            // Calculer les totaux
            $subtotal = array_sum(array_column($cartItems, 'subtotal'));

            // Frais de livraison : 0 pour pickup, 5000 pour delivery
            $deliveryMethod = $data['delivery_method'] ?? 'delivery';
            $shipping = $deliveryMethod === 'pickup' ? 0 : ($data['shipping_cost'] ?? 5000);

            $tax = $data['tax'] ?? 0;
            $discount = $data['discount'] ?? 0;
            $total = $subtotal + $shipping + $tax - $discount;

            // Créer la commande
            $order = Order::create([
                'user_id' => auth('sanctum')->id(),
                'order_number' => $this->generateOrderNumber(),
                'status' => 'pending',
                'payment_status' => 'pending',
                'payment_method' => $data['payment_method'],
                'subtotal' => $subtotal,
                'tax' => $tax,
                'shipping_cost' => $shipping,
                'discount' => $discount,
                'total' => $total,
                'customer_name' => $data['customer_name'],
                'customer_email' => $data['customer_email'] ?? null,
                'customer_phone' => $data['customer_phone'],
                // Pour pickup, on met une information claire au lieu de null
                'shipping_address' => $deliveryMethod === 'pickup' ? 'RETRAIT EN BOUTIQUE' : ($data['shipping_address'] ?? null),
                'shipping_region' => $data['shipping_region'] ?? null,
                'shipping_city' => $deliveryMethod === 'pickup' ? 'DAROU MOUHTI' : ($data['shipping_city'] ?? null),
                'shipping_neighborhood' => $data['shipping_neighborhood'] ?? null,
                'shipping_postal_code' => $data['shipping_postal_code'] ?? null,
                'notes' => $data['notes'] ?? null,
            ]);

            // Créer les items de commande et décrémenter le stock
            foreach ($cartItems as $item) {
                $product = Product::find($item['product_id']);

                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $product->id,
                    'product_name' => $product->name,
                    'product_sku' => $product->sku,
                    'quantity' => $item['quantity'],
                    'price' => $product->finalPrice,
                    'subtotal' => $product->finalPrice * $item['quantity'],
                ]);

                // Décrémenter le stock
                $product->decrement('stock_quantity', $item['quantity']);

                // Mettre à jour le statut du stock
                if ($product->stock_quantity <= 0) {
                    $product->update(['stock_status' => 'out_of_stock']);
                    NotificationService::notifyLowStock($product);
                } elseif ($product->stock_quantity <= 10) {
                    $product->update(['stock_status' => 'low_stock']);
                    NotificationService::notifyLowStock($product);
                }
            }

            // Notifier les administrateurs
            NotificationService::notifyNewOrder($order->load('items'));

            return $order;
        });
    }

    /**
     * Récupérer une commande par son numéro
     */
    public function getOrderByNumber($orderNumber)
    {
        return Order::with(['items.product.images', 'user'])
            ->where('order_number', $orderNumber)
            ->firstOrFail();
    }

    /**
     * Récupérer les commandes d'un utilisateur
     */
    public function getUserOrders($userId)
    {
        return Order::with(['items.product.images'])
            ->where('user_id', $userId)
            ->latest()
            ->paginate(10);
    }
}
