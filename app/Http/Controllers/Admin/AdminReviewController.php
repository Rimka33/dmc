<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ProductReview;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminReviewController extends Controller
{
    public function index(Request $request)
    {
        $reviews = ProductReview::with(['product', 'user'])
            ->when($request->search, function ($query, $search) {
                $query->whereHas('product', function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%");
                })
                    ->orWhereHas('user', function ($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%")
                            ->orWhere('email', 'like', "%{$search}%");
                    })
                    ->orWhere('title', 'like', "%{$search}%")
                    ->orWhere('comment', 'like', "%{$search}%");
            })
            ->when($request->rating, function ($query, $rating) {
                $query->where('rating', $rating);
            })
            ->when($request->status === 'approved', function ($query) {
                $query->where('is_approved', true);
            })
            ->when($request->status === 'pending', function ($query) {
                $query->where('is_approved', false);
            })
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Admin/Reviews', [
            'reviews' => $reviews,
            'filters' => $request->only(['search', 'rating', 'status']),
        ]);
    }

    public function show(ProductReview $review)
    {
        $review->load(['product', 'user']);

        return Inertia::render('Admin/Reviews/Show', [
            'review' => $review,
        ]);
    }

    public function update(Request $request, ProductReview $review)
    {
        $validated = $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'title' => 'nullable|string|max:255',
            'comment' => 'nullable|string',
            'is_approved' => 'boolean',
            'is_verified_purchase' => 'boolean',
        ]);

        $review->update($validated);

        // Recalculer la note moyenne du produit
        $this->updateProductRating($review->product_id);

        return redirect()->route('admin.reviews.index')->with('success', 'Avis mis à jour avec succès.');
    }

    public function approve(ProductReview $review)
    {
        $review->update(['is_approved' => true]);
        $this->updateProductRating($review->product_id);

        return redirect()->back()->with('success', 'Avis approuvé.');
    }

    public function reject(ProductReview $review)
    {
        $review->update(['is_approved' => false]);
        $this->updateProductRating($review->product_id);

        return redirect()->back()->with('success', 'Avis rejeté.');
    }

    public function destroy(ProductReview $review)
    {
        $productId = $review->product_id;
        $review->delete();

        // Recalculer la note moyenne du produit
        $this->updateProductRating($productId);

        return redirect()->route('admin.reviews.index')->with('success', 'Avis supprimé.');
    }

    private function updateProductRating($productId)
    {
        if (! $productId) {
            return;
        }

        $approvedReviews = ProductReview::where('product_id', $productId)
            ->where('is_approved', true)
            ->get();

        $averageRating = $approvedReviews->avg('rating');
        $reviewCount = $approvedReviews->count();

        \App\Models\Product::where('id', $productId)->update([
            'rating' => round($averageRating, 2),
            'review_count' => $reviewCount,
        ]);
    }
}
