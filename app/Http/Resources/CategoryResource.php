<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CategoryResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    /**
     * Résout le chemin d'image correctement pour les seeders et storage
     */
    private function resolveImagePath($path)
    {
        if (!$path) {
            return null;
        }

        // Si c'est déjà une URL complète, retourner tel quel
        if (str_starts_with($path, 'http://') || str_starts_with($path, 'https://')) {
            return $path;
        }

        // Si le chemin commence par /images/ (seeders), utiliser asset() tel quel
        if (str_starts_with($path, '/images/')) {
            return asset($path);
        }

        // Si le chemin commence par /storage/, utiliser asset() tel quel
        if (str_starts_with($path, '/storage/')) {
            return asset($path);
        }

        // Si le chemin commence par storage/ (sans /), ajouter / avant
        if (str_starts_with($path, 'storage/')) {
            return asset('/' . $path);
        }

        // Si le chemin commence par /, utiliser asset() tel quel
        if (str_starts_with($path, '/')) {
            return asset($path);
        }

        // Sinon, c'est un chemin storage relatif, ajouter /storage/ avant
        return asset('storage/' . $path);
    }

    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'description' => $this->description,
            'icon' => $this->resolveImagePath($this->icon),
            'image' => $this->resolveImagePath($this->image),
            'is_active' => $this->is_active,
            'order' => $this->sort_order,
            'products_count' => $this->whenCounted('products'),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
