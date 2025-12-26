<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class ContactController extends Controller
{
    public function submit(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|email|max:255',
                'subject' => 'nullable|string|max:255',
                'message' => 'required|string',
            ]);

            \App\Models\Message::create([
                'user_id' => auth('sanctum')->id(),
                'name' => $validated['name'],
                'email' => $validated['email'],
                'subject' => $validated['subject'] ?? null,
                'message' => $validated['message'],
                'status' => 'new',
            ]);

            return response()->json([
                'message' => 'Votre message a bien été envoyé !',
                'success' => true
            ]);
        } catch (\Exception $e) {
            \Log::error('Contact Error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Une erreur est survenue sur le serveur. Veuillez réessayer plus tard.'
            ], 500);
        }
    }

    public function userMessages(Request $request)
    {
        $messages = \App\Models\Message::where('user_id', $request->user()->id)
            ->latest()
            ->get();

        return response()->json([
            'success' => true,
            'data' => $messages
        ]);
    }
}
