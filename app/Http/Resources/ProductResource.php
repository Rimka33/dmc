<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
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
            'name' => $this->name,
            'slug' => $this->slug,
            'sku' => $this->sku,
            'description' => $this->description,
            'short_description' => $this->short_description,
            'price' => (float) $this->price,
            'discount_price' => $this->discount_price ? (float) $this->discount_price : null,
            'discount_percentage' => $this->discount_percentage,
            'final_price' => (float) $this->finalPrice,
            'has_discount' => $this->hasDiscount,
            'stock_quantity' => $this->stock_quantity,
            'stock_status' => $this->stock_status,
            'is_featured' => $this->is_featured,
            'is_new' => $this->is_new,
            'is_on_sale' => $this->is_on_sale,
            'rating' => (float) $this->rating,
            'review_count' => $this->review_count,
            'brand' => $this->brand,
            'category' => new CategoryResource($this->whenLoaded('category')),
            'category_name' => $this->whenLoaded('category', function() {
                return $this->category->name;
            }),
            'price_formatted' => number_format($this->finalPrice, 0, ',', '.') . ' FCFA',
            'old_price_formatted' => $this->hasDiscount ? number_format($this->price, 0, ',', '.') . ' FCFA' : null,
            'images' => $this->when(
                $this->relationLoaded('images'),
                function () {
                    return $this->images->map(function ($image) {
                        return [
                            'id' => $image->id,
                            'path' => str_starts_with($image->image_path, '/') || str_starts_with($image->image_path, 'http') 
                                ? asset($image->image_path) 
                                : asset('storage/' . $image->image_path),
                            'is_primary' => $image->is_primary,
                            'type' => preg_match('/\.(mp4|webm|avi|mov)$/i', $image->image_path) ? 'video' : 'image',
                            'order' => $image->sort_order,
                        ];
                    });
                }
            ),
            'primary_image' => $this->primaryImage 
                ? (str_starts_with($this->primaryImage->image_path, '/') || str_starts_with($this->primaryImage->image_path, 'http')
                    ? asset($this->primaryImage->image_path)
                    : asset('storage/' . $this->primaryImage->image_path))
                : asset('images/products/default.png'),
            'features' => $this->when(
                $this->relationLoaded('features'),
                function () {
                    return $this->features->pluck('feature')->toArray();
                }
            ),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
