<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Question;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminQuestionController extends Controller
{
    public function index(Request $request)
    {
        $questions = Question::with(['product', 'user'])
            ->when($request->search, function($query, $search) {
                $query->whereHas('product', function($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%");
                })
                ->orWhereHas('user', function($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%");
                })
                ->orWhere('question', 'like', "%{$search}%")
                ->orWhere('answer', 'like', "%{$search}%");
            })
            ->when($request->status === 'answered', function($query) {
                $query->whereNotNull('answer');
            })
            ->when($request->status === 'unanswered', function($query) {
                $query->whereNull('answer');
            })
            ->when($request->status === 'visible', function($query) {
                $query->where('is_visible', true);
            })
            ->when($request->status === 'hidden', function($query) {
                $query->where('is_visible', false);
            })
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Admin/Questions', [
            'questions' => $questions,
            'filters' => $request->only(['search', 'status'])
        ]);
    }

    public function show(Question $question)
    {
        $question->load(['product', 'user']);
        return Inertia::render('Admin/Questions/Show', [
            'question' => $question
        ]);
    }

    public function update(Request $request, Question $question)
    {
        $validated = $request->validate([
            'question' => 'required|string',
            'answer' => 'nullable|string',
            'is_visible' => 'boolean',
        ]);

        $question->update($validated);

        return redirect()->route('admin.questions.index')->with('success', 'Question mise à jour avec succès.');
    }

    public function answer(Request $request, Question $question)
    {
        $validated = $request->validate([
            'answer' => 'required|string',
        ]);

        $question->update([
            'answer' => $validated['answer'],
            'is_visible' => true,
        ]);

        return redirect()->back()->with('success', 'Réponse ajoutée avec succès.');
    }

    public function toggleVisibility(Question $question)
    {
        $question->update(['is_visible' => !$question->is_visible]);
        
        return redirect()->back()->with('success', 'Visibilité modifiée.');
    }

    public function destroy(Question $question)
    {
        $question->delete();
        
        return redirect()->route('admin.questions.index')->with('success', 'Question supprimée.');
    }
}
