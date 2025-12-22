<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class QuestionController extends Controller
{
    public function index($productId)
    {
        $questions = \App\Models\Question::with('user')
            ->where('product_id', $productId)
            // Uncomment if we only want to show questions with answers or visible ones
            // ->where('is_visible', true) 
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $questions
        ]);
    }

    public function store(Request $request, $productId)
    {
        $request->validate([
            'question' => 'required|string|max:500',
        ]);

        $question = \App\Models\Question::create([
            'user_id' => auth()->id(),
            'product_id' => $productId,
            'question' => $request->question,
            'is_visible' => true, // Default true for now
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Votre question a été soumise avec succès.',
            'data' => $question
        ]);
    }
}
