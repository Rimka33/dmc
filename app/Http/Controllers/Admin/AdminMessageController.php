<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Message;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminMessageController extends Controller
{
    public function index(Request $request)
    {
        $messages = Message::when($request->search, function ($query, $search) {
            $query->where('name', 'like', "%{$search}%")
                ->orWhere('email', 'like', "%{$search}%")
                ->orWhere('subject', 'like', "%{$search}%")
                ->orWhere('message', 'like', "%{$search}%");
        })
            ->when($request->status, function ($query, $status) {
                $query->where('status', $status);
            })
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Admin/Messages', [
            'messages' => $messages,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    public function show(Message $message)
    {
        // Marquer comme lu si c'est un nouveau message
        if ($message->status === 'new') {
            $message->markAsRead();
        }

        return Inertia::render('Admin/Messages/Show', [
            'message' => $message,
        ]);
    }

    public function update(Request $request, Message $message)
    {
        $validated = $request->validate([
            'status' => 'required|in:new,read,replied,archived',
            'admin_notes' => 'nullable|string',
            'reply' => 'nullable|string',
        ]);

        $updateData = ['status' => $validated['status']];

        if (isset($validated['admin_notes'])) {
            $updateData['admin_notes'] = $validated['admin_notes'];
        }

        if (isset($validated['reply']) && $validated['reply'] !== $message->reply) {
            $updateData['reply'] = $validated['reply'];
            $updateData['replied_at'] = now();
            $updateData['status'] = 'replied';
        }

        if ($validated['status'] === 'read' && ! $message->read_at) {
            $updateData['read_at'] = now();
        }

        $message->update($updateData);

        return redirect()->route('admin.messages.index')->with('success', 'Message mis à jour avec succès.');
    }

    public function markAsRead(Message $message)
    {
        $message->markAsRead();

        return redirect()->back()->with('success', 'Message marqué comme lu.');
    }

    public function markAsReplied(Message $message)
    {
        $message->markAsReplied();

        return redirect()->back()->with('success', 'Message marqué comme répondu.');
    }

    public function archive(Message $message)
    {
        $message->archive();

        return redirect()->back()->with('success', 'Message archivé.');
    }

    public function destroy(Message $message)
    {
        $message->delete();

        return redirect()->route('admin.messages.index')->with('success', 'Message supprimé.');
    }
}
