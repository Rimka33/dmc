<?php

namespace App\Services;

use App\Models\Product;
use Illuminate\Support\Facades\Session;

class CartService
{
    protected $sessionKey = 'shopping_cart';

    /**
     * Récupérer tous les items du panier
     */
    public function getItems()
    {
        $cart = Session::get($this->sessionKey, []);
        $items = [];

        foreach ($cart as $productId => $quantity) {
            $product = Product::with('images')->find($productId);

            if ($product) {
                $items[] = [
                    'product_id' => $product->id,
                    'name' => $product->name,
                    'slug' => $product->slug,
                    'price' => (float) $product->finalPrice,
                    'original_price' => (float) $product->price,
                    'quantity' => $quantity,
                    'subtotal' => (float) $product->finalPrice * $quantity,
                    'image' => $product->primaryImage
                        ? (str_starts_with($product->primaryImage->image_path, '/') || str_starts_with($product->primaryImage->image_path, 'http')
                            ? asset($product->primaryImage->image_path)
                            : asset('storage/'.$product->primaryImage->image_path))
                        : asset('images/products/default.png'),
                    'stock_quantity' => $product->stock_quantity,
                    'in_stock' => $product->stock_quantity >= $quantity,
                ];
            }
        }

        return $items;
    }

    /**
     * Ajouter un produit au panier
     */
    public function add($productId, $quantity = 1)
    {
        $product = Product::findOrFail($productId);

        // Vérifier le stock
        if ($product->stock_quantity < $quantity) {
            throw new \Exception('Stock insuffisant');
        }

        $cart = Session::get($this->sessionKey, []);

        if (isset($cart[$productId])) {
            $newQuantity = $cart[$productId] + $quantity;

            if ($product->stock_quantity < $newQuantity) {
                throw new \Exception('Stock insuffisant');
            }

            $cart[$productId] = $newQuantity;
        } else {
            $cart[$productId] = $quantity;
        }

        Session::put($this->sessionKey, $cart);

        return $this->getItems();
    }

    /**
     * Mettre à jour la quantité d'un produit
     */
    public function update($productId, $quantity)
    {
        $product = Product::findOrFail($productId);

        if ($quantity <= 0) {
            return $this->remove($productId);
        }

        // Vérifier le stock
        if ($product->stock_quantity < $quantity) {
            throw new \Exception('Stock insuffisant');
        }

        $cart = Session::get($this->sessionKey, []);
        $cart[$productId] = $quantity;
        Session::put($this->sessionKey, $cart);

        return $this->getItems();
    }

    /**
     * Retirer un produit du panier
     */
    public function remove($productId)
    {
        $cart = Session::get($this->sessionKey, []);
        unset($cart[$productId]);
        Session::put($this->sessionKey, $cart);

        return $this->getItems();
    }

    /**
     * Vider le panier
     */
    public function clear()
    {
        Session::forget($this->sessionKey);

        return [];
    }

    /**
     * Obtenir le total du panier
     */
    public function getTotal()
    {
        $items = $this->getItems();

        return array_sum(array_column($items, 'subtotal'));
    }

    /**
     * Obtenir le nombre d'articles
     */
    public function getCount()
    {
        $cart = Session::get($this->sessionKey, []);

        return array_sum($cart);
    }

    /**
     * Obtenir le résumé du panier
     */
    public function getSummary()
    {
        $items = $this->getItems();
        $subtotal = $this->getTotal();
        $shipping = $subtotal > 0 ? 5000 : 0; // Frais de livraison fixes
        $tax = 0; // Pas de taxe pour l'instant
        $total = $subtotal + $shipping + $tax;

        return [
            'items' => $items,
            'count' => $this->getCount(), // Nombre de produits distincts
            'totalQuantity' => $this->getCount(), // Quantité totale d'articles (somme des quantités)
            'subtotal' => $subtotal,
            'shipping' => $shipping,
            'tax' => $tax,
            'total' => $total,
            'total_formatted' => number_format($total, 0, ',', ' ').' FCFA',
        ];
    }
}
