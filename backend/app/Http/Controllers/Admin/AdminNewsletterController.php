<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Newsletter;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminNewsletterController extends Controller
{
    public function index(Request $request)
    {
        $subscriptions = Newsletter::when($request->search, function ($query, $search) {
            $query->where('email', 'like', "%{$search}%")
                ->orWhere('name', 'like', "%{$search}%");
        })
            ->when($request->status === 'active', function ($query) {
                $query->where('is_active', true);
            })
            ->when($request->status === 'inactive', function ($query) {
                $query->where('is_active', false);
            })
            ->latest('subscribed_at')
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('Admin/Newsletter', [
            'subscriptions' => $subscriptions,
            'stats' => [
                'total' => Newsletter::count(),
                'active' => Newsletter::where('is_active', true)->count(),
                'inactive' => Newsletter::where('is_active', false)->count(),
            ],
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email|max:255|unique:newsletter_subscriptions,email',
            'name' => 'nullable|string|max:255',
        ]);

        Newsletter::create($validated);

        return redirect()->route('admin.newsletter.index')->with('success', 'Abonnement ajouté avec succès.');
    }

    public function update(Request $request, Newsletter $newsletter)
    {
        $validated = $request->validate([
            'email' => 'required|email|max:255|unique:newsletter_subscriptions,email,'.$newsletter->id,
            'name' => 'nullable|string|max:255',
            'is_active' => 'boolean',
        ]);

        $newsletter->update($validated);

        return redirect()->route('admin.newsletter.index')->with('success', 'Abonnement mis à jour avec succès.');
    }

    public function toggleStatus(Newsletter $newsletter)
    {
        if ($newsletter->is_active) {
            $newsletter->unsubscribe();
        } else {
            $newsletter->resubscribe();
        }

        return redirect()->back()->with('success', 'Statut modifié.');
    }

    public function destroy(Newsletter $newsletter)
    {
        $newsletter->delete();

        return redirect()->route('admin.newsletter.index')->with('success', 'Abonnement supprimé.');
    }

    public function export()
    {
        $subscriptions = Newsletter::where('is_active', true)
            ->select('email', 'name', 'subscribed_at')
            ->get();

        $filename = 'newsletter_subscriptions_'.date('Y-m-d').'.csv';

        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
        ];

        $callback = function () use ($subscriptions) {
            $file = fopen('php://output', 'w');

            // En-têtes
            fputcsv($file, ['Email', 'Nom', 'Date d\'inscription']);

            // Données
            foreach ($subscriptions as $subscription) {
                fputcsv($file, [
                    $subscription->email,
                    $subscription->name ?? '',
                    $subscription->subscribed_at->format('Y-m-d H:i:s'),
                ]);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
}
