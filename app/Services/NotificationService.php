<?php

namespace App\Services;

use App\Models\Notification;
use App\Models\User;

class NotificationService
{
    /**
     * Create a notification for a user
     */
    public static function notify($userId, $title, $message, $type = 'info', $data = [])
    {
        return Notification::create([
            'user_id' => $userId,
            'title' => $title,
            'message' => $message,
            'type' => $type,
            'data' => $data,
            'is_read' => false,
        ]);
    }

    /**
     * Notify all admins
     */
    public static function notifyAdmins($title, $message, $type = 'info', $data = [])
    {
        $admins = User::whereHas('roleModel', function ($q) {
            $q->where('slug', 'admin');
        })->orWhere('role', 'admin')->get();

        foreach ($admins as $admin) {
            self::notify($admin->id, $title, $message, $type, $data);
        }
    }

    /**
     * Notify a new order
     */
    public static function notifyNewOrder($order)
    {
        $title = "Nouvelle commande #{$order->order_number}";
        $message = "Une nouvelle commande a été passée par {$order->customer_name} pour un montant de {$order->total_formatted}.";

        self::notifyAdmins($title, $message, 'order', [
            'order_id' => $order->id,
            'order_number' => $order->order_number,
            'url' => "/admin/orders/{$order->id}",
        ]);
    }

    /**
     * Notify low stock
     */
    public static function notifyLowStock($product)
    {
        $status = $product->stock_quantity <= 0 ? 'En rupture' : 'Stock faible';
        $title = "Alerte stock : {$product->name}";
        $message = "Le produit {$product->name} est {$status} (Quantité actuelle : {$product->stock_quantity}).";

        self::notifyAdmins($title, $message, 'stock', [
            'product_id' => $product->id,
            'sku' => $product->sku,
            'stock_quantity' => $product->stock_quantity,
            'url' => "/admin/products/{$product->id}",
        ]);
    }
}
